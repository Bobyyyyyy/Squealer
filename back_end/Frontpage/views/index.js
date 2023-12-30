$('#login-form').on('submit', event => {
    event.preventDefault();
    $.ajax({
        url: '/login',
        type: 'post',
        data: {user: $('input[name="user"]').val(), password: $('input[name="password"]').val()},
        success: () => {
            alert("RELOAD");
            location.reload();}
    })
    .fail((error) => {
        if(error.responseText === 'password errata'){
            $('input[name="password"]').after('<span class="link" style="color: #ea0000 !important;">password errata!</span>');
        }
        else{
            $('input[name="user"]').after('<span class="link" style="color: #ea0000 !important;">utente errato!</span>');
        }
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