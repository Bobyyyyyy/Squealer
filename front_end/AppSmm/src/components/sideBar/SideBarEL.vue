<script setup>
import {computed} from "vue";

  const props = defineProps({
    item: Object,
    expanded: Boolean,
    active: {
      default:null
    }
  })

  defineEmits(['pushTo', 'changeActive'])

  const name = props.item.text;

  const isThisActive = computed(() => props.active === props.item.text);


</script>

<template>
  <li class="nav-item butNav sdBarEl" >
      <a
         class="nav-link d-flex flex-row align-items-center reducePad"
         :class= "isThisActive ? 'active': '',
                  expanded ? 'justify-content-start' : 'justify-content-center'"
         @click ="$emit('changeActive',item.text);
                  $emit('pushTo',item.text);"
         type="button"
      >

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

  .sdBarEl:hover{
    background-color: var($secondary);
    border: var(--bs-border-radius);
  }

  @media (max-width: 768px) {
    .icon {
      max-height: 50%;
      height: 50%;
      aspect-ratio: 1/1;
    }
    .butNav{
      width: calc(100% / 6);
      height: auto;
      aspect-ratio: 1/1;
    }
    .reducePad{
      padding: 20%;
      aspect-ratio: 1;
    }
  }
</style>