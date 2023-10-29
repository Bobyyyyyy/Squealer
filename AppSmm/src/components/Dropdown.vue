<script setup>

  import {onUpdated} from "vue";

  defineProps({
    filterRef: {
      default: null,
    },
    updateRef: String,
    dropItems: Array,
  })

</script>

<template>
  <div class="dropdown">
    <a class="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{filterRef}}</a>
    <ul class="dropdown-menu">
      <li v-for="(el,i) in dropItems" :key ="i">
        <a class="dropdown-item" @click="$emit(updateRef, el)">{{ el }}</a>
      </li>
    </ul>
  </div>
</template>