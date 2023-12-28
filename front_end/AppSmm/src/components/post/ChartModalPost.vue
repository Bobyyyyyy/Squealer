<script setup>
  import postReactionsChart from '../charts/postReactionsChart.vue'
  import {Modal} from "bootstrap";
  import {computed, onMounted, onUnmounted, reactive, ref, toRaw, watch, watchEffect} from "vue";
  import Popularity30days from "../charts/Popularity30days.vue";


  const props = defineProps({
    reactions: {
      default:null
    },
    idx: Number,
  })

  function getId(){
    return `chartPostModal${props.idx}`
  }


  const DChart = ref();
  const LChart = ref()
  const modalStateChart = reactive({chartPost:null})
  const ready = ref(false)
  const liveReactions = reactive({});


  const setDataReady = () =>{
    ready.value = true
  }
  const setDataUnready = () => {ready.value = false};

  const openModal = () => {
    modalStateChart.chartPost.show()
  }
  function closeModal() {
    modalStateChart.chartPost.hide()
  }


  defineEmits(['closeModal']);

  defineExpose(  {
    openModal,
    setDataReady,
    setDataUnready
  })

  onMounted(()=> {
    modalStateChart.chartPost = new Modal(`#${getId()}`, {})
  })
  watch(props.reactions,(data)=>{
    if(Object.keys(data.value).length !== 0){
      liveReactions.value = data.value;
      DChart.value.updateChart();
      LChart.value.updateChart();
    }
  })

</script>

<template>
  <div  class="modal modal-xl fade overflow-hidden" :id="getId()" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Reazioni Squeal</h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-row align-items-center justify-content-around p-2 ">
              <postReactionsChart ref="DChart" :reactions="liveReactions" />
              <Popularity30days ref="LChart" :reactions="liveReactions" :post="true" class="h-50" />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>