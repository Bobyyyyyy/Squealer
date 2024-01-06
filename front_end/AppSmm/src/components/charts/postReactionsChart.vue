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
 import {ref} from "vue";

 ChartJS.register(ArcElement,CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

 const ready = ref(false);

 let dataChart = ref({
   'heart': 0,
   'thumbs-up': 0,
   'thumbs-down': 0,
   'heartbreak': 0,
 })

  const props = defineProps({
    reactions: {
      default:null,
    },
  })

 const reacRef = ref(props.reactions);

 function updateChart() {
   ready.value = false;
  if(reacRef.value.value.heart){
    dataChart.value['heart'] = reacRef.value.value['heart'].length;
    dataChart.value['thumbs-up'] = reacRef.value.value['thumbs-up'].length
    dataChart.value['thumbs-down'] = reacRef.value.value['thumbs-down'].length
    dataChart.value['heartbreak'] = reacRef.value.value['heartbreak'].length
    ready.value = true;
  }
 }

 defineExpose({
   updateChart,
 })
</script>

<template>
  <Doughnut v-if="ready"
            :data="{
    labels: ['cuori', 'pollici su', 'pollici giù', 'cuori spezzati'],
    datasets: [
        {
          backgroundColor: ['#df1021','#003da5','#78be20','#000000'],
          data: Object.values(dataChart),
          }
          ]
  }"
            :options = "{
    responsive: false,
    maintainAspectRatio: false
}"
  />
</template>

<style scoped>

</style>