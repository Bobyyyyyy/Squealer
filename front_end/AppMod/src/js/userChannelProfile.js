let ChannelName = $('#channel-name').html();
let User = $('#session-user').html();
const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

let LastCall = {
    limit : 5,
    offset: 0,
    posts: 0,
    filter: {
        'typeFilter': '',
        'channel': ChannelName
    }
}


function updateLastCall(limit,offset,filter) {
    LastCall.limit = limit;
    LastCall.offset = offset;
    LastCall.filter.typeFilter = filter;
}


function getPostsNumber (filter) {
    $.ajax({
        url:'/db/post/number',
        data: {filter: filter},
        type: 'get',
        success: (data) => {
            LastCall.posts = data.length;
            $('#post-trovati').html(`${data.length}`);
            showPosts(LastCall.filter.typeFilter,LastCall.offset = 0,LastCall.limit);
        }
    })
}



const showChannel = (name) => {
    $.ajax({
        url:`/db/channel/${name}`,
        type: 'get',
        success: (channel) => {
            $('#channel-description').html(channel.description);
            $('#channel-creator').html(channel.creator);
            $('#posts-number').html(channel.postNumber);
            $('#followers').html(channel.followerNumber);
            channel.isBlocked ? $('#block-button').html(`Sblocca canale`) : $('#block-button').html(`Blocca canale`)
            getPostsNumber(LastCall.filter)
        }
    })
}

const showPosts = (filter,offset,limit,append = false) => {
    updateLastCall(limit,offset,filter);
    $.ajax({
        url:'/db/post/all',
        data: {channel: ChannelName, typeFilter: filter , offset: offset, limit: limit},
        type: 'get',
        success: (posts) => {
            if(posts.length === 0) {
                $('#posts').empty().append(`<h4>Nessun Post Trovato</h4>`);
                $('#under_posts').empty();
                return;
            }
            let html = `${$.map(posts, (post) => {
                
                let destinationNames = []
                let officialChannelNames = [];
                
                post.destinationArray.forEach(destination => {
                    if(destination.destType === "channel") {
                        destinationNames.push('§' + destination.name + '');
                    }
    
                    if(destination.destType === "user") {
                        destinationNames.push('@' + destination.name);
                    }


                })

                post.officialChannelsArray.forEach(destination => {
                    officialChannelNames.push('§' + destination);
                })
                
                
                let id = post._id;
                let reactions = {
                    heart: post.reactions.filter((reaction) => reaction.rtype === 'heart').length,
                    heartbreak : post.reactions.filter((reaction) => reaction.rtype === 'heartbreak').length,
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
                                </ul>
                            </div>
                            
                            <button class="btn " id="delete-${id}"><i  class="bi bi-trash"></i></button>
                        </div>
                </div>
                <div class="card-body flex-row" style="background-color: #ECEAF5">`


                switch (`${post.contentType}`) {
                    case 'text':
                        let parsedText = `${post.content}`.replace(urlRegex, function(url) {
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

                Post = Post +`</div>
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

            if (offset + limit < LastCall.posts) {
                $('#under_posts').html(`<div class="mx-auto"> <a id="load_posts" class="link-opacity-100 link-opacity-50-hover"> Carica altri post</a></div>`)
            }
            else {
                $('#under_posts').empty();
            }



            if (append) {
                $('#posts').append(html);
            }
            else {
                $('#posts').empty().append(html);
            }

            $('#load_posts').on('click',() => {
                showPosts(filter,offset+limit,limit,true);
            })

        }
    })
}

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


$('#block-button').on('click', () => {
    $.ajax({
        url: '/db/channel/block',
        data: {user: User, channel: ChannelName},
        type: 'put',
        success: (data) => {
            location.reload();
        }
    })
})


$('#post-filters').on('change', () => {
    LastCall.filter.typeFilter = $('#post-filters input:checked').val();
    getPostsNumber(LastCall.filter)
})

const deletePost = async (id) => {
    $.ajax({
        url:'/db/post/delete',
        data: {destination: ChannelName, postID: id},
        type: 'post',
        success: (post) => {
            location.reload()
        }
    })
}

$(document).ready(() => {
    showChannel(ChannelName);
})
