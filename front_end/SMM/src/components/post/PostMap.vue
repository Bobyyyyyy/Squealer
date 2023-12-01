<script setup>
import {onMounted} from "vue";
const DEFAULT_RADIOUS = 3;

let map;

const props = defineProps({
  latlng:{},
  mapID: String,
})

onMounted(()=> {
  map = L.map(props.mapID).fitWorld();
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
    animate: true,
    doubleClickZoom: false,
  }).addTo(map);
  L.marker(props.latlng).addTo(map);
  L.circle(props.latlng, DEFAULT_RADIOUS).addTo(map);
  map.setView(props.latlng,15);
})
</script>


<template>
  <div class="w-100 h-100 d-flex flex-column justify-content-between flex-fill">
    <div :id="props.mapID" class="flex-fill mb-2 map">
    </div>
  </div>
</template>

<style scoped>
  .map{
    min-height:30vh ;
  }
</style>