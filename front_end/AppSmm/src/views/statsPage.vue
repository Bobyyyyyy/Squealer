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
      <h1 class="m-0 w-100 text-center"> STATISTICHE GENERALI </h1>
      <Popularity30days v-if="dataFirstReady" :post="false" :reactions="dataChart"/>
      <h3 class="m-0 w-100 text-center"> SQUEAL INSERITI QUESTO MESE </h3>
      <PubFrequencyMonth v-if="firstReady" @ready="secondReady = true" />
      <h3 class="m-0 w-100 text-center">  SQUEAL INSERITI NELL'ANNO </h3>
      <PubFrequencyYear v-if="secondReady"/>
    </div>
  </div>
</template>

<style scoped>

</style>
