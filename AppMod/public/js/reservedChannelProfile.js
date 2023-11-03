let ChannelName = $('#channel-name').html();
let User = $('#session-user').html();

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


    if($('#typeimage').is(":selected")) {
        contentType = $('#typeimage').attr("value");
    }

    else if ($('#typetext').is(":selected")) {
        contentType = $('#typetext').attr("value");
    }

    content = $('#content').val();

    const currentDate = new Date();
    $.ajax({
        url:'/db/addPost',
        data: {name: User, destType: 'official', receiver: ChannelName,
               contentType: contentType, content: content, dateOfCreation: currentDate},
        type: 'post',
        success: (post) => {
            location.reload();
        }
    })
})


const showPosts = () => {
    $.ajax({
        url:'/db/posts',
        data: {channel: ChannelName},
        type: 'get',
        success: (posts) => {
            $('#post-trovati').html(posts.length);


            let html = `${$.map(posts,(post) => `
            <div class="card mt-5 w-75">
                <div class="card-header d-flex bg-info border-black p-3">
                    @${post.owner}
                    <i id="delete-${post._id}" class="ms-auto bi bi-trash-fill"></i>
                </div>
                <div class="card-body">
                     <span id="${post._id}-text"><p class='card-text'> ${post.content}</p></span>
                    <span id="${post._id}-image"><img src='${post.content}' class='card-img-top' style="height: 75vh; width: 100%"></span>
                     <script> 
                        //distingue tra testo e immagine
                        if('${post.contentType}' === 'image') {
                            $('#${post._id}-text').remove();    
                        }
                        else if ('${post.contentType}' === 'text') {
                            $('#${post._id}-image').remove();
                        }
                        
                        $('#delete-${post._id}').on('click',() => {
                           deletePost('${post._id}');
                       });
                            
                    </script>
                </div>
                <div class="card-footer text-muted">
                    ${post.dateOfCreation.split('T')[0]},
                    ${post.dateOfCreation.split('T')[1].split('.')[0]}
                </div>
            </div>`).join('\n')}`;

            $('#content').append()

            $('#posts').empty().append(html);
        }
    })
}



$(document).ready(() => {
    showChannel(ChannelName);
})
