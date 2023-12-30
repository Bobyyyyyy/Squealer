$('#login-form').on('submit', event => {
    event.preventDefault();
    $.ajax({
        url: '/login',
        type: 'post',
        data: {user: $('input[name="user"]').val(), password: $('input[name="password"]').val()},
        success: () => {
            location.reload();
        }
    })
    .fail((error) => {
        $('#error').empty().html(error.responseText);
    })
});

$('#guestbutton').on('click',() => {
    $.ajax({
        url:'/guest',
        type: 'post',
        success: () => {
            location.reload();
        }
    })
})