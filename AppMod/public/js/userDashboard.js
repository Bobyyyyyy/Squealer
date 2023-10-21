let LastCall = {
    limit : 5,
    offset: 0,
    users: 0,
    filter: ''

}

let modifyParameters = {
    user: '',
    daily: 0,
    weekly: 0,
    monthly: 0,
    blocked: false
}

function updateModifyParameters()  {
    modifyParameters.user = $('#modUserLabel').html();
    modifyParameters.daily = $('#daily').val();
    modifyParameters.weekly = $('#weekly').val();
    modifyParameters.monthly = $('#monthly').val();
    modifyParameters.blocked = $('#blocked').is(":checked");
}


function updateLastCall(limit,offset,filter,users) {
    LastCall.limit = limit;
    LastCall.offset = offset;
    LastCall.filter = filter;
    LastCall.users = users;
}


function getUsersNumber(filter) {
    $.ajax({
        url:'db/nusers',
        data: {filter: filter},
        async: false,
        type: 'get',
        success: (data) => {
            LastCall.users = data.length;
        }
    })
}


function displayUser() {
    $.ajax({
        url: 'db/userid',
        type: 'get',
        success: (data) => {
            $('#sessionid').html(`@${data.username}`);
        }
    })
}

function modifyUser(filter,daily,weekly,monthly,blocked) {
    $.ajax({
        url: '/db/user',
        type: 'put',
        data: {filter: filter, characters: {daily,weekly,monthly}, blocked : blocked},
        success: () => {
            location.reload();
        }
    })
}


function showUserModal(user,daily,weekly,monthly,blocked) {
    $('#modUserLabel').html(user);
    $('#daily').val(daily);
    $('#weekly').val(weekly);
    $('#monthly').val(monthly);
    if (blocked === 'true') {
        $('#blocked').attr('checked',true);
    }
    else {
        $('#blocked').attr('checked',false);
    }
    $('#modUser').modal("show");
}

function userTable (limit,offset,filter) {
    getUsersNumber(filter);
    updateLastCall(limit,offset,filter,LastCall.users);
    $.ajax({
        url: '/db/users',
        data: {limit: limit, offset: offset, filter: filter},
        type: 'get',
        success: (data) => {
            console.log(data);
            $('#pages').empty();
        let html = `
                    <table class="table table-dark table-hover table-bordered table-striped" style="vertical-align: middle; text-align: center">
                        <thead>
                            <th> Nome </th>
                            <th> Email </th>
                            <th> Caratteri Rimanenti </th>
                            <th> Tipo </th>
                            <th> Bloccato </th>
                        </thead>
                        <tbody>
                            ${$.map(data, (user) => `
                             <tr onclick="showUserModal('${user.username}','${user.characters.daily}','${user.characters.weekly}','${user.characters.monthly}','${user.blocked}')">
                                <td> ${user.username} </td>
                                <td> ${user.email} </td>
                                <td> <ul>
                                        <li> Daily: ${user.characters.daily} </li>
                                        <li> Weekly: ${user.characters.weekly} </li>
                                        <li> Monthly: ${user.characters.monthly} </li> </td>
                                <td> ${user.typeUser} </td>
                                <td> ${user.blocked} </td> 
                            </tr>
                            `).join('\n')}
                        </tbody>
                    </table>
                    `;

        if (offset !== 0) {
            let previous = `<li class="page-item"><a class="page-link" onclick="userTable(LastCall.limit,LastCall.offset - LastCall.limit,LastCall.filter)">Previous</a></li>`
            $('#pages').append(previous);
        }

        let page = `<li class="page-item"><a class="page-link">${LastCall.offset / LastCall.limit + 1}</a></li>`

        if (offset + limit < LastCall.users) {
            let next = `<li class="page-item"><a class="page-link" onclick="userTable(LastCall.limit,LastCall.limit+LastCall.offset,LastCall.filter)">Next</a></li>`
            page = page + next;
        }


        $('#table1').empty().html(html);
        $('#pages').append(page);
},
})
}

$('#filter').on("keyup", () => {
    let value = $('#filter').val();
    userTable(LastCall.limit,LastCall.offset = 0,value);
});

$('#modifyButton').click(() => {
    updateModifyParameters();
    modifyUser(
        modifyParameters.user,
        modifyParameters.daily,
        modifyParameters.weekly,
        modifyParameters.monthly,
        modifyParameters.blocked
    );
})

$(document).ready(function() {
    displayUser();
    userTable(LastCall.limit,LastCall.offset,LastCall.filter);
});
