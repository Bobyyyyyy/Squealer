<script setup>
  import {ref} from "vue";
  import SideBar from "./components/sideBar/SideBar.vue";

  let inWel = ref(true);

  function setisWel(){
    inWel.value= !inWel.value
  }


</script>

<template>
  <SideBar v-if="!inWel"
           v-on:setInWel="setisWel"
  />
  <div v-if="!inWel" class="allPage">
    <router-view  name="SbOn"/>
  </div>

  <router-view v-else
               v-on:setInWel="setisWel"
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