<script setup>
import {onMounted, ref} from "vue";
import {Modal} from "bootstrap";
import {currentVip} from "../../utils/config.js";

const modalStateNotification = ref({notificationModal: null});

function openModal() {modalStateNotification.notificationModal.show()}
function closeModal () {modalStateNotification.notificationModal.hide()}

defineExpose({
  openModal
})

onMounted(()=> {
  modalStateNotification.notificationModal = new Modal("#notModal", {})
})

</script>

<template>
  <div class="modal modal-xl fade overflow-hidden" id="notModal" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5"> Notifiche </h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5>PIPPO</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>