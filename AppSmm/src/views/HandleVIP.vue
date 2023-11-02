<script setup>
  import NavBarWel from "../components/NavBarWel.vue";
  import VipCard from "../components/handleVip/VipCard.vue";
  import VipModal from "../components/handleVip/VipModal.vue";
  import {onMounted, reactive, ref} from "vue";
  import {Modal} from 'bootstrap'
  import {smm} from "../utilsSMM";

  let vips = [];

  const modalState = reactive({myModal: null,})

  const name2Use = ref('')
  const requestCompleted = ref(false);

  onMounted(async ()=>{
    modalState.myModal = new Modal('#choiceModal',{});

    console.log(smm.value);

    let res = await fetch(`/db/getVips?SMMname=${smm.value}`,{
      method:"GET"
    })
    vips = await res.json()

    requestCompleted.value=true;
  })

  function openModal(name) {
    name2Use.value = name;
    modalState.myModal.show()
  }

  function closeModal() {
    name2Use.value = '';
    modalState.myModal.hide()
  }

</script>

<template>
  <NavBarWel center-text="Scegli account da gestire" />
  <div class="d-flex flex-row align-items-center flex-wrap justify-content-evenly mt-lg-3" v-if="requestCompleted">
    <VipCard v-for="(vip,index) in vips"
            :key="index"
            :followers="100"
             :username="vip"
            @setModal = " (username) => openModal(username)"
    />
  </div>

  <VipModal
            :SMMname="smm"
            :VIPname="name2Use"
            @closeModal = "closeModal()"

  />

</template>