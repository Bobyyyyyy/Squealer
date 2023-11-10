<script setup>
  import NavBar from "../components/navbar/NavBar.vue";
  import {smm} from "../utils/config.js"

</script>

<template>
  <NavBar center-text="SMM Dashboard" />
  <div class="d-flex flex-row justify-content-center principalDiv ">
    <div class="d-flex flex-column align-self-center w-50">
      <div class="d-flex flex-row w-100 justify-content-center">
        <div class="d-flex flex-column">
          <h1 class="text-center">Benvenuto, {{smm}} </h1>
          <h1>Scegli come accedere!</h1>
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
    <div class="d-flex align-items-center w-50">
      <img src="/img/logo.png" alt="silly cat" class="img-fluid object-fit-fill" />
    </div>
  </div>

</template>

<style>

  .topMargin{
    margin-top: 5vh;
  }
  .botMargin{
    margin-bottom: 4vh
  }

  .principalDiv{
    margin-left: 13vw;
    margin-right: 13vw;
    height: 100vh;
  }
</style>