const User = $('#session-user').html();
let post = ''

let LastCall = {
    posts: 0,
    filters: {
        'name': '',
        'typeFilter': '',
        'destType': '',
        'channel': '',
        'user': '',
        'keyword' : '',
        'popularity': '',
        'sort': "",
        'offset': 0,
        'limit' : 5,
    }
}

const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;


function updateLastCall(filters) {
    LastCall.limit  = filters.limit;
    LastCall.offset = filters.offset;
    LastCall.filter = filters.filter;
}


function getPostsNumber (filter) {
    $.ajax({
        url:'/db/post/number',
        data: {filter: filter},
        type: 'get',
        success: (data) => {
            LastCall.posts = data.length;
            showPosts(LastCall.filters)
        }
    })
}

const showPosts = (filters,append = false) => {
    updateLastCall(filters);
    $.ajax({
        url: '/db/post/all',
        data: filters,
        type: 'get',
        success: (posts) => {
            if (posts.length === 0) {
                $('#posts').empty().append(`<h4 class="mt-5 text-white fw-bold">Nessun Post Trovato</h4>`);
                $('#under_posts').empty();
                return;
            }
            let html = `${$.map(posts, (post) => {
                let destinationNames = []
                let officialChannelNames = [];

                post.destinationArray.forEach(destination => {
                    if (destination.destType === "channel") {
                        destinationNames.push('§' + destination.name + '');
                    }

                    if (destination.destType === "user") {
                        destinationNames.push('@' + destination.name)
                    }
                    
                    if(destination.destType === "keyword") {
                        destinationNames.push('#' + destination.name);
                    }
                })

                post.officialChannelsArray.forEach(destination => {
                    officialChannelNames.push('§' + destination);
                })


                const id = post._id;
                let reactions = {
                    heart: post.reactions.filter((reaction) => reaction.rtype === 'heart').length,
                    heartbreak: post.reactions.filter((reaction) => reaction.rtype === 'heartbreak').length,
                    'thumbs-up': post.reactions.filter((reaction) => reaction.rtype === 'thumbs-up').length,
                    'thumbs-down': post.reactions.filter((reaction) => reaction.rtype === 'thumbs-down').length,
                }

                let Post =
                    `<div id="post-${id}" class="card mt-5 border-black fontcustom" style="width: 60vw;">
                    <div id="header-${id}" class="card-header d-flex flex align-items-center bg-primary">
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row align-items-center justify-content-start">
                            <img src="${post.profilePicture}" alt="profile picture" style="width: 6%; aspect-ratio: 1; border-radius: 50%" class=" m-2 ms-0" >
                            <div class="fw-bold">@${post.owner}</div>
                            <div class="ms-1 fw-light">/${post.popularity}</div> 
                        </div>
                        
                        <div class="d-flex flex-row justify-content-start align-items-center fontcustom" style="">
                            <div class="fw-light">${destinationNames}</div>
                            <div class="ms-1 fw-light">${officialChannelNames}</div> 
                        </div>
                    </div>
                        
                        
                        <div class="d-flex flex-row ms-auto flex-wrap">
                            <div class="btn-group dropup">
                                <button class="btn fontcustom" onclick="getReplies('${post._id}')" data-bs-toggle="tooltip" data-bs-placement="top" title="Mostra risposte" ><i class="bi bi-chat-square-text-fill" ></i></button>
                                <button class="btn fontcustom"  data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots"></i></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li onclick = "post = '${post._id}'" class="dropdown-item fontcustom" data-bs-toggle="modal" data-bs-target="#changeReactions"> Modifica Reazioni</li>
                                    <li  onclick = "post = '${post._id}'" class="dropdown-item fontcustom" data-bs-toggle="modal" data-bs-target="#changeDestination"> Aggiungi destinatario </li>
                                </ul>
                            </div>
                           
                        </div>
                </div>
                <div class="card-body d-flex flex-row bg-back align-items-center justify-content-center">`


                switch (`${post.contentType}`) {
                    case 'text':
                        let parsedText = `${post.content}`.replace(urlRegex, function (url) {
                            return `<a class="fw-bold"  href="${url}" target="_blank">${url}</a>`;
                        })
                        Post = Post + `<span class="w-100 h-100"><p class='card-text lead' style="font-size: 3vh" > ${parsedText} </p></span>`
                        break;

                    case 'image':
                        Post = Post + `<span><img src='${post.content}' class='card-img-top img-fluid' alt="Immagine non valida"></span>`
                        break;

                    case 'geolocation':
                        Post = Post + `<div class="align-self-center" style="height: 50vh; width: 75vw"><div id="map-${id}" class="w-100 h-100" ></div></div>
                          <script>showMap('map-${id}','${post.content}')</script>`
                        break;

                    case 'video':

                        Post = Post + `<iframe src="${post.content}" id="videoContent" allowfullscreen style="height: 50vh; width: 100%"></iframe>`
                        break;
                }

                Post = Post + `</div>
                    <div class="card-footer text-muted bg-back fontcustom">
                        <div class="d-flex flex-row flex-wrap">
                            <div id="reactions-${id}" class="me-auto d-inline-flex"> 
                                <div class="d-flex flex-row"><i class="bi bi-heart-fill"></i> <div class="ms-1">${reactions.heart}</div> </div>
                                <div class="d-flex flex-row ms-3"><i class="bi bi-heartbreak"></i><div class="ms-1">${reactions.heartbreak}</div></div>
                                <div class="d-flex flex-row ms-3"><i class="bi bi-hand-thumbs-up-fill"></i> <div class="ms-1">${reactions["thumbs-up"]}</div></div>
                                <div class="d-flex flex-row ms-3"><i class="bi bi-hand-thumbs-down"></i><div class="ms-1">${reactions["thumbs-down"]}</div></div>
                            </div>
                            <div class="d-flex flex-row"><i class="bi bi-eye"></i></i><div class="ms-1">${post.views.length}</div></div>
                            <div class="d-flex flex-row ms-2"><i class="bi bi-people"></i><div class="ms-1">${post.criticalMass}</div></div>
                            
                            <div id="creation-${id}" class="ms-auto">
                                ${post.dateOfCreation.split('T')[0]},
                                ${post.dateOfCreation.split('T')[1].split('.')[0]}
                            </div>
                        </div>
                    </div>
                        </div>
                <script>
                 $('#delete-${id}').on('click',() => {
                    deletePost('${post._id}');
                });
                </script>`


                return Post
            }).join('\n')}`;

            if (filters.offset + filters.limit < LastCall.posts) {
                $('#under_posts').html(`<div class="mx-auto"> <a id="load_posts" class="link-opacity-100 link-opacity-50-hover bg-secondary text-black rounded p-2 fontcustom"> Carica altri post </a></div>`)
            } else {
                $('#under_posts').empty();
            }


            if (append) {
                $('#posts').append(html);
            } else {
                $('#posts').empty().append(html);
            }

            $('#load_posts').on('click', () => {
                filters.offset = filters.offset + filters.limit;
                showPosts(filters, true);
            })
        }
    })
}



