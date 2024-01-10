<script setup>
import {Modal} from "bootstrap";
import {computed, reactive, ref} from "vue";
import {blob2base64, compressBlob} from "../../utils/functions.js";
import {useToast} from "vue-toast-notification";

const $toast = useToast();

const props = defineProps({
  channelName: String,
})

const imgPath = ref('')
const fileUploaded = ref({});
const currentImgPath = ref('');
const canUploadFile = computed(() => imgPath.value === '' || currentImgPath.value === '');
const showImg = ref(false)

function showPreviewUploaded(event) {
  fileUploaded.value = event.target.files;
  currentImgPath.value = URL.createObjectURL(fileUploaded.value[0]);
  showImg.value = true
}

const modalState = reactive({profilePic: null});

const openModal = () => {
  modalState.profilePic = new Modal('#profilePicModal',{});
  modalState.profilePic.show();
}
function closeModal() {
  modalState.profilePic.hide();
  modalState.profilePic = null;
}

defineExpose({
  openModal
})

const emits = defineEmits(['profilePic'])

const reset = () => {
  imgPath.value = '';
  fileUploaded.value = {};
  currentImgPath.value = '';
  showImg.value = false;
}

const updateProfilePic = async () => {
  let img = fileUploaded.value?.length && fileUploaded.value?.length > 0 ?
      await blob2base64(await compressBlob(fileUploaded.value.item(0)))
      : currentImgPath.value;

  let res = await fetch('/db/channel/channelPic', {
    method:"PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      channelName: props.channelName,
      newProfilePic: img,
    })
  })
  if (res.ok){
    $toast.success('immagine profilo cambiata', {position:"top-right"});
    emits('profilePic',img);
    closeModal()
  }
  else {
    $toast.error("errore nel cambio dell'immagine profilo");
  }
  reset()
}

</script>

<template>
  <div class="modal fade overflow-hidden" id="profilePicModal" tabindex="-1" aria-hidden="true">
    <div class="centralDiv">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            Vuoi cambiare immagine al canale {{channelName}}?
          </div>
          <div class="modal-body">
            <div class="d-flex flex-column w-100 mt-3 align-items-center">
              <div class="d-flex flex-row align-items-center">
                <div class="input-group d-flex flex-row">
                  <input class="form-control" :disabled="Object.keys(fileUploaded).length !== 0"  type="text" placeholder="inserisci URL foto" id="pathImgForm" v-model="imgPath" >
                  <button :disabled="Object.keys(fileUploaded).length !== 0" type="button" class="btn btn-secondary" @click=" currentImgPath = imgPath; showImg = true">
                    Anteprima
                  </button>
                </div>
              </div>
              <h6 class="m-0 mt-2 mb-2 text-center">oppure</h6>
              <div class="d-flex flex-row align-items-center">
                <label for="formFile" class="form-label flex-shrink-0 mb-0 me-2">carica una foto</label>
                <input :disabled="!canUploadFile" class="form-control" type="file" id="formFile" accept="image/png, image/jpeg"
                       @change="(event) => showPreviewUploaded(event)">
              </div>
              <div class="img-container" v-if="showImg">
                <img :src="currentImgPath" class="img-fluid rounded-circle h-100 object-fit-contain" alt="anteprima immagine">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Indietro</button>
            <button type="button" class="btn btn-danger" @click="updateProfilePic" >Conferma</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .img-container{
    height: 20vh;
    aspect-ratio: 1;
  }
</style>