<script setup>
import {ref} from "vue";
import {start} from "./utils/functions.js";
const ready = ref(false);

start();
ready.value = true;

</script>

<template>
  <router-view v-if="ready" name="sideBar"/>
  <router-view v-if="ready" name="SbOn"/>
  <router-view v-if="ready" name="welcomingPage"/>
</template>