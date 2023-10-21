<script setup>
import {ref, watch} from "vue";
  import SideBar from "./components/sideBar/SideBar.vue";

  let inWel = ref(true);

  function setisWel(){
    inWel.value= !inWel.value
  }

  function setWel(bool){
    inWel.value = bool;
  }
    //PER LA HISTORY, altrimenti non si aggiorna
  window.addEventListener("popstate",()=>{
    if(window.location.pathname.split('/').slice(-1) == 'handlevip') setWel(true);
  },false)

</script>

<template>
  <SideBar v-if="!inWel"
           @setInWel="setisWel"
           @setWel="(bool) => setWel(bool)"
  />
  <div v-if="!inWel" class="allPage">
    <router-view  name="SbOn"/>
  </div>

  <router-view v-else
               @setInWel="setisWel"
               @setWel="(bool) => setWel(bool)"
  />
</template>

<style>
  .allPage {
    height: 100vh;
    margin-left: 10vw;
  }
  @media screen and (max-width: 768px){
    .allPage{
      width: 100%;
      margin-left: 0;
      margin-bottom: 15%;
    }
  }

  @media screen and (max-width: 1450px) and (min-width:768px) {
    .allPage{
      margin-left: 7%;
    }
  }
</style>