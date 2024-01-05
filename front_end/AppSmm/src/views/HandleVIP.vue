<script setup>
  import NavBar from "../components/navbar/NavBar.vue";
  import VipCard from "../components/handleVip/VipCard.vue";
  import VipModal from "../components/handleVip/VipModal.vue";
  import {Modal} from 'bootstrap'
  import {computed, onMounted, reactive, ref} from "vue";
  import {getLastPost} from "../utils/functions.js";
  import Spinner from "../components/Spinner.vue";
  import {useStore} from "vuex";

  const store = useStore();

  let vips = [];
  let lastVipsPost = [];

  const modalState = reactive({myModal: null,})

  const name2Use = ref('')
  const requestCompleted = ref(false);
  const readyPage = ref(false);

  const smm = computed(() => store.getters.getSmm);

  onMounted(async ()=>{
    modalState.myModal = new Modal('#choiceModal',{});

    let res = await fetch(`/db/user/getVips?SMMname=${smm.value}`,{
      method:"GET"
    })
    vips = await res.json()
    for (let i = 0; i < vips.length; i++) {
      lastVipsPost[i] = (await getLastPost(vips[i])).post;
    }

    requestCompleted.value=true;
  })

  function openModal(name, profilePic) {
    name2Use.value = name;
    modalState.myModal.show()
  }

  function closeModal() {
    name2Use.value = '';
    modalState.myModal.hide()
  }

</script>

<template>
  <Spinner v-if="!readyPage" />
  <NavBar v-show="readyPage"
          center-text="SQUEALER"
          :welcomingPage="true"
          @imgLoaded="readyPage = true"/>
  <h2 class="mt-3 mb-0">Scegli account da gestire:</h2>

  <div v-show="readyPage"  class="d-flex flex-row mb-5 flex-wrap justify-content-evenly" v-if="requestCompleted">
    <VipCard v-for="(vip,index) in vips"
            :key="index"
            :followers="100"
             :username="vip"
             :post="lastVipsPost[index] ? lastVipsPost[index] : {}"
            @setModal = " (username, profilePic) => openModal(username, profilePic)"
    />

  </div>

  <VipModal
            :SMMname="smm"
            :VIPname="name2Use"
            @closeModal = "closeModal()"

  />

</template>