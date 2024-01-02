<script setup>
import {reactive} from "vue";
import {Modal} from "bootstrap";
import {useToast} from "vue-toast-notification";

const $toast = useToast();

const modalState = reactive({handleRequest: null});

const props = defineProps({
  requests: Array,
  chname: String,
})

const openModal = () => {
  modalState.handleRequest = new Modal('#channelHandleRequest',{});
  modalState.handleRequest.show();
}
function closeModal() {
  modalState.handleRequest.hide();
  modalState.handleRequest = null;
}

defineExpose({openModal});
const emits = defineEmits(['updateFollowers']);

const handleRequest = async (user,accept) => {
  let res = await fetch('/db/channel/requests', {
    method: "PUT",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      user: user,
      channel: props.chname,
      accepted: accept,
    })
  })
  if (!res.ok){
    $toast.error(`errore nel${accept ? "l'accettare" : ' rifiutare'} ${user}`);
  } else {
    $toast.success(`${user} ${accept?"accettato":"rifiutato"}`, {position:'top-right'});
  }
  emits('updateFollowers', user , accept);
}

</script>

<template>
  <div class="modal modal fade overflow-hidden" id="channelHandleRequest" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bolder"> gestisci richieste - {{chname}}</h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-column align-items-center">
              <div v-for="(user,i) in requests" :key="user+i" class="w-75 d-flex flex-row justify-content-between mt-1 mb-1 align-items-center">
                <span>{{user}}</span>
                <div class="d-flex flex-row justify-content-center" style="height: 2rem; aspect-ratio: 1">
                  <div type="button" class="h-100 me-4" @click="handleRequest(user, true)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022"/>
                    </svg>
                  </div>
                  <div type="button" class="h-100" @click="handleRequest(user, false)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>