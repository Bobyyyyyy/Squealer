<script setup>

  defineProps({
    centerText: String,
  })


  //è una get la logout??
  async function logout(){

    let res = await fetch("/logout");
    console.log(res);
    window.location.href= res.url;
  }

</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary" >
    <div class="d-flex flex-row justify-content-between flex-fill navBar">
      <div class="d-flex">
        <a href="/SMM_App/public" class="d-flex align-items-center">
          <span class="fs-4">LOGO</span>
        </a>
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

</style>