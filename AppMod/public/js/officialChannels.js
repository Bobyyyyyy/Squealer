

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


$(document).ready(() => {
})