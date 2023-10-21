<script setup>
  import NavBarWel from "../components/NavBarWel.vue";
  import VipCard from "../components/handleVip/VipCard.vue";
  import VipModal from "../components/handleVip/VipModal.vue";
  import {onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, reactive, ref} from "vue";
  import {Modal} from 'bootstrap'
  import {getSMMname, getVIPname} from "../utils";

  const emit = defineEmits(['setWel'])

  //ci andrebbe anche il post
  const vips =[
    {
      name:"PippoVip",
      fol: 10,
    },
    {
      name:"FVPro",
      fol: 190,
    },
    {
      name:"Popi",
      fol: 200000,
    }
]

  const modalState = reactive({myModal: null,})

  const name2Use = ref('')

  onMounted(()=>{
    modalState.myModal = new Modal('#choiceModal',{})
  })

  onBeforeUpdate(()=>{
    console.log("AAAAAAAAJAHSVJDSA")
    emit('setWel',true)
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
  <div class="d-flex flex-row align-items-center flex-wrap justify-content-evenly mt-lg-3">
    <VipCard v-for="(vip,index) in vips"
            :key="index"
            :followers="vip.fol"
             :username="vip.name"
            @setModal = " (username) => openModal(username)"
    />
  </div>
  <VipModal
            :SMMname="getSMMname()"
            :VIPname="name2Use"
            @closeModal = "closeModal()"
            @changeWel = "this.$emit('setInWel')"

  />

</template>