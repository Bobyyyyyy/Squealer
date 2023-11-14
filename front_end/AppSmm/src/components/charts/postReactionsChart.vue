<script setup>
 import {Doughnut} from "vue-chartjs";
 import {
   CategoryScale,
   Chart as ChartJS,
   Legend,
   LinearScale,
   LineElement,
   PointElement,
   Title,
   Tooltip,
   ArcElement,
 } from "chart.js";
 import {computed, ref, toRaw, watch} from "vue";
 import {read} from "@popperjs/core";
 const ready = ref(false);
 const isActive = ref(false);
 let dataChart = ref({})

  const props = defineProps({
    reactions: {
      default:null,
    },
  })

 ChartJS.register(ArcElement,CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

 function setIsActive(){
   isActive.value = true;
 }

 watch(props.reactions, (data) => {
   if(data !== null) {
     dataChart.value = toRaw(data)
     ready.value = true;
   }
 })

defineExpose({
  setIsActive,
})
</script>

<template>
  <Doughnut v-if="ready && isActive"
            :data="{
    labels: ['heart', 'thumbs-up', 'thumbs-down', 'heartbreak'],
    datasets: [
        {
          backgroundColor: ['#FF0000','#0000FF','#00FF00','#000000'],
          data: Object.values(dataChart),
          }
          ]
  }"
            :options = "{
  responsive: true,
  maintainAspectRatio: false
}"
  />
</template>

<style scoped>

</style>