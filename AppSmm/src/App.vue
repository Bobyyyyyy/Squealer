<script setup>
import {onBeforeMount} from "vue";
import {smm} from "./utils";

onBeforeMount(async () => {
  let res = await fetch("/db/userid",{
    method:"GET",
  });
  smm.value = (await res.json()).username;
})

</script>

<template>

  <router-view name="sideBar"/>
  <router-view name="SbOn"/>
  <router-view name="welcomingPage"/>

</template>