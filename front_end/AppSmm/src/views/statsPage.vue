<script setup>

import PubFrequencyYear from "../components/charts/PubFrequencyYear.vue";
import Popularity30days from "../components/charts/Popularity30days.vue";
import PubFrequencyMonth from "../components/charts/PubFrequencyMonth.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {parseReactionType} from "../utils/functions.js";
import {useStore} from "vuex";

const store = useStore();
const dataFirstReady = ref(false);
const firstReady = ref(false);
const secondReady = ref(false);
const dataChart = reactive({})

const vip = computed(() => store.getters.getVip);

onMounted(async ()=> {
  let res =  await fetch(`/db/post/allReactionMonth?user=${vip.value.name}`,{
    method:"GET",
  })

  let reactions = await res.json()

  dataChart.value = parseReactionType(reactions)
  dataFirstReady.value = true;
  firstReady.value = true;

})

</script>

<template>
  <div class="centralDiv">
    <div class="marginCD">
      <h1 class="m-0 w-100 text-center fw-bold"> STATISTICHE GENERALI </h1>
      <h3 class="m-0 w-100 text-center">Reazioni negli ultimi 30 giorni</h3>
      <Popularity30days v-if="dataFirstReady" :post="false" :reactions="dataChart"/>
      <hr class="mb-3">
      <h3 class="m-0 w-100 text-center">Squeal postati in questo mese</h3>
      <PubFrequencyMonth v-if="firstReady" @ready="secondReady = true" />
      <hr class="mb-3">
      <h3 class="m-0 w-100 text-center">Squeal postati nell'anno</h3>
      <PubFrequencyYear v-if="secondReady"/>
    </div>
  </div>
</template>

<style scoped>

</style>