$('#orderby').on('change',() => {

    let orderBy = $('#orderby option:selected').val();

    if(orderBy === 'publication') {
        let options = `<label for="order"></label>
                                <select class="select btn bg-secondary fontcustom" id="order" autocomplete="off">
                                    <option value="" disabled selected>Ordine</option>
                                    <option value="più recente" >Piu' recenti</option>
                                    <option value="meno recente">Meno recenti</option>
                                </select>`
        $('#options').empty().html(options);
    }

    else if(orderBy === 'visuals') {
        let options = `<label for="order"></label><select class="select btn bg-secondary fontcustom" id="order" autocomplete="off">
                                  <option value="" selected disabled>Ordine</option>
                                  <option value="più visual">Decrescente</option>
                                  <option value="meno visual">Crescente</option>
                              </select>`
        $('#options').empty().html(options);
    }

    $('#order').on('change', () => {
        LastCall.filters.sort = $('#order option:selected').val();
        LastCall.filters.offset = 0;
        getPostsNumber(LastCall.filters)
    })

})




$('#order').on('change', () => {
    LastCall.filters.sort = $('#order option:selected').val();
    LastCall.filters.offset = 0;
    getPostsNumber(LastCall.filters);
})


$('#channel-visual').on('change',() => {
    LastCall.filters.popularity = $('#channel-visual input:checked').val();
    LastCall.filters.offset = 0;
    getPostsNumber(LastCall.filters);
})

$('#filter').on("keyup", () => {
    let value = $('#filter').val();
    switch ($('#search-type option:selected').val()) {
        case 'sender':
            LastCall.filters.channel = '';
            LastCall.filters.name = value;
            break;

        case 'receiver':
            LastCall.filters.name = '';
            LastCall.filters.channel = value;
            LastCall.filters.user = value;
            LastCall.filters.keyword = value;
            break;
    }

    LastCall.filters.offset = 0;
    getPostsNumber(LastCall.filters);
});


