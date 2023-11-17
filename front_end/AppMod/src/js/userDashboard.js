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
        type: 'get',
        success: (data) => {
            LastCall.users = data.length;
            userTable(LastCall.limit,LastCall.offset = 0,LastCall.filter);
        }
    })
}

//TODO SPOSTARLA NEL CLICK DEL BOTTONE (COSI' NESSUNO PUò CHIAAMRLA A LIVELLO CLIENT)

function modifyUser(parameters) {
    parameters = JSON.parse(parameters);
    let maxQuota = {
        daily: $('#max-daily').html(),
        weekly: $('#max-weekly').html(),
        monthly: $('#max-monthly').html(),
    }

    if(parseInt(parameters.daily)  > parseInt(maxQuota.daily) || parseInt(parameters.weekly) > parseInt(maxQuota.weekly) || parseInt(parameters.monthly)  > parseInt(maxQuota.monthly)) {
        alert('Max Quota Exceeded');
        return 0;
    }

    $.ajax({
        url: '/db/user',
        type: 'put',
        data: {filter: parameters.user, characters: {daily: parameters.daily,weekly: parameters.weekly,monthly: parameters.monthly}},
        success: () => {
            location.reload();
        }
    })

}


function showUserModal(username,remainingQuota,maxQuota) {
    $('#max-daily').html(maxQuota.daily);
    $('#max-weekly').html(maxQuota.weekly);
    $('#max-monthly').html(maxQuota.monthly);
    $('#modUserLabel').html(username);
    $('#daily').val(remainingQuota.daily);
    $('#weekly').val(remainingQuota.weekly);
    $('#monthly').val(remainingQuota.monthly);
    $('#modUser').modal("show");
}

function userTable (limit,offset,filter) {
    updateLastCall(limit, offset, filter);
    $.ajax({
        url: '/db/user/all',
        data: {limit: limit, offset: offset, filter: filter},
        type: 'get',
        success: (data) => {
            $('#pages').empty();
            let header = `<table class="table table-dark table-striped table-hover table-bordered" style="vertical-align: middle; text-align: center;">
                        <!-- Header Tabella -->
                        <thead>
                            <th> Nome </th>
                            <th> Quota Rimanente </th>
                            <th> Quota Massima </th>
                            <th> Popolarita' </th>
                            <th> Impopolarita' </th>
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
                    row = row + `<td><span>Not a Field</span></td><td><span>Not a Field</span></td><td>Not a Field</td><td>Not a Field</td>`
                } else {
                    let remainingQuota = {daily: user.characters.daily,weekly: user.characters.weekly,monthly: user.characters.monthly};
                    let maxQuota = {daily: user.maxQuota.daily, weekly: user.maxQuota.weekly, monthly: user.maxQuota.monthly};
                    row = row + `<td><ul>
                                    <li> Daily: ${user.characters.daily} </li>
                                    <li> Weekly: ${user.characters.weekly} </li>
                                    <li> Monthly: ${user.characters.monthly} </li>
                                 </ul></td>
                                 <td><ul>
                                    <li> Daily: ${user.maxQuota.daily} </li>
                                    <li> Weekly: ${user.maxQuota.weekly} </li>
                                    <li> Monthly: ${user.maxQuota.monthly} </li>
                                 </ul></td>
                                 <td> ${user.popularity}</td>
                                 <td> ${user.unpopularity}</td>
                             <script>
                             $('#user-'+${index}).on('click', () => {
                                showUserModal(${user.username},${JSON.stringify(remainingQuota)},${JSON.stringify(maxQuota)});
                             })
                             </script>`
                }
                row = row + `<td> ${user.typeUser} </td></tr>`;

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
    LastCall.filter = value;
    getUsersNumber(value);
});

$('#modifyButton').click(() => {
    updateModifyParameters();
    modifyUser(
        JSON.stringify(modifyParameters)
    );
})

$(document).ready(function() {
    getUsersNumber(LastCall.filter);
});
