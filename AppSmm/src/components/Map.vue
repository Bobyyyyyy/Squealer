<script setup>
import {onMounted, ref} from "vue";
const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_geojson=0"
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse?format=json"
const positionName = ref('');
let map;
let marker = {};
let circle = {};



function locParse(places){
  console.log(places);
  let firstCity = places.find(el => el.addresstype === 'city' || el.addresstype === 'town');
  return firstCity || places[0];
}

async function searchLoc(){
  let res = await fetch(`${NOMINATIM_SEARCH_URL}&q=${positionName.value}`,{
    method:"GET",
  })

  let place = locParse(await res.json());

  positionName.value = place.display_name;
  let latlng = L.latLng([Number(place.lat), Number(place.lon)]);
  if (marker) map.removeLayer(marker);
  if(circle) map.removeLayer(circle);

  map.flyTo(latlng, 14);

  marker = L.marker(latlng);
  marker.addTo(map);
}

async function onLocationFound(e) {

  let res = await fetch(`${NOMINATIM_REVERSE_URL}&lat=${e.latlng.lat}&lon=${e.latlng.lng}`,{
    method:"GET",
  })

  let place = await res.json();

  positionName.value = place.display_name;

  let radius = e.accuracy;

  marker = L.marker(e.latlng)
  marker.addTo(map)
  circle = L.circle(e.latlng, radius);
  circle.addTo(map);
}

function onLocationError(e) {
  alert("attiva la localizzazione per accedere alla posizione locale!")
}

onMounted(()=> {
  map = L.map('map').fitWorld();
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
    animate: true,
    center: [44.49842205505314, 11.35597587301307],
  }).addTo(map);

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);

  map.locate({setView: true, maxZoom: 16});
})
</script>


<template>
  <div class="w-100 h-100 d-flex flex-column justify-content-between">
    <div id="map" class="flex-fill mb-2">
    </div>
    <div class="input-group">
      <input  type="text" class="form-control " placeholder="Search..." aria-label="Username" aria-describedby="basic-addon1"
              v-model="positionName" @keyup.enter="searchLoc()">
      <button type="button" class="btn btn-primary" @click="searchLoc()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>