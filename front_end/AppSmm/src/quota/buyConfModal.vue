<script setup>
import {Modal} from "bootstrap";
import {onMounted, reactive} from "vue";

const modalState = reactive({conf: null});

const emits = defineEmits(['acquisto'])
defineProps({
  payment: Number
})

const openModal = () => {
  modalState.conf.show()
}
function closeModal() {
  modalState.conf.hide();
}

function closeWithPayment() {
  emits('acquisto');
  modalState.conf.hide();
}


defineExpose({
  openModal,
})

onMounted(()=> {
  modalState.conf = new Modal('#confBuyQuota',{});
})

</script>

<template>
  <div class="modal" id="confBuyQuota" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"> </h5>
          <h3 class="m-0">Conferma Pagamento</h3>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h4 class="m-0 w-100 text-center">Stai spendendo:</h4>
          <h3 class="m-0 w-100 text-center">{{`€${payment}`}}</h3>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button class="btn btn-lg btn-danger" @click="closeModal">Indietro</button>
          <button class="btn btn-lg btn-primary" @click="closeWithPayment">Paga</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>