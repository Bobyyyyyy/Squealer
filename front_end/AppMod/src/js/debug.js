const clearDB = async() => {
    $.ajax({
        url: '/db/user/clearDB',
        type: 'delete',
        success: () => {
            location.reload();
        }
    })
}