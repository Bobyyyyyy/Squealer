<script setup>
import {currentVip} from "../utils/config.js";
import {Modal} from "bootstrap";
import BuyQuota from "./BuyQuota.vue";
import {onMounted, reactive} from "vue";

const modalStateQuota = reactive({quota: null});

const emits = defineEmits(['restoreSideBar']);

const openModal = () => {
  modalStateQuota.quota.show()
}
function closeModal() {
  emits('restoreSideBar');
  modalStateQuota.quota.hide()
}

defineExpose({
  openModal,
})


onMounted(()=> {
  modalStateQuota.quota = new Modal('#buyQuotaModel',{});
})


</script>

<template>
  <div class="modal modal-xl fade overflow-hidden" id="buyQuotaModel" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bolder"> Compra quota - {{currentVip}}</h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <BuyQuota @closeModal="closeModal" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>