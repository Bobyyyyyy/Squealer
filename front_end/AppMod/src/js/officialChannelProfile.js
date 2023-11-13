let ChannelName = $('#channel-name').html();
let User = $('#session-user').html();

let LastCall = {
    limit : 3,
    offset: 0,
    posts: 0,
    filter: ''
}

let post = ''

function updateLastCall(limit,offset,filter) {
    LastCall.limit = limit;
    LastCall.offset = offset;
    LastCall.filter = filter;
}


 function getPostsNumber (filter) {
    $.ajax({
        url:'/db/post/number',
        data: {filter: filter, channel: ChannelName},
        async: false,
        type: 'get',
        success: (data) => {
            LastCall.posts = data.length;
            $('#post-trovati').html(`${data.length}`);
        }
    })
}


// regular expression for link in text
const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

const deletePost = async (id) => {
    $.ajax({
        url:'/db/post/delete',
        data: {id: id},
        type: 'post',
        success: (post) => {
            console.log(post);
            location.reload()
        }
    })
}

const showChannel = (name) => {
    $.ajax({
        url:'/db/official',
        data: {name: name},
        type: 'get',
        success: (channel) => {
            $('#channel-description').html(channel.description);
            $('#channel-creator').html(channel.creator);
        }
    })
    showPosts(LastCall.filter,LastCall.offset,LastCall.limit);
}

