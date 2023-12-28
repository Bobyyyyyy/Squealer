function inputMap() {
    const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_geojson=0"
    const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse?format=json"

    let map;
    let marker;
    let circle;

    let position = {
        lat: null,
        lng: null
    }

    async function updatePlaceName(latlng){
        let res = await fetch(`${NOMINATIM_REVERSE_URL}&lat=${latlng.lat}&lon=${latlng.lng}`,{
            method:"GET",
        })
        let place = await res.json();

    }
    function clearMap(){
        if (marker) map.removeLayer(marker);
        if (circle) map.removeLayer(circle);
    }

    function locParse(places){
        let firstCity = places.find(el => el.addresstype === 'city' || el.addresstype === 'town');
        return firstCity || places[0];
    }

    async function go2loc(){
        let res = await fetch(`${NOMINATIM_SEARCH_URL}&q=${positionName.value}`,{
            method:"GET",
        })

        let place = locParse(await res.json());

        let latlng = L.latLng([Number(place.lat), Number(place.lon)]);
        clearMap();

        map.flyTo(latlng, 14);

        marker = L.marker(latlng);
        marker.addTo(map);
    }

    async function onLocationFound(e) {
        // await updatePlaceName(e.latlng);
        let radius = e.accuracy;
        marker = L.marker(e.latlng)
        marker.addTo(map)
        circle = L.circle(e.latlng, radius);
        circle.addTo(map);
        position = e.latlng;
        $('#post-content').html(JSON.stringify(position));
    }

    async function handleClick(e){
        let curZoom = map.getZoom();
        // await updatePlaceName(e.latlng)
        clearMap();
        map.flyTo(e.latlng,curZoom);
        marker = L.marker(e.latlng);
        position = e.latlng;
        $('#post-content').html(JSON.stringify(position));
        marker.addTo(map);
    }
    function onLocationError(e) {
        console.log(e);
        alert(e.message);
    }

    map = L.map('map').fitWorld();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
        animate: true,
        doubleClickZoom: false,
    }).addTo(map);
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.on('click', handleClick)

    map.locate({setView: true, maxZoom: 16});
}

function showMap(id,content) {
    let map;
    let position = JSON.parse(content)
    map = L.map(id).fitWorld();
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        maxZoom: 19,
        attribution: '© OpenStreetMap',
        animate: true,
        doubleClickZoom: false,
    }).addTo(map);

    if(Array.isArray(position)) {
        for (let i = 0;i < position.length; i++) {
            L.marker(position[i]).addTo(map);
        }
    }
    else
        L.marker(position).addTo(map);

    L.circle(position, 3).addTo(map);
    map.setView(position,15);
}