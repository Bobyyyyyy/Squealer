<script setup>
import {computed} from "vue";

  defineEmits(['changeReac','deleteReac'])

  const props = defineProps({
    icon: Object,
    values: {
      default:null
    },
    active:{
      default: null,
    },
  })

  const isThisActive = computed(() => props.active === props.icon.name)
  
</script>


<template>
  <div class="d-flex flex-row align-items-center">

    <div v-if="!isThisActive" @click="$emit('changeReac',icon.name)"  class="d-flex justify-content-center">
      <svg :class="icon.notActive.iconClasses" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
        <path :d="icon.notActive.pathSvg"/>
      </svg>
    </div>
    <div v-else @click="$emit('deleteReac')" class="d-flex justify-content-center">
      <svg :class="icon.active.iconClasses" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
        <path :d="icon.active.pathSvg"/>
      </svg>
    </div>
    <div class="text-center">
      <h6 class="mb-0 ms-1">{{values}}</h6>
    </div>


  </div>
</template>