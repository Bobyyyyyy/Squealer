<script setup>

import PubFrequencyYear from "../components/charts/PubFrequencyYear.vue";
import Popularity30days from "../components/charts/Popularity30days.vue";
import PubFrequencyMonth from "../components/charts/PubFrequencyMonth.vue";
import {ref} from "vue";

const firstReady = ref(false);
const secondReady = ref(false);

/*
 Andamento del mese:
 - prendi i post filtrati dell'ultimo mese
 - unisci tutte le reazioni e le separi per data  ??
 - plotta


 Stats di ogni post:
 - numero di risposte
 - reazioni

 stats di ogni canale (generale o solo riguardate i miei post???)
 */

</script>

<template>
  <div class="centralDiv">
    <div class="marginCD">
      <h1 class="m-0 w-100 text-center"> GENERAL STATS </h1>
      <Popularity30days @ready="firstReady = true"/>
      <h3 class="m-0 w-100 text-center"> Squeal Frequency </h3>
      <PubFrequencyMonth v-if="firstReady" @ready="secondReady = true" />
      <h3 class="m-0 w-100 text-center"> Squeal Frequency this month </h3>
      <PubFrequencyYear v-if="secondReady"/>
    </div>
  </div>
</template>

<style scoped>

</style>
