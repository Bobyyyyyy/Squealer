<script setup>
import {currentVip, smm} from "./utilsSMM";
import {ref} from "vue";

const ready = ref(false);

async function start(){

  let res = await fetch("/db/userid",{
    method:"GET",
  });
  smm.value = (await res.json()).username;

  res = await fetch("/db/sessionVip",{
    method:"GET",
  });
  currentVip.value = (await res.json()).vip;
  ready.value = true;
}

start();

</script>

<template>
  <router-view v-if="ready" name="sideBar"/>
  <router-view v-if="ready" name="SbOn"/>
  <router-view v-if="ready" name="welcomingPage"/>
</template>