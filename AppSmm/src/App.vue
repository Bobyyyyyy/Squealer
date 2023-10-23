<script setup>

</script>

<template>

  <router-view name="sideBar"/>
  <router-view name="SbOn" class="allPage"/>
  <router-view name="welcomingPage"/>

</template>

<style>
  .allPage {
    height: 100vh;
    margin-left: 10vw !important;
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