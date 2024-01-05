<script setup>

import {Line} from "vue-chartjs";
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'
import {onMounted, ref, toRaw} from "vue";
import {getLength, parseReactionDate} from "../../utils/functions.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dataChart = ref({});
const ready = ref(false);

const props = defineProps({
  reactions: {
    default:null
  },
  post: Boolean,
})

const reacRef = ref(props.reactions);


onMounted(()=>{
  if (!(props.post)){
    let tmp = parseReactionDate(toRaw(props.reactions)?.value ? toRaw(props.reactions).value : toRaw(props.reactions));
    dataChart.value = getLength(tmp);
    ready.value = true;
  }
})

function updateChart() {
  ready.value = false;
  if(reacRef.value.value ){
    let tmp = parseReactionDate(toRaw(props.reactions)?.value ? toRaw(props.reactions).value : toRaw(props.reactions));
    dataChart.value = getLength(tmp);
  }
  ready.value = true;
}

defineExpose({
  updateChart,
})

</script>

<template>
    <Line v-if="ready" :data="{
    labels: ['day'],
    datasets: [
        {
          label:'cuori',
          borderColor:'#df1021',
          backgroundColor: '#df1021',
          data: dataChart['heart'],
          cubicInterpolationMode: 'monotone'
        },
        {
          label:'pollici su',
          borderColor:'#003da5',
          backgroundColor: '#003da5',
          data: dataChart['thumbs-up'],
          cubicInterpolationMode: 'monotone'
        },
        {
          label:'pollici giù',
          borderColor:'#78be20',
          backgroundColor: '#78be20',
          data: dataChart['thumbs-down'],
          cubicInterpolationMode: 'monotone'
        },
        {
          label:'cuori spezzati',
          borderColor:'#000000',
          backgroundColor: '#000000',
          data: dataChart['heartbreak'],
          cubicInterpolationMode: 'monotone'
        },
    ]
  }"
        :options="{
    responsive:true,
        }"
  />
</template>