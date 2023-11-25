<script setup>

  import {smartPhone} from "../../utils/config.js";

  defineProps({
    centerText: String,
    welcomingPage: Boolean,
  })


  //è una get la logout??
  async function logout(){
    let res = await fetch("/logout");
    window.location.href= res.url;
  }

</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary maxHNav navBar">
    <div class="d-flex flex-row justify-content-between maxHNav">
      <div class="maxHNav sameWidth">
        <img v-if="welcomingPage" alt="logo" src="/img/logo.png" class="h-100 img-fluid object-fit-contain">
        <router-link v-else to="/SMM/Profile" class="d-flex justify-content-center mb-3 h-100">
          <img alt="logo" src="/img/logo.png" class="img-fluid">
        </router-link>
      </div>
      <div class="sameWidth d-flex align-items-center justify-content-center" style="flex-grow: 2">
        <h2 v-if="smartPhone" class="mb-0 text-center ">{{centerText}}</h2>
        <h2 v-else class="mb-0 fw-bold text-center">{{centerText}}</h2>
      </div>
      <div class="sameWidth align-items-center justify-content-end" >
        <button type="button"
                class="btn btn-outline-danger"
                @click="logout"
        >LOGOUT</button>
      </div>
    </div>
  </nav>
</template>

<style>

.navBar{
  padding-right: 1vw;
  padding-left: 1vw;
}

.maxHNav{
  min-height: 6rem;
  max-height: 10vh;
}

</style>