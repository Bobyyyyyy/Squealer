<script setup>
  defineProps({
    value: Object,
  })
</script>

<template>
  <div type="button" @click="$emit('updateList', value)" class="m-0 rounded-circle d-flex justify-content-center align-items-center" style="background-color: rgba(160,0,0,0.82); height: 1.5rem; aspect-ratio: 1">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-dash-lg" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
    </svg>
  </div>
</template>

<style scoped>

</style>