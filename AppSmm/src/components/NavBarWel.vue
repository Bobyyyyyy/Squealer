<script setup>
  defineProps({
    centerText: String,
  })
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
        <button type="button" class="btn btn-outline-danger">LOGOUT</button>
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