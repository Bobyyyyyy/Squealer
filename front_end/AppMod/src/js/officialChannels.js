let LastCall = {
    limit : 5,
    offset: 0,
    channels: 0,
    filter: ''
}

function updateLastCall(limit,offset,filter) {
    LastCall.limit = limit;
    LastCall.offset = offset;
    LastCall.filter = filter;
}

function getChannelsNumber(filter) {
    $.ajax({
        url:'/db/official/number',
        data: {filter: filter},
        type: 'get',
        success: (data) => {
            LastCall.channels = data.length;
            getChannels(LastCall.limit,LastCall.offset = 0,filter);
        }
    })
}

function getChannels (limit,offset,filter) {
    updateLastCall(limit,offset,filter);
    $.ajax({
        url:'/db/official/all',
        type:'get',
        data: {limit: limit, offset: offset, filter: filter},
        success: (data) => {
            $('#pages').empty();

            if(data.length === 0) {
                $('#channels').empty().append(`<h4 class="text-white mt-5">Nessun Canale Trovato</h4>`);
                return;
            }

            let html = `${$.map(data,(channel,index) => `
            <div class="mt-3 mx-auto rounded d-flex flex-row bg-back align-items-center text-center channeldiv"style="height:7vh; width: 90vw;">
                <div style="width: 50%;" class="fontcustom"> §${channel.name}</div>
                <div style="width: 50%;" class="fontcustom"> @${channel.creator} </div>
                <div style="width: 50%;" class="fontcustom"> <button class="btn btn-primary" onclick="window.location.href = window.location.href + '/${channel.name}'" > Gestisci </button> </div> 
            </div>`).join('\n')}`;

            if (offset !== 0) {
                let previous = `<li class="page-item" onclick="getChannels(LastCall.limit,LastCall.offset - LastCall.limit,LastCall.filter)"><a class="page-link bg-secondary border-black text-black fw-bold fontcustom"><-</a></li>`
                $('#pages').append(previous);
            }

            let page = `<li class="page-item"><a class="page-link bg-secondary border-black text-black fontcustom">${LastCall.offset / LastCall.limit + 1}</a></li>`

            if (offset + limit < LastCall.channels) {
                let next = `<li class="page-item" onclick="getChannels(LastCall.limit,LastCall.limit+LastCall.offset,LastCall.filter)" ><a class="page-link bg-secondary border-black text-black fw-bold fontcustom"">-></a></li>`
                page = page + next;
            }

            $('#channels').empty().append(html);
            $('#pages').append(page);

        }
    })
}

$('#filter').on("keyup", () => {
    let value = $('#filter').val();
    getChannelsNumber(value);
});

$('#channelform').on("submit",(event) => {
    event.preventDefault();
    console.log($('#silenceable').is(':checked'));
    let newChannel = {
        name: $('#name').val(),
        description: $('#description').val(),
        silenceable: $('#silenceable').is(':checked') === true ? $('#silenceable').val() : undefined,
        profilePicture: $('#picture').val(),
    }

    $.ajax({
        url:'/db/official',
        data: newChannel,
        type: 'POST',
        success: () => {
            location.reload();
        },
        error: (error) => {
            $('#toast-content').empty().html(error.responseJSON.message);
            let toastList = inizializeToast();
            toastList.forEach(toast => toast.show()); // This show them
        }
    })


    console.log(newChannel);
})

function inizializeToast() {
    let toastElList = [].slice.call(document.querySelectorAll('.toast'))
    return toastList = toastElList.map(function(toastEl) {
        // Creates an array of toasts (it only initializes them)
        return new bootstrap.Toast(toastEl) // No need for options; use the default options
    });
}

$(document).ready(() => {
    getChannelsNumber(LastCall.filter);
})
