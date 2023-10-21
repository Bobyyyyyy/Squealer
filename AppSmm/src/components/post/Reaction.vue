<script setup>
  defineProps({
    classes: String,
    icon: String,
    values: Number,
  })

</script>


<template>
  <div class="d-flex flex-row align-items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" :class="classes" viewBox="0 0 16 16">
      <path :d="icon"/>
    </svg>
    <h6 class="mb-0 ms-1">{{values}}</h6>
  </div>
</template>