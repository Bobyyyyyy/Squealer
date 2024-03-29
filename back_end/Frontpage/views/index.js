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
        $('#error').empty().html(error.responseJSON.message);
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
            $('#error').empty().html(error.responseJSON.message);
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
    if ($('#recovery_pass').val() != $('#recovery_pass_conf').val()) {
        return;
    }
    let user = $('#recovery_username').val();
    let answer= $('#recovery_answer').val();
    let password = $('#recovery_pass').val();

    let data = {
        user: user,
        answer: answer,
        password: password
    }

    $.ajax({
        url: '/db/user/resetpswd',
        type: 'put',
        data: data,
        success: () => {
            $('#recoveryModal').modal('hide');
            $.ajax({
                url: '/login',
                type: 'post',
                data: {user: user, password: password},
                success: () => {
                    location.reload();
                }
            })
        }
    })
        .fail((error) => {
            $('#message').empty().html(error.responseJSON.message);
        })
});

function clearDB() {
    $.ajax({
        url: '/db/user/clearDB',
        type: 'delete',
        success: () => {
            location.reload()
        }
    })
}


$('#recovery_pass, #recovery_pass_conf').on('keyup',  () => {
    if ($('#recovery_pass').val() != $('#recovery_pass_conf').val())
        $('#message').html('Password non coincidono!').css('color', 'red');
    else  $('#message').html('')
});
