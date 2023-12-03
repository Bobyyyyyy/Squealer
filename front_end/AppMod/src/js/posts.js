const User = $('#session-user').html();
let post = ''

let LastCall = {
    posts: 0,
    filters: {
        'name': '',
        'typeFilter': '',
        'destType': '',
        'channel': '',
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
                $('#posts').empty().append(`<h4>Nessun Post Trovato</h4>`);
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
                        destinationNames.push('@' + destination.name);
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
                    `<div id="post-${id}" class="card mt-5 w-50">
                    <div id="header-${id}" class="card-header d-flex flex border-black align-items-center" style="background-color: #CCBEF9">
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row align-items-center justify-content-start">
                            <div class="fw-bold">@${post.owner}</div>
                            <div class="ms-1 fw-light">/${post.popularity}</div> 
                        </div>
                        
                        <div class="d-flex flex-row justify-content-start align-items-center" style="font-size: 10px">
                            <div class="fw-light">${destinationNames}</div>
                            <div class="ms-1 fw-light">${officialChannelNames}</div> 
                        </div>
                    </div>
                        
                        
                        <div class="d-flex flex-row ms-auto">
                            <div class="btn-group dropup">
                                <button class="ms-2 btn"  data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots"></i></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li onclick = "post = '${post._id}'" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#changeReactions"> Modifica Reazioni</li>
                                     <li onclick = "post = '${post._id}'" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#changeDestination"> Modifica Destinatari</li>
                                </ul>
                            </div>
                            
                            <button class="btn " id="delete-${id}"><i  class="bi bi-trash"></i></button>
                        </div>
                </div>
                <div class="card-body flex-row" style="background-color: #ECEAF5">`


                switch (`${post.contentType}`) {
                    case 'text':
                        let parsedText = `${post.content}`.replace(urlRegex, function (url) {
                            return `<a class="fw-bold"  href="${url}" target="_blank">${url}</a>`;
                        })
                        Post = Post + `<span><p class='card-text lead' > ${parsedText} </p></span>`
                        break;

                    case 'image':
                        Post = Post + `<span><img src='${post.content}' class='card-img-top img-fluid' alt="content"></span>`
                        break;

                    case 'geolocation':
                        Post = Post + `<div class="align-self-center" style="height: 50vh"><div id="map-${id}" class="w-100 h-100" ></div></div>
                          <script>showMap('map-${id}','${post.content}')</script>`
                        break;
                }

                Post = Post + `</div>
                    <div class="card-footer text-muted" style="background-color: #ECEAF5">
                        <div class="d-flex flex-row">
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
                $('#under_posts').html(`<div class="mx-auto"> <a id="load_posts" class="link-opacity-100 link-opacity-50-hover"> Carica altri post </a></div>`)
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
                                <select class="select btn btn-success" id="order" autocomplete="off">
                                    <option value="" disabled selected>Ordine</option>
                                    <option value="più recente" >Piu' recenti</option>
                                    <option value="meno recente">Meno recenti</option>
                                </select>`
        $('#options').empty().html(options);
    }

    else if(orderBy === 'visuals') {
        let options = `<label for="order"></label><select class="select btn btn-success" id="order" autocomplete="off">
                                  <option value="" selected disabled>Ordine</option>
                                  <option value="più visual">Crescente</option>
                                  <option value="meno visual">Descrescente</option>
                              </select>`
        $('#options').empty().html(options);
    }

    $('#order').on('change', () => {
        LastCall.filters.sort = $('#order option:selected').val();
        getPostsNumber(LastCall.filters)
    })

})




$('#order').on('change', () => {
    LastCall.filters.sort = $('#order option:selected').val();
    getPostsNumber(LastCall.filters);
})


$('#channel-visual').on('change',() => {
    LastCall.filters.popularity = $('#channel-visual input:checked').val();
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
            break;
    }

    getPostsNumber(LastCall.filters);
});


$('#changeReactionsButton').on('click',() => {

    let reactions = {
        heart: $('#heart').val(),
        heartbreak: $('#heartbreak').val(),
        'thumbs-up': $('#thumbs-up').val(),
        'thumbs-down': $('#thumbs-down').val(),
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

    if(allReactions.length > 500) {
        alert('Puoi aggiungere al massimo 500 reactions!!');
        return;
    }

    $.ajax({
        url: '/db/post/updateReaction',
        data: {user: User, reactions: JSON.stringify(allReactions), postId: post},
        type: 'put',
        success: (data) => {
            location.reload();
        }
    })
})

$('#addDestinationButton').on('click',() => {
    let destination = {
        destType: $('#type-select option:selected').val(),
        name: $('#destination-name').val(),
    }

    $.ajax({
        url: '/db/post/destination',
        data: { destination: destination, postID: post},
        type: 'put',
        success: (data) => {
            location.reload();
        },
        error: (error) => {
            alert(error.responseJSON.mes);
        }
    })

})


$(document).ready(() => {
    getPostsNumber(LastCall.filters)
})
