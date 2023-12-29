<script setup>
import {onMounted} from "vue";
const DEFAULT_RADIOUS = 3;

let map;

const props = defineProps({
  latlng:String,
  mapID: String,
})

onMounted(()=> {
  let position = JSON.parse(props.latlng);
  map = L.map(props.mapID).fitWorld();
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
    animate: true,
    doubleClickZoom: false,
  }).addTo(map);
  if(Array.isArray(position)){
    position.forEach((pos,idx) => {
      L.marker(pos).addTo(map);
      L.circle(pos, DEFAULT_RADIOUS).addTo(map);
      if(idx === position.length - 1) map.setView(pos,15);
    })
  }
  else{
    L.marker(position).addTo(map);
    L.circle(position, DEFAULT_RADIOUS).addTo(map);
    map.setView(position,15);
  }
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