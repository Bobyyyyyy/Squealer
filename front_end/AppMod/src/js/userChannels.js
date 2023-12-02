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
            console.log(data);
            console.log(filters);
            $('#pages').empty();
            let html = `${$.map(data,(channel,index) => `
            <div class="mt-3 mx-auto rounded d-flex flex-row align-items-center text-center channeldiv" onclick="window.location.replace(window.location.href + '/${channel.name}')" style="height:5vh; width: 90vw;">
                <div style="width: 50%;"> §${channel.name}</> </div>
                <div style="width: 50%;"> @${channel.creator}</> </div>
                <div style="width: 50%;"> ${channel.postNumber}</> </div> 
                <div style="width: 50%;"> ${channel.followerNumber}</> </div> 
                <div style="width: 50%;"> ${channel.type}</> </div> 
            </div>`).join('\n')}`;

            if (offset !== 0) {

                let previous = `<li class="page-item"><a class="page-link" onclick="getChannels(LastCall.limit,LastCall.offset - LastCall.limit, LastCall.filter)">Previous</a></li>`
                $('#pages').append(previous);
            }

            let page = `<li class="page-item"><a class="page-link">${LastCall.offset / LastCall.limit + 1}</a></li>`

            if (offset + limit < LastCall.channels) {
                let next = `<li class="page-item"><a class="page-link" onclick="getChannels(LastCall.limit,LastCall.offset + LastCall.limit,LastCall.filter)">Next</a></li>`
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
        let options = `<label for="order"></label><select class="select btn btn-success" id="order" autocomplete="off">
                                  <option value="" selected disabled>Ordine</option>
                                  <option value="popular">Piu' popolari</option>
                                  <option value="unpopular">Meno Popolari</option>
                              </select>`
        LastCall.filter.sortBy = orderBy;
        $('#options').empty().html(options);
    }

    else if(orderBy === 'posts') {
        let options = `<label for="order"></label><select class="select btn btn-success" id="order" autocomplete="off">
                                  <option value="" selected disabled>Ordine</option>
                                  <option value="ascending">Crescente</option>
                                  <option value="descending">Descrescente</option>
                              </select>`
        LastCall.filter.sortBy = orderBy;
        $('#options').empty().html(options);
    }

    $('#order').on('change', () => {
        LastCall.filter.sort = $('#order option:selected').val();
        getChannelsNumber(LastCall.filter)
    })

})


$('#order').on('change', () => {
    LastCall.filter.sort = $('#order option:selected').val();
    getChannelsNumber(LastCall.filter)
})


$('#channel-visual').on('change',() => {
    LastCall.filter.type = $('#channel-visual input:checked').val();
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

    getChannelsNumber(LastCall.filter);
});


$(document).ready(() => {
    getChannelsNumber(LastCall.filter);
})
