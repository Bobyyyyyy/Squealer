<script setup>
import {onMounted, ref} from "vue";
import {currentVip} from "../../utils/config.js";
import {Line} from "vue-chartjs";
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const emits = defineEmits(['ready']);

let dataChart = {};
const dataReady = ref(false);

function getLast30Days() {
  let arr2ret = [];
  for (let i = 1; i < 31; i++) {
      let day = (new Date(new Date().setDate(new Date().getDate() - (30 - i))));
      arr2ret.push( day.toString().split(' ').slice(1,3).join(' ') )
  }
  return arr2ret;
}

function getLength(reactions){
  Object.keys(reactions).forEach(typeReac => {
    Object.keys(reactions[typeReac]).forEach(date => {
      reactions[typeReac][date] = reactions[typeReac][date].length;
    })
  })
  return reactions
}

function parseReactionDate(reactions){
  Object.keys(reactions).forEach(typeReac => {
    let reac30days = getLast30Days().reduce((accumulator, value) => {
      return {...accumulator, [value]: []};
    }, {});
    reactions[typeReac].forEach(reac => {
      let monthDay = new Date(reac.date).toString().split(' ').slice(1,3).join(' ')
      reac30days[monthDay].push(reac);
    })
    reactions[typeReac] = reac30days;
  })
  return reactions;
}

function parseReactionType(reactions){
  let reactionType = {
    'heart': [],
    'thumbs-up': [],
    'thumbs-down': [],
    'heartbreak': []
  }
  reactions.forEach(reac => {
    reactionType[reac.rtype].push(reac);
  })
  return reactionType;
}

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
    labels: ['piipppoooo'],
    datasets: [
        {
          label:'heart',
          borderColor:'#FF0000',
          backgroundColor: '#FF0000',
          data: dataChart['heart'],
          cubicInterpolationMode: 'monotone',
        },
        {
          label:'thumbs-up',
          borderColor:'#0000FF',
          backgroundColor: '#0000FF',
          data: dataChart['thumbs-up'],
          cubicInterpolationMode: 'monotone',
        },
        {
          label:'thumbs-down',
          borderColor:'#00FF00',
          backgroundColor: '#00FF00',
          data: dataChart['thumbs-down'],
          cubicInterpolationMode: 'monotone',
        },
        {
          label:'heartbreak',
          borderColor:'#000000',
          backgroundColor: '#000000',
          data: dataChart['heartbreak'],
          cubicInterpolationMode: 'monotone',
        },
    ]
  }"
  />
</template>