$('#changeReactionsForm').on('submit',(event) => {
    event.preventDefault();

    let reactions = {
        heart: parseInt($('#heart').val()),
        heartbreak: parseInt($('#heartbreak').val()),
        'thumbs-up': parseInt($('#thumbs-up').val()),
        'thumbs-down': parseInt($('#thumbs-down').val()),
    }

    if(reactions.heart + reactions.heartbreak + reactions["thumbs-up"] + reactions["thumbs-down"] > 500) {
        $('#toast-content').empty().html(`Puoi aggiungere al massimo 500 reactions`);
        let toastList = inizializeToast();
        toastList.forEach(toast => toast.show()); // This show them
        return;
    }

    let allReactions = []
    for (let i = 0; i < reactions.heart; i++) {
        allReactions.push({
            rtype: 'heart',
            user: User,
            date: new Date(),
        })
    }

    for (let i = 0; i < reactions.heartbreak; i++) {
        allReactions.push({
            rtype: 'heartbreak',
            user: User,
            date: new Date(),
        })
    }

    for (let i = 0; i < reactions["thumbs-up"]; i++) {
        allReactions.push({
            rtype: 'thumbs-up',
            user: User,
            date: new Date(),
        })
    }
    for (let i = 0; i < reactions["thumbs-down"]; i++) {
        allReactions.push({
            rtype: 'thumbs-down',
            user: User,
            date: new Date(),
        })
    }

    $.ajax({
        url: '/db/post/updateReaction',
        data: {user: User, reactions: JSON.stringify(allReactions), postId: post},
        type: 'put',
        success: (data) => {
            location.reload();
        },
        error: (error) => {
            $('#toast-content').empty().html(error.responseJSON.message);
            let toastList = inizializeToast();
            toastList.forEach(toast => toast.show()); // This show them
        }
    })


})

$('#addDestinationForm').on('submit',(event) => {
    event.preventDefault();
    let destination = {
        destType: $('#type-select option:selected').val(),
        name: $('#destination-name').val(),
    }

    $.ajax({
        url: '/db/post/destination',
        data: {destination: destination, postID: post},
        type: 'put',
        success: (data) => {
            location.reload();
        },
        error: (error) => {
            console.log(error);
            $('#toast-content').empty().html(error.responseJSON.message);
            let toastList = inizializeToast();
            toastList.forEach(toast => toast.show()); // This show them
        }
    })

})


function inizializeToast() {
    let toastElList = [].slice.call(document.querySelectorAll('.toast'))
    return toastList = toastElList.map(function(toastEl) {
        // Creates an array of toasts (it only initializes them)
        return new bootstrap.Toast(toastEl) // No need for options; use the default options
    });
}

function inizializeToolTips() {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    return tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function getReplies(parentID) {
    $.ajax({
        url: '/db/reply',
        data: {parentid: parentID},
        type: 'GET',
        success: (replies) => {
            let numberOfReplies = replies.length;
            console.log(numberOfReplies)
            if(numberOfReplies === 0) {
                $('#replies').empty().append(`<h4>Nessuna risposta per questo post</h4>`)
                $('#postReplies').modal('show');
                return
            }

            let html = `${$.map(replies, (reply) => {
                let content = `
                  <div id="reply-${reply._id}" class="card mt-3 w-100 border rounded border-black">
                    <div id="header-${reply._id}" class="card-header d-flex flex align-items-center bg-primary">
                        <div class="d-flex flex-column w-100">
                            <div class="d-flex flex-row align-items-center justify-content-start w-100">
                               <img src="${reply.profilePicture}" alt="profile picture" style="width: 5%; aspect-ratio: 1; border-radius: 50%;" class=" m-2 ms-0" >
                                <div class="fw-bold">@${reply.owner}</div>
                                <div class="fw-bold ms-auto">${reply.dateOfCreation.split('T')[0]},
                                ${reply.dateOfCreation.split('T')[1].split('.')[0]}</div>
                                </div>
                        </div>
                    </div>
                    <div class="card-body flex-row bg-back">
                `
                
                let parsedText = `${reply.content}`.replace(urlRegex, function (url) {
                    return `<a class="fw-bold"  href="${url}" target="_blank">${url}</a>`;
                })
                content = content + `<span class="h-100 h-100"><p class='card-text lead'> ${parsedText} </p></span></div>`
                
                
                content = content + `</div>`
                return content;
            }).join('\n')}`;


            $('#replies').empty().append(html)


            $('#postReplies').modal('show');
        }
    })
}


$(document).ready(() => {
    getPostsNumber(LastCall.filters)
    inizializeToolTips();
})

