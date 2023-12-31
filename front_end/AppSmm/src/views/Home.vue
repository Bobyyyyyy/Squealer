<script setup>
  import NavBar from "../components/navbar/NavBar.vue";
  import {smartPhone, smm} from "../utils/config.js"
  import {ref} from "vue";
  import Spinner from "../components/Spinner.vue";

  const ready = ref(false);

  const go2user = async () => {
    let res = await fetch('/db/user/smm2user', {method: 'PUT'});
    if(res.ok){
      window.location.replace('/user');
    }
  }

</script>

<template>
  <Spinner v-if="!ready" />
  <NavBar v-show="ready" center-text="SMM Dashboard" :welcomingPage="true"/>
  <div v-show="ready" class="d-flex flex-row justify-content-around principalDiv flex-wrap" style="max-height: 90vh">
    <div class="d-flex flex-column align-self-center sameWidth" >
      <div class="d-flex flex-row w-100 justify-content-center">
        <div class="d-flex flex-column">
          <h1 class="text-center">Benvenuto, {{smm}} </h1>
          <h1 class="text-center">Scegli come accedere!</h1>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-evenly flex-wrap topMargin">
        <div class="d-flex align-items-center">
          <button type="button" class="btn btn-primary btn-lg" @click="go2user">Utente</button>
        </div>
        <div class="d-flex align-items-center">
          <button type="button"
                  class="btn btn-primary btn-lg"
                  @click=" $router.push('/AppSmm/sceltavip')"
                  >SMM</button>
        </div>
      </div>
    </div>
    <div class=" d-flex" :class="smartPhone ?'align-items-start' : 'sameWidth align-items-center'"  style="max-width: 40rem">
      <img src="/img/logo.png" alt="silly cat" class="img-fluid object-fit-contain" @load="ready = true" />
    </div>
  </div>

</template>

<style scoped>

  .topMargin{
    margin-top: 5vh;
  }

</style>