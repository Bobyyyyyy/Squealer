<script setup>
import {Bar} from "vue-chartjs";
import {computed, onMounted, ref} from "vue";
import {getPostsDate} from "../../utils/functions.js";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import {useStore} from "vuex";

const store = useStore();

const vip = computed(()=>store.getters.getVip);

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


let postPerDay = {
  1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0, 19:0, 20:0, 21:0, 22:0, 23:0, 24:0, 25:0, 26:0, 27:0, 28:0, 29:0, 30:0, 31:0
}
let barReady = ref(false);
const emit = defineEmits(['ready'])

onMounted(async () => {
  (await getPostsDate(vip.value.name, true)).forEach(date => {
    let dayPost = parseInt(date.split(/[^0-9]+/)[2])
    postPerDay[dayPost] += 1;
  })
  barReady.value = true;
  emit('ready');
})

</script>

<template>
  <Bar v-if="barReady" :data="{
        labels: Object.keys(postPerDay),
        datasets:[
            {
              label:`Squeals`,
              backgroundColor: '#EA7F28',
              data: Object.values(postPerDay),
            }
        ]
       }"/>
</template>