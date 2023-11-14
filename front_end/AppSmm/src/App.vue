<script setup>
import {currentVip,smm} from "./utils/config.js";
import {getUserQuota} from "./utils/functions.js";
import {ref} from "vue";
import {useStore} from "vuex";
const store = useStore();

const ready = ref(false);

async function start(){

  let res = await fetch("/db/user/session",{
    method:"GET",
  });
  smm.value = (await res.json()).username;

  res = await fetch("/db/user/sessionVip",{
    method:"GET",
  });
  currentVip.value = (await res.json()).vip;
  if (currentVip.value){
    store.commit('setQuota',await getUserQuota())
  }
  ready.value = true;
}

start();
</script>

<template>
  <router-view v-if="ready" name="sideBar"/>
  <router-view v-if="ready" name="SbOn"/>
  <router-view v-if="ready" name="welcomingPage"/>
</template>