<script setup>
import {Bar} from "vue-chartjs";
import {computed, onMounted, ref} from "vue";
import {getPostsDate} from "../../utils/functions.js";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import {useStore} from "vuex";

const store = useStore();
const vip = computed(()=> store.getters.getVip);

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

let num2Month = {1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"May", 6:"Jun", 7:"Jul", 8:"Aug", 9:"Sep", 10:"Oct", 11:"Nov", 12:"Dec"}

let postPerMonth = {"Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0, "Jul":0, "Aug":0, "Sep":0, "Oct":0, "Nov":0, "Dec":0}
let barReady = ref(false);

onMounted(async () => {
  (await getPostsDate(vip.value.name, false)).forEach(date => {
    let monthPost = num2Month[parseInt(date.split('-')[1])]
    postPerMonth[monthPost] += 1;
  })
  barReady.value = true;
})

</script>

<template>
  <Bar v-if="barReady" :data="{
        labels: Object.values(num2Month),
        datasets:[
            {
              label:'Squeals',
              backgroundColor: '#EA7F28',
              data: Object.values(postPerMonth),
            }
        ]
       }"/>
</template>