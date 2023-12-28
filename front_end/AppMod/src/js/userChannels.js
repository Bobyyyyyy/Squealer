let LastCall = {
    limit : 5,
    offset: 0,
    channels: 0,
    filter: {
        'name': '',
        'creator': '',
        'type': '',
        'sortBy': 'popularity',
        'sort': '',
    }
}


function updateLastCall(limit,offset,filters) {
    LastCall.limit  = limit;
    LastCall.offset = offset;
    LastCall.filter = filters;
}


function getChannelsNumber (filters) {
    $.ajax({
        url:'/db/channel/number',
        data: {filters: filters},
        type: 'get',
        success: (data) => {
            console.log(data.length);
            LastCall.channels = data.length;
            getChannels(LastCall.limit,LastCall.offset = 0,LastCall.filter);
        }
    })
}

function getChannels (limit,offset,filters) {
    updateLastCall(limit,offset,filters);
    $.ajax({
        url:'/db/channel',
        type:'get',
        data: {limit: limit, offset: offset, filters: JSON.stringify(filters)},
        success: (data) => {
            $('#pages').empty();

            if(data.length === 0) {
                $('#channels').empty().append(`<h5 class="text-white mt-3">Nessun Canale Trovato</h5>`);
                return;
            }
            let html = `${$.map(data,(channel) => `
            <div class="mt-3 mx-auto rounded d-flex flex-row align-items-center text-center bg-back channeldiv fontcustom" onclick="window.location.href = window.location.href + '/${channel.name}'" style="height:7vh; width: 90vw;">
                <div style="width: 50%;"> §${channel.name}</> </div>
                <div style="width: 50%;"> @${channel.creator}</> </div>
                <div style="width: 50%;"> ${channel.postNumber}</> </div> 
                <div style="width: 50%;"> ${channel.followerNumber}</> </div> 
                <div style="width: 50%;"> ${channel.type}</> </div> 
            </div>`).join('\n')}`;

            if (offset !== 0) {

                let previous = `<li class="page-item" onclick="getChannels(LastCall.limit,LastCall.offset - LastCall.limit, LastCall.filter)"><a class="page-link page-link bg-secondary border-black text-black fw-bold fontcustom" ><-</a></li>`
                $('#pages').append(previous);
            }

            let page = `<li class="page-item"><a class="page-link page-link bg-secondary border-black text-black fontcustom">${LastCall.offset / LastCall.limit + 1}</a></li>`

            if (offset + limit < LastCall.channels) {
                let next = `<li class="page-item"  onclick="getChannels(LastCall.limit,LastCall.offset + LastCall.limit,LastCall.filter)"><a class="page-link page-link bg-secondary border-black text-black fw-bold fontcustom">-></a></li>`
                page = page + next;
            }

            $('#channels').empty().append(html);
            $('#pages').append(page);


        }
    })


}


$('#orderby').on('change',() => {

    let orderBy = $('#orderby option:selected').val();

    if(orderBy === 'popularity') {
        let options = `<label for="order"></label><select class="select btn bg-secondary fontcustom" id="order" autocomplete="off">
                                  <option value="" selected disabled>Ordine</option>
                                  <option value="popular">Piu' popolari</option>
                                  <option value="unpopular">Meno Popolari</option>
                              </select>`
        LastCall.filter.sortBy = orderBy;
        LastCall.offset = 0;
        $('#options').empty().html(options);
    }

    else if(orderBy === 'posts') {
        let options = `<label for="order"></label><select class="select btn bg-secondary fontcustom"  id="order" autocomplete="off">
                                  <option value="" selected disabled>Ordine</option>
                                  <option value="ascending">Crescente</option>
                                  <option value="descending">Descrescente</option>
                              </select>`
        LastCall.filter.sortBy = orderBy;
        LastCall.offset = 0;
        $('#options').empty().html(options);
    }

    $('#order').on('change', () => {
        LastCall.filter.sort = $('#order option:selected').val();
        LastCall.offset = 0;
        getChannelsNumber(LastCall.filter)
    })

})


$('#order').on('change', () => {
    LastCall.filter.sort = $('#order option:selected').val();
    LastCall.offset = 0;
    getChannelsNumber(LastCall.filter)
})


$('#channel-visual').on('change',() => {
    LastCall.filter.type = $('#channel-visual input:checked').val();
    LastCall.offset = 0;
    getChannelsNumber(LastCall.filter)
})

$('#filter').on("keyup", () => {
    let value = $('#filter').val();

    switch ($('#search-type option:selected').val()) {

        case 'name':
            LastCall.filter.creator = '';
            LastCall.filter.name = value;
            break;

        case 'creator':
            LastCall.filter.name = '';
            LastCall.filter.creator = value;
    }

    LastCall.offset = 0;
    getChannelsNumber(LastCall.filter);
});

$('#addChannelForm').on('submit', (event) => {
    event.preventDefault();

    let newChannel = {
        name: $('#name').val(),
        creator: $('#creator').val(),
        description: $('#description').val(),
        type: $('#public').is(':checked') ? $('#public').val() : $('#private').val()
    }



    $.ajax({
        url:'/db/channel',
        data: newChannel,
        type: 'POST',
        success: (data) => {
            location.reload();
        },
        error: (error) => {
            $('#toast-content').empty().html(error.responseText);
            let toastList = inizializeToast();
            toastList.forEach(toast => toast.show()); // This show them
        }

    })

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
