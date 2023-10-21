<script setup>
  import NavBar from "../components/NavBarWel.vue";
/*
  defineProps({
    username: String,
  })

 */
  let username = "PIPPO"    //debug

  function getHandleURL(){
    return "/SMM_App/"+username+"/handlevip";
  }

</script>

<template>
  <NavBar center-text="SMM Dashboard" />
  <div class="d-flex flex-row justify-content-evenly flex-wrap principalDiv">
    <div class="d-flex flex-column align-self-center">
      <div class="d-flex flex-row w-100 justify-content-center">
        <div class="d-flex flex-column">
          <h1 class="text-center">Benvenuto, {{username}} </h1>
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
                  @click=" this.$router.push(getHandleURL())"
                  >SMM</button>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center">
      <img src="/img/profilePicture.png" alt="silly cat" class="img-fluid object-fit-fill" />
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
    margin-left: 3vw;
    margin-right: 3vw;
    height: 80vh;

  }
</style>