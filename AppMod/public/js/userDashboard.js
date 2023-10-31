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
}

function updateModifyParameters()  {
    modifyParameters.user = $('#modUserLabel').html();
    modifyParameters.daily = $('#daily').val();
    modifyParameters.weekly = $('#weekly').val();
    modifyParameters.monthly = $('#monthly').val();
}


function updateLastCall(limit,offset,filter) {
    LastCall.limit = limit;
    LastCall.offset = offset;
    LastCall.filter = filter;
}


function getUsersNumber(filter) {
    $.ajax({
        url:'/db/nusers',
        data: {filter: filter},
        async: false,
        type: 'get',
        success: (data) => {
            LastCall.users = data.length;
        }
    })
}

function modifyUser(filter,daily,weekly,monthly) {
    $.ajax({
        url: '/db/user',
        type: 'put',
        data: {filter: filter, characters: {daily,weekly,monthly}},
        success: () => {
            location.reload();
        }
    })
}


function showUserModal(user,daily,weekly,monthly) {
    $('#modUserLabel').html(user);
    $('#daily').val(daily);
    $('#weekly').val(weekly);
    $('#monthly').val(monthly);
    $('#modUser').modal("show");
}

function userTable (limit,offset,filter) {
    getUsersNumber(filter);
    updateLastCall(limit,offset,filter);
    $.ajax({
        url: '/db/users',
        data: {limit: limit, offset: offset, filter: filter},
        type: 'get',
        success: (data) => {
            console.log(data);
            $('#pages').empty();
        let html = `
                    <table class="table table-light table-hover table-bordered table-striped botder border-dark rounded" style="vertical-align: middle; text-align: center;">
                        <!-- Header Tabella -->
                        <thead>
                            <th> Nome </th>
                            <th> Caratteri Rimanenti </th>
                            <th> Tipo </th>
                        </thead>
                        <tbody>
                            ${$.map(data, (user) => `
                            <!-- Righe Tabella -->
                            <tr id="${user.username}">
                                <!-- Nome -->
                                <td> ${user.username} </td>
                                <script> 
                                    if('${user.typeUser}' !== 'mod') {
                                        $('#${user.username}').on('click',() => {showUserModal('${user.username}','${user.characters.daily}','${user.characters.weekly}','${user.characters.monthly}')});
                                    } 
                                </script>
                                <!-- Caratteri e tipo -->
                                <td>
                                <span id="placeholder_${user.username}" style="display:none">Not a Field</span>
                                <ul id="characters_${user.username}">
                                        <li> Daily: ${user.characters.daily} </li>
                                        <li> Weekly: ${user.characters.weekly} </li>
                                        <li> Monthly: ${user.characters.monthly} </li> 
                                <script>LoadChars('${user.username}','${user.typeUser}')</script>
                                </td>
                                <td> ${user.typeUser} </td>
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

function LoadChars(username,type) {
    let placeid = '#placeholder_' + username;
    let charid = '#characters_' + username;
    if(type === 'mod') {
        $(placeid).show();
        $(charid).remove();
    }
    else {
        $(placeid).remove();
    }
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
    );
})

$(document).ready(function() {
    userTable(LastCall.limit,LastCall.offset,LastCall.filter);
});
