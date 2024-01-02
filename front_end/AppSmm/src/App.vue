<script setup>
import {getUserQuota} from "./utils/functions.js";
import {ref} from "vue";
import {useStore} from "vuex";
const store = useStore();

const ready = ref(false);

async function start(){

  let res = await fetch("/db/user/session",{
    method:"GET",
  });
  store.commit('setsmm', (await res.json()).username);

  res = await fetch("/db/user/sessionVip",{
    method:"GET",
  });

  let curVipName = (await res.json()).vip;

  if (curVipName){
    res = await fetch(`/db/user/profilePic?name=${curVipName}`,{
      method:"GET",
    })
    store.commit('setVip',{
      name: curVipName,
      profilePic: (await res.json()).profilePic,
    })
    let quota = await getUserQuota(curVipName);
    store.commit('setQuota',quota.characters);
    store.commit('setMaxQuota',quota.maxQuota);
  }
  ready.value = true;
}

start();
</script>

<template>
  <router-view v-if="ready" name="sideBar"/>
  <router-view v-if="ready" name="SbOn" class="h-100"/>
  <router-view v-if="ready" name="welcomingPage"/>
</template>