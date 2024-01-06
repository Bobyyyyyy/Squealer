<script setup>
import {reactive, ref} from "vue";
import {Modal} from "bootstrap";
import {useToast} from "vue-toast-notification";
import {useRouter} from "vue-router";

const $toast = useToast();
const router = useRouter();

const props = defineProps({
  channelName: String,
})

const modalState = reactive({deleteChannel: null});

const inserted = ref('');

const openModal = () => {
  modalState.deleteChannel = new Modal('#deleteChannelModal',{});
  modalState.deleteChannel.show();
}
function closeModal() {
  modalState.deleteChannel.hide();
  modalState.deleteChannel = null;
}
defineExpose({openModal})

const deleteChannel = async () => {
  let res = await fetch(`/db/channel/${props.channelName}`, {
    method:"DELETE"
  })
  if (res.ok){
    $toast.success(`canale §${props.channelName} eliminato con successo`,{position:'top-right'});
    closeModal();
    router.push({name: 'Canali'});
  }
  else{
    $toast.error('errore nella rimozione del canale, riprova');
    closeModal();
  }
}

</script>

<template>
  <div class="modal fade overflow-hidden" id="deleteChannelModal" tabindex="-1" aria-hidden="true">
    <div class="centralDiv">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <h1 class="modal-title fs-5">Per eliminare il canale, inserisci '{{channelName}}'</h1>
            <input type="text" class="form-control w-100" v-model="inserted">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Indietro</button>
            <button type="button" class="btn btn-danger" :disabled="channelName !== inserted" @click="deleteChannel">Conferma</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>