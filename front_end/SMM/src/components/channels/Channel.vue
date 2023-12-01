<script setup>
import {useStore} from "vuex";
import ChartChannel from "./ChartChannel.vue";
import {reactive, ref, watch} from "vue";
import {currentVip} from "../../utils/config.js";
import {parseReactionType} from "../../utils/functions.js";

const store = useStore();

const displayChart = ref(false)
const readyReac = ref({});
const readyData = ref(false);

  const props = defineProps({
    isPublic: Boolean,
    name: String,
    description: String,
  })




  function changeChannel(){
    store.commit('uploadChannel',{chName: props.name, chDescription: props.description})
  }

  async function getDataOpenModal(){
    console.log("entro");

    let res = await fetch(`/db/post/allReactionMonth?user=${currentVip.value}&channel=${props.name}`, {
      method: "GET",
    })

    let reactions = await res.json()

    readyReac.value = parseReactionType(reactions);
    console.log(readyReac.value);

    readyData.value = true;
  }

</script>

<template>
  <div class="d-flex flex-row justify-content-between align-items-center lineDim">
    <div class="text-start bordEl">
      <router-link :to="{path: `/SMM/Canali/${name.split(' ').join('')}`}"
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
      <button class="btn btn-primary" @click="getDataOpenModal()">Stats</button>
    </div>
  </div>
  <hr class="m-0 z-0" />
  <ChartChannel v-if="readyData" :reactions="readyReac" @closed="readyData = false" :channelName="name" />
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