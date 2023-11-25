<script setup>
  import NavBar from "../components/navbar/NavBar.vue";
  import {smartPhone, smm} from "../utils/config.js"

</script>

<template>
  <NavBar center-text="SMM Dashboard" :welcomingPage="true"/>
  <div class="d-flex flex-row justify-content-around principalDiv flex-wrap" style="max-height: 90vh">
    <div class="d-flex flex-column align-self-center sameWidth" >
      <div class="d-flex flex-row w-100 justify-content-center" style="max-width: 40rem; ">
        <div class="d-flex flex-column">
          <h1 class="text-center">Benvenuto, {{smm}} </h1>
          <h1 class="text-center">Scegli come accedere!</h1>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-evenly flex-wrap topMargin">
        <div class="d-flex align-items-center">
          <button type="button" class="btn btn-primary btn-lg">Utente</button>
        </div>
        <div class="d-flex align-items-center">
          <button type="button"
                  class="btn btn-primary btn-lg"
                  @click=" this.$router.push('/SMM/handlevip')"
                  >SMM</button>
        </div>
      </div>
    </div>
    <div class=" d-flex" :class="smartPhone ?'align-items-start' : 'sameWidth align-items-center'"  style="max-width: 40rem">
      <img src="/img/logo.png" alt="silly cat" class="img-fluid object-fit-contain" />
    </div>
  </div>

</template>

<style scoped>

  .topMargin{
    margin-top: 5vh;
  }
  .botMargin{
    margin-bottom: 4vh
  }
</style>