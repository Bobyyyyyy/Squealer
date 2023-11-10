<script setup>
import {useStore} from "vuex";

const store = useStore();

  const props = defineProps({
    isPublic: Boolean,
    name: String,
    description: String,
  })


  function changeChannel(){
    store.commit('uploadChannel',{chName: props.name, chDescription: props.description})
  }


</script>

<template>
  <div class="d-flex flex-row justify-content-between align-items-center lineDim">
    <div class="text-start bordEl">
      <router-link :to="{path: `/SMM/Channels/${name.split(' ').join('')}`}"
                   class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                   @click="changeChannel()"
      >
        {{ name }}
      </router-link>
    </div>
    <div class="text-center bordEl ">
      <span v-if="isPublic" class="badge text-bg-success"> public </span>
      <span v-else class="badge text-bg-danger"> private </span>
    </div>
    <div class="text-end bordEl ">
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
    min-width: 20vw;
  }
</style>