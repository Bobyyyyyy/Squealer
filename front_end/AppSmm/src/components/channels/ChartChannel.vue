<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {currentVip} from "../../utils/config.js";
import {parseReactionType} from "../../utils/functions.js";
import Popularity30days from "../charts/Popularity30days.vue";
import {Modal} from "bootstrap";

const channelReactions = reactive({});
const modalStateChart = reactive({chartChannel:null})
const chart30Channel = ref();


const props = defineProps({
  channelName: String,
  opened:{default:null},
  reactions: {default:null}
})

const emits = defineEmits(['closed'])

const openModal = () => {
  modalStateChart.chartChannel.show()
}

function closeModalChannel() {
  modalStateChart.chartChannel.hide()
  emits('closed');
}

onMounted(()=>{
  modalStateChart.chartChannel = new Modal(`#channelModalChart`, {})

  openModal();
})


</script>

<template>
  <div class="modal modal-xl fade overflow-hidden" id="channelModalChart" tabindex="-1" aria-hidden="true">
    <div class="centralDiv">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Reazioni - {{channelName}}</h1>
            <button type="button" class="btn-close" @click="closeModalChannel" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="modalBodyChartChannel">
            <Popularity30days :post="false" :reactions="reactions"/>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>