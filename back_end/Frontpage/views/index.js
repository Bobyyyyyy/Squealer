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

$('#register-form').on('submit', event => {
    event.preventDefault();

    let newUser = {
        name: $('input[name="user"]').val(),
        password: $('input[name="password"]').val(),
        type: $('input[name="type"]:checked').val(),
        answer: $('input[name="answer"]').val(),
    }

    console.log(newUser)

    $.ajax({
        url: '/register',
        type: 'post',
        data: newUser,
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

$('#password_recovery').on('click', () => {
    $('#recoveryModal').modal('show');
})

$('#change_password_form').on('submit', event => {
    event.preventDefault();

    let user = $('#recovery_username').val();
    let answer = $('#recovery_answer').val();

    console.log(newUser)

    $.ajax({
        url: '/register',
        type: 'post',
        data: newUser,
        success: () => {
            location.reload();
        }
    })
        .fail((error) => {
            $('#error').empty().html(error.responseText);
        })
});
