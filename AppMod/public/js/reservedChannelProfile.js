let ChannelName = $('#channel-name').html();

const showChannel = (name) => {
    $.ajax({
        url:'/db/ReservedChannel',
        data: {name: name},
        type: 'get',
        success: (channel) => {
            $('#channel-description').html(channel.description);
            $('#channel-creator').html(channel.creator);
            /*
            let followers = '';
            for (let i = 0; i < data.followers.users.length ; i++) {
                followers = followers + data.followers.users[i];
            }
            */

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


function addAdmin (name,channel) {
    $.ajax({
        url:'/db/ReservedChannel/addAdmin',
        type:'post',
        data: {username: name, channel: channel},
        success: (data) => {
            console.log(data);
        }
    })
}





$(document).ready(() => {
    showChannel(ChannelName);
})
