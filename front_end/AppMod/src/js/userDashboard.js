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
        url:'/db/user/number',
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
    updateLastCall(limit, offset, filter);
    $.ajax({
        url: '/db/user/all',
        data: {limit: limit, offset: offset, filter: filter},
        type: 'get',
        success: (data) => {
            console.log(data);
            $('#pages').empty();


            let header = `<table class="table table-light table-hover table-bordered table-striped botder border-dark rounded" style="vertical-align: middle; text-align: center;">
                        <!-- Header Tabella -->
                        <thead>
                            <th> Nome </th>
                            <th> Caratteri Rimanenti </th>
                            <th> Tipo </th>
                        </thead>
                        <tbody>`

            let body = `
        ${$.map(data, (user, index) => {
                let row = `
            <!-- Righe Tabella -->
            <tr id="user-${index}">
            <!-- Nome -->
            <td> ${user.username} </td>`

                if (`${user.typeUser}` === 'mod') {
                    row = row + `<td><span>Not a Field</span></td>`
                } else {
                    row = row + `<td><ul>
                                    <li> Daily: ${user.characters.daily} </li>
                                    <li> Weekly: ${user.characters.weekly} </li>
                                    <li> Monthly: ${user.characters.monthly} </li>
                            </ul></td>
                             <script>
                             $('#user-'+${index}).on('click', () => {
                                showUserModal('${user.username}', '${user.characters.daily}','${user.characters.weekly}','${user.characters.monthly}');
                             })
                             </script>`
                }
                row = row + `<td> ${user.typeUser} </td></tr>
                        >`;

                return row;

            }).join('\n')}`

            if (offset !== 0) {
                let previous = `<li class="page-item"><a class="page-link" onclick="userTable(LastCall.limit,LastCall.offset - LastCall.limit,LastCall.filter)">Previous</a></li>`
                $('#pages').append(previous);
            }

            let page = `<li class="page-item"><a class="page-link">${LastCall.offset / LastCall.limit + 1}</a></li>`

            if (offset + limit < LastCall.users) {
                let next = `<li class="page-item"><a class="page-link" onclick="userTable(LastCall.limit,LastCall.limit+LastCall.offset,LastCall.filter)">Next</a></li>`
                page = page + next;
            }


            $('#table1').empty().html(header + body);
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
    );
})

$(document).ready(function() {
    userTable(LastCall.limit,LastCall.offset,LastCall.filter);
});
