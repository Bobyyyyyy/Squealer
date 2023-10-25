function displayUser() {
    $.ajax({
        url: '/db/userid',
        type: 'get',
        success: (data) => {
            $('#sessionid').html(`@${data.username}`);
        }
    })
}

$(document).ready(function () {
    displayUser();
} )