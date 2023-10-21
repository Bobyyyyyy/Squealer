<script setup>
  defineProps({
    isPublic: Boolean,
    name: String
  })

</script>

<template>
  <div class="d-flex flex-row justify-content-between align-items-center lineDim">
    <div class="bordEl">
      <router-link to="/qualcosa" class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
        NOME CANALEEEEEEEEEEEE
      </router-link>
    </div>
    <div class="bordEl">
      <span v-if="isPublic" class="badge text-bg-success"> public </span>
      <span v-else class="badge text-bg-danger"> private </span>
    </div>
    <div class="bordEl">
      <button class="btn btn-primary">Stats</button>
    </div>
  </div>
  <hr class="m-0 z-0" />
</template>

<style>
  .lineDim{
    margin-right: 1%;
    margin-left: 1%;
    height: 4rem;
  }

  .bordEl{
    margin-left: 0.5%;
    margin-right: 0.5%;
  }
</style>