const showPosts = (filter,offset,limit,append = false) => {
    getPostsNumber(filter);
    updateLastCall(limit,offset,filter);
    $.ajax({
        url:'/db/post/all',
        data: {channel: ChannelName, typeFilter: filter , offset: offset, limit: limit},
        type: 'get',
        success: (posts) => {
            console.log(posts)
            let html = `${$.map(posts, (post) => {
                let id = post._id;
                id = id.substring(id.length - 10);
                let reactions = {
                    heart: post.reactions.filter((reaction) => reaction.rtype === 'heart').length,
                    heartbreak : post.reactions.filter((reaction) => reaction.rtype === 'heartbreak').length,
                    'thumbs-up': post.reactions.filter((reaction) => reaction.rtype === 'thumbs-up').length,
                    'thumbs-down': post.reactions.filter((reaction) => reaction.rtype === 'thumbs-down').length,
                }
                
                let Post =
                    `<div id="post-${id}" class="card mt-5 w-50">
                    <div class="card-header d-flex bg-info border-black align-items-center p-3 h5 fw-bold">
                        @${post.owner}
                        <div class="d-flex flex-row ms-auto">
                            <div class="btn-group dropup">
                                <button class="ms-2 btn btn-info"  data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots"></i></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li onclick = "post = '${post._id}'" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#changeReactions"> Modifica Reazioni</li>
                                </ul>
                            </div>
                            
                            <button class="btn btn-info" id="delete-${id}"><i  class="bi bi-trash"></i></button>
                        </div>
                </div>
                <div class="card-body flex-row">`
                
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
                    <div class="card-footer text-muted">
                        <div class="d-flex flex-row">
                            <div id="reactions-${id}" class="me-auto d-inline-flex"> 
                                <div class="d-flex flex-row"><i class="bi bi-heart-fill"></i> <div class="ms-1">${reactions.heart}</div> </div>
                                <div class="d-flex flex-row ms-3"><i class="bi bi-heartbreak"></i><div class="ms-1">${reactions.heartbreak}</div></div>
                                <div class="d-flex flex-row ms-3"><i class="bi bi-hand-thumbs-up-fill"></i> <div class="ms-1">${reactions["thumbs-up"]}</div></div>
                                <div class="d-flex flex-row ms-3"><i class="bi bi-hand-thumbs-down"></i><div class="ms-1">${reactions["thumbs-down"]}</div></div>
                            </div>
                            <div class="d-flex flex-row "><i class="bi bi-eyeglasses"></i><div class="ms-1">${post.views}</div></div>
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


$('#modify-description').on('click', () => {
    let textarea = `<textarea class="form-control" id="description" name="description" cols="130" rows="1" maxlength="150" style="resize: none;" data-role="none">${$('#channel-description').html()}</textarea>`
    $('#channel-description').replaceWith(textarea);
    $('#modify-description').hide()
    $('#modify-button').show()
})

$('#modify-button').on('click' ,() => {
    let newDescription = $('#description').val();
    $.ajax({
        url:'/db/ReservedChannel',
        data: {channel:ChannelName ,description: newDescription},
        type: 'put',
        success: () => {
            location.reload();
        }
    })
})

$('#delete-button').on('click', () => {
    $.ajax({
        url: '/db/official/delete',
        type: 'post',
        data: {name: ChannelName},
        success: () => {
            window.location.href = '/mod/officialChannels';
        }
    })
})


$('#addPostButton').on('click',(contentType, content) => {
    contentType = $('#type-select option:selected').val();

    console.log(contentType);

    if(contentType === 'geolocation') {
        content = $('#post-content').html();
    }
    else {
        content = $('#post-content').val();
    }


    let destinations = []

    destinations.push({
        destType: 'official',
        name: ChannelName,
    });



    const currentDate = new Date();
    $.ajax({
        url:'/db/post',
        data: {post: {creator: User, destinations: JSON.stringify(destinations),
                contentType: contentType, content: content, dateOfCreation: currentDate}},
        type: 'post',
        success: (post) => {
            location.reload();
        }
    })
})

$('#type-select').on('change',() => {
    $('#preview').empty();
    let contentType = $('#type-select option:selected').val();
    switch (contentType) {
        case 'text':
            let textInput = `
                        <div id="content" class="mt-2" style="width: 100%">
                            <div class="d-flex flex-row align-items-center">
                                <label for="short-link" class="mt-2 form-label w-25">
                                    <textarea class="form-control" id="short-link" name="shortener" rows="1" placeholder="Inserisci link" style="resize: none" data-role="none" autocomplete="off"></textarea>
                                </label>
                                <button type="button" id="shortener-button" class="btn btn-primary ms-2"> Accorcia link </button>
                            </div>
                            <label for="post-content" class="form-label w-100" style>
                                <textarea class="form-control" name="content" id="post-content" rows="3" placeholder="Inserisci testo o link per immagine...." style="resize: none" data-role="none" autocomplete="off"></textarea>
                            </label>
                        </div>
`
            $('#content').empty().replaceWith(textInput)
            break;

        case 'image':
            let preview = `
                        <div class="mx-auto">
                            <button id="preview-button" class="btn btn-success ms-2"><i class="bi bi-upload"></i></button>
                        </div>`

            let imageInput = `
                            <div id="content" class="mt-3 d-flex flex-row" style="width: 100%">
                                <label for="post-content" class="form-label w-100" style>
                                    <textarea class="form-control" id="post-content" name="content" rows="1" placeholder="Inserisci link immagine" style="resize: none" data-role="none" autocomplete="off"></textarea>
                                </label>
                            </div><div id="preview"></div>`
            $('#content').empty().replaceWith(imageInput);
            $('#content').append(preview);
            $('#preview-button').on('click', () => {
                $('#preview').html(`<img src="${$('#post-content').val()}" class='img-fluid mt-3' alt="Image Preview">`)
            })
            break;

        case 'geolocation':
            $('#content').empty().html(`<div class="d-flex flex-column" style=" height: 60vh"><div id="map" class="mx-auto ms-2 w-100 h-100"></div><div class="mt-3" id="post-content"></div></div><script>inputMap()</script>`);
            break;
    }
})


$('#post-filters').on('change', () => {
    let filter = $('#post-filters input:checked').val();
    showPosts(filter,LastCall.offset = 0,LastCall.limit);
})


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
        data: {reactions: JSON.stringify(allReactions), postId: post},
        type: 'put',
        success: (post) => {
            location.reload();
        }
    })
})



$(document).ready(() => {
    showChannel(ChannelName);
})
