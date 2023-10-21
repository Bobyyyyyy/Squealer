<script setup>
import {computed, onBeforeMount, onMounted, onUnmounted, ref} from "vue";

  const props = defineProps({
    item: Object,
    expanded: Boolean
  })

  const isActive = ref(false);

  function setIsActive(){
    isActive.value = true;
  }

  function setNotActive(){
    isActive.value = false;
  }

  onBeforeMount(()=>{
    if (props.item.text === "Profile"){ setIsActive(); }
  })

  defineExpose({
    setNotActive,
  })


</script>

<template>
  <li class="nav-item butNav"  >
      <a href="#"
         class="nav-link d-flex flex-row align-items-center reducePad"
         :class= "isActive ? 'active': '',
                  expanded ? 'justify-content-start' : 'justify-content-center'"
         @click="$emit('deactivateAll'); $emit('pushto',item.text); setIsActive()" >
        <svg xmlns="http://www.w3.org/2000/svg" class="icon"  fill="currentColor" :class="item.class" viewBox="0 0 16 16">
          <path :d= "item.icon" />
        </svg>
        <p v-if="expanded" class="mb-0 ms-2">
          {{item.text}}
        </p>
      </a>
  </li>

</template>

<style>
  .icon{
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    .icon {
      max-width: 20px;
      max-height: 20px;
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
    }
    .butNav{
      width: 15%;
    }
    .reducePad{
      padding: 20%;
      aspect-ratio: 1/1;
    }
  }
</style>