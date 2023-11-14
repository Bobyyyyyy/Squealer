<script setup>
import {onMounted, ref} from "vue";
import {currentVip} from "../../utils/config.js";
import {Line} from "vue-chartjs";
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'
import {getLength, parseReactionDate, parseReactionType} from "../../utils/functions.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const emits = defineEmits(['ready']);

let dataChart = {};
const dataReady = ref(false);

onMounted(async ()=> {
  let res =  await fetch(`/db/post/allReactionMonth?user=${currentVip.value}`,{
    method:"GET",
  })

  let reactions = await res.json()

  let reacTypeParsed = parseReactionType(reactions)
  let reacDateTypeParsed = parseReactionDate(reacTypeParsed);
  dataChart = getLength(reacDateTypeParsed);
  console.log((dataChart['heart']));
  dataReady.value = true;
  emits('ready');
})

</script>

<template>
  <Line v-if="dataReady" :data="{
    labels: ['day'],
    datasets: [
        {
          label:'heart',
          borderColor:'#FF0000',
          backgroundColor: '#FF0000',
          data: dataChart['heart'],
          cubicInterpolationMode: 'monotone'
        },
        {
          label:'thumbs-up',
          borderColor:'#0000FF',
          backgroundColor: '#0000FF',
          data: dataChart['thumbs-up'],
          cubicInterpolationMode: 'monotone'
        },
        {
          label:'thumbs-down',
          borderColor:'#00FF00',
          backgroundColor: '#00FF00',
          data: dataChart['thumbs-down'],
          cubicInterpolationMode: 'monotone'
        },
        {
          label:'heartbreak',
          borderColor:'#000000',
          backgroundColor: '#000000',
          data: dataChart['heartbreak'],
          cubicInterpolationMode: 'monotone'
        },
    ]
  }"
  />
</template>