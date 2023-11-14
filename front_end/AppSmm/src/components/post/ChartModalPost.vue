<script setup>
  import postReactionsChart from '../charts/postReactionsChart.vue'
  import {Modal} from "bootstrap";
  import {computed, onMounted, reactive, ref, toRaw, watchEffect} from "vue";

  const modalStateChart = reactive({chartPost:null})
  const chart = ref();

  const openModal = () => {
    chart.value.setIsActive();
    modalStateChart.chartPost.show()
  }
  function closeModal() {
    modalStateChart.chartPost.hide()
  }

  const props = defineProps({
    reactions: {
      default:null
    },
    idx: Number,
  })
  defineEmits(['closeModal']);

  defineExpose(  {
    openModal,
  })

  onMounted(()=> {
    modalStateChart.chartPost = new Modal(`#${getId()}`, {})
  })

  function getId(){
    return `chartPostModal${props.idx}`
  }

</script>

<template>
  <div  class="modal fade w-100 h-100 overflow-hidden" :id="getId()" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Post Reactions</h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <postReactionsChart :reactions="reactions" ref="chart"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>