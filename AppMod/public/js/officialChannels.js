let LastCall = {
    limit : 5,
    offset: 0,
    channels: 0,
    filter: ''
}

function updateLastCall(limit,offset,filter) {
    LastCall.limit = limit;
    LastCall.offset = offset;
    LastCall.filter = filter;
}

function getChannelsNumber(filter) {
    $.ajax({
        url:'/db/nReservedChannel',
        data: {filter: filter},
        async: false,
        type: 'get',
        success: (data) => {
            console.log(data.length);
            LastCall.channels = data.length;
        }
    })
}

function createChannel (name) {
    $.ajax({
        url: '/db/ReservedChannel',
        type: 'post',
        data: {name: name},
        success: (data) => {
            console.log(data);
        }
    })
}

function deleteChannel(name) {
    $.ajax({
        url: '/db/ReservedChannel/delete',
        type: 'post',
        data: {name: name},
        success: (data) => {
            console.log(data);
        },
    })
}

function addFollower (name,channel) {
    $.ajax({
        url:'/db/ReservedChannel/addFollower',
        type:'post',
        data: {username: name, channel: channel},
        success: (data) => {
            console.log(data);
        }
    })
}

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


function getChannels (limit,offset,filter) {
    getChannelsNumber(filter);
    updateLastCall(limit,offset,filter);
    $.ajax({
        url:'/db/ReservedChannel',
        type:'get',
        data: {limit: limit, offset: offset, filter: filter},
        success: (data) => {
            console.log(data);
            $('#pages').empty();

            let html = `${$.map(data,(channel) => `<div class="mt-3 mx-auto bg-light rounded d-flex flex-row align-items-center text-center" style="height:6vh; width: 90vw">
            <div style="width: 25%;"> ${channel.name}</> </div> 
            <div style="width: 25%"> ${channel.followers.users.length}</div>
            <div style="width: 25%"> ${channel.administrators.users.length}</div>
            <div style="width: 25%"> ${channel.postList.posts.length} </div>
        </div>`).join('\n')}`;

            if (offset !== 0) {
                let previous = `<li class="page-item"><a class="page-link" onclick="getChannels(LastCall.limit,LastCall.offset - LastCall.limit,LastCall.filter)">Previous</a></li>`
                $('#pages').append(previous);
            }

            let page = `<li class="page-item"><a class="page-link">${LastCall.offset / LastCall.limit + 1}</a></li>`

            if (offset + limit < LastCall.channels) {
                let next = `<li class="page-item"><a class="page-link" onclick="getChannels(LastCall.limit,LastCall.limit+LastCall.offset,LastCall.filter)">Next</a></li>`
                page = page + next;
            }

            $('#channels').empty().append(html);
            $('#pages').append(page);

        }
    })
}

$('#filter').on("keyup", () => {
    let value = $('#filter').val();
    getChannels(LastCall.limit,LastCall.offset = 0,value);
});


$(document).ready(() => {
    getChannels(LastCall.limit,LastCall.offset,LastCall.filter);
})