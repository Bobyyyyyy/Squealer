<script setup>
import {useStore} from "vuex";
import ChartChannel from "./ChartChannel.vue";
import {computed, ref} from "vue";
import {parseReactionType} from "../../utils/functions.js";

const store = useStore();
const vip = computed(() => store.getters.getVip);

const readyReac = ref({});
const readyData = ref(false);

  const props = defineProps({
    isPublic: Boolean,
    name: String,
    description: String,
    creator: String,
    admins: Array,
    channelPic: String,
  })

  async function getDataOpenModal(){

    let res = await fetch(`/db/post/allReactionMonth?user=${vip.value.name}&channel=${props.name}`, {
      method: "GET",
    })

    let reactions = await res.json()

    readyReac.value = parseReactionType(reactions);
    console.log(readyReac.value);

    readyData.value = true;
  }

</script>
 text-dark" id="ChannelName"
<template>
  <div class="d-flex flex-row justify-content-between align-items-center lineDim ">
    <div class="d-flex align-items-center justify-content-start sameWidth flex-grow-md">
      <div  class="border-4 border-primary" style="height: 5.7rem; width: 5.7rem">
        <img :src="channelPic" alt="immagine profilo canale" class="img-fluid rounded-circle h-100 object-fit-cover">
      </div>
      <div class="text-start bordEl ms-3" >
        <router-link :to="{path: `/AppSmm/Canali/${name.split(' ').join('')}`}"
                     class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover overflow-hidden"
                     style="white-space: nowrap; text-overflow: ellipsis; width: calc(100% - 5.7rem)"
        >
          {{ name }}
        </router-link>
      </div>
    </div>
    <div class="d-flex flex-row flex-wrap sameWidth justify-content-around">
      <div class="text-center bordEl" >
        <span v-if="creator === vip.name" class="badge rounded-pill text-bg-primary"> creatore </span>
        <span v-else-if="admins.includes(vip.name)" class="badge rounded-pill text-bg-warning"> admin </span>
      </div>
      <div class="text-center bordEl ">
        <span v-if="isPublic" class="badge rounded-pill text-bg-success"> pubblico </span>
        <span v-else class="badge rounded-pill text-bg-danger"> privato </span>
      </div>
    </div>

    <div class="text-end bordEl flex-fill sameWidth justify-content-end">
      <button class="btn btn-primary" @click="getDataOpenModal()">Stats</button>
    </div>
  </div>
  <hr class="m-0 z-0" />
  <ChartChannel v-if="readyData" :reactions="readyReac" @closed="readyData = false" :channelName="name" />
</template>

<style scoped>

  .lineDim{
    margin-right: 1%;
    margin-left: 1%;
    height: 6rem;
    width: 98%;
  }

  .bordEl{
    margin-left: 0.5%;
    margin-right: 0.5%;
  }

  @media screen and (max-width: 768px){
    .flex-grow-md{
      flex-grow: 3 !important;
      max-width: 60%;
    }
  }
</style>