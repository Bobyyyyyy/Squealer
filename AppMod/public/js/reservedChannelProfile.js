let ChannelName = $('#channel-name').html();
let User = $('#session-user').html();

let LastCall = {
    limit : 1,
    offset: 0,
    posts: 0,
    filter: ''
}

function updateLastCall(limit,offset,filter) {
    LastCall.limit = limit;
    LastCall.offset = offset;
    LastCall.filter = filter;
}

// regular expression for link in text
const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

const deletePost = (id) => {
    $.ajax({
        url:'/db/deletePost',
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
        url:'/db/ReservedChannel',
        data: {name: name},
        type: 'get',
        success: (channel) => {
            $('#channel-description').html(channel.description);
            $('#channel-creator').html(channel.creator);
        }
    })
    showPosts();
}

const showPosts = (filter,offset) => {
    $.ajax({
        url:'/db/posts',
        data: {channel: ChannelName, typeFilter: filter , offset: offset},
        type: 'get',
        success: (posts) => {
            $('#post-trovati').html(posts.length);

            let html = `${$.map(posts, (post,index) => {
                let Post =
                    `<div id="post-${index}" class="card mt-5 w-50">
                    <div class="card-header d-flex bg-info border-black align-items-center p-3">
                        @${post.owner}
                        <button class="btn btn-light ms-auto"><i id="delete-${index}" class="bi bi-trash-fill"></i></button>
                </div>
                <div class="card-body">`
                
                switch (`${post.contentType}`) {
                    case 'text':
                        let parsedText = `${post.content}`.replace(urlRegex, function(url) {
                            return `<a href="${url}" target="_blank">${url}</a>`;
                        })
                        Post = Post + `<span><p class='card-text'> ${parsedText} </p></span>`
                        break;

                    case 'image':
                        Post = Post + `<span><img src='${post.content}' class='card-img-top img-fluid' alt="content" style="height: 75vh; width: 100%"></span>`
                        break;

                    case 'geolocation':
                        Post = Post + `<div id="map-'${index}'" class="" style="width: 50vw; height: 50vh"></div>
                          <script> 

                          let map; 
                          let position = JSON.parse('${post.content}')
                             console.log(position);
                             console.log('map-${index}')
                              map = L.map('map-${index}').fitWorld();
                              console.log(map)
                              L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
                                maxZoom: 19,
                                attribution: '© OpenStreetMap',
                                animate: true,
                                doubleClickZoom: false,
                              }).addTo(map);
                              L.marker(position).addTo(map);
                              L.circle(position, 3).addTo(map);
                              map.setView(position,15);  

                        </script>`
                        break;
                }
                
                
                Post = Post +`</div>
                    <div class="card-footer text-muted">
                        ${post.dateOfCreation.split('T')[0]},
                        ${post.dateOfCreation.split('T')[1].split('.')[0]}
                    </div>
                        </div>
                <script>
                 $('#delete-${index}').on('click',() => {
                    deletePost('${post._id}');
                });
                </script>`


                return Post
            }).join('\n')}`;

            $('#posts').empty().append(html);
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
        url: '/db/ReservedChannel/delete',
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

    console.log(content)

  const currentDate = new Date();
    $.ajax({
        url:'/db/addPost',
        data: {post: {name: User, destType: 'official', receiver: ChannelName,
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
                            <label for="content" class="form-label w-100" style>
                                <textarea class="form-control" id="post-content" name="content" rows="3" placeholder="Inserisci testo o link per immagine...." style="resize: none" data-role="none"></textarea>
                            </label>
                       </div>`
            $('#content').empty().html(textInput)
            break;

        case 'image':
            let preview = `
                        <div class="mx-auto ms-2">
                            <button id="preview-button" class="btn btn-success"><i class="bi bi-upload"></i></button>
                        </div>
                        `

            let imageInput = `
                            <div id="content" class="mt-2" style="width: 95%">
                                <label for="content" class="form-label w-100" style>
                                    <textarea class="form-control" id="post-content" name="content" rows="1" placeholder="Inserisci link immagine" style="resize: none" data-role="none"></textarea>
                                </label>
                            </div>`
            $('#content').empty().html(imageInput);
            $('#content').append(preview);
            $('#preview-button').on('click', () => {
                $('#preview').html(`<img src="${$('#post-content').val()}" class='img-fluid mt-3' alt="Image Preview" style="height: 720px; width: 720px">`)
            })
            break;

        case 'geolocation':
            $('#content').empty().html(`<div class="d-flex flex-column" style="width: 80vw; height: 60vh"><div id="map" class="mx-auto ms-2 w-100 h-100"></div><div class="mt-3" id="post-content"></div></div><script src="/js/map.js"></script>`);
            break;
    }
})


$('#post-filters').on('change', () => {
    let filter = $('#post-filters input:checked').val();
    showPosts(filter,LastCall.offset);
})


$(window).on('scroll', () => {
    if($(window).scrollTop() === $(document).height() - $(window).height()) {
            //provare ad aggiornare post tramite scrolldown
    }
})


$(document).ready(() => {
    showChannel(ChannelName);
})
