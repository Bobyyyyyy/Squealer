<script setup>

  defineProps({
    centerText: String,
  })


  //è una get la logout??
  async function logout(){

    let res = await fetch("/logout");
    window.location.href= res.url;
  }

</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary maxHNav" >
    <div class="d-flex flex-row justify-content-between navBar maxHNav">
      <div class="d-flex">
        <router-link to="/SMM/Profile" class="d-flex justify-content-center mb-3 h-100">
            <img alt="logo" src="/img/logo.png" class="img-fluid object-fit-fill">
        </router-link>
      </div>
      <div class="d-flex align-items-center">
        <h4 class="mb-0">{{centerText}}</h4>
      </div>
      <div class="d-flex">
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
  margin-left: 3vw;
  margin-right: 3vw;
}

.maxHNav{
  max-height: 13vh;
}

</style>