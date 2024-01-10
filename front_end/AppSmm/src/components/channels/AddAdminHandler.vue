<script setup>
import {reactive, ref} from "vue";
import {Modal} from "bootstrap";
import RemoveButton from "../RemoveButton.vue";
import {useToast} from "vue-toast-notification";

const modalState = reactive({addAdmin: null});

const $toast = useToast();

const props = defineProps({
  followers: Array,
  chname: String,
})

const remFollowers = ref();

const openModal = () => {
  modalState.addAdmin = new Modal('#channelAddAdmin',{});
  remFollowers.value = props.followers.map(obj => obj.user);
  modalState.addAdmin.show();
}
function closeModal() {
  modalState.addAdmin.hide();
  modalState.addAdmin = null;
}

defineExpose({
  openModal,
})

const emits = defineEmits(['updateAdmin'])

const selected = ref('');
const selectedUsers = ref([]);

const getIDlist = () => `listFollower${props.chname}`
const addInListAdmin = () => {
  if(!remFollowers.value.includes(selected.value) || selected.value === ''){
    $toast.error('inserisci utente valido');
  }
  else {
    let idx = remFollowers.value.indexOf(selected.value);
    console.log(idx);
    remFollowers.value.splice(idx,1);
    selectedUsers.value.push(selected.value);
    selected.value = '';
  }
}

const removeInListAdmin = (name) => {
  let idx = selectedUsers.value.indexOf(name);
  selectedUsers.value.splice(idx,1);
  remFollowers.value.push(name);
}

const confirmAdmins = async () =>  {
  let gres = true;
  for(const user of selectedUsers.value){
    let res = await fetch('/db/channel/admin', {
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        user: user,
        channel: props.chname,
      })
    })
    if (!res.ok) {
      $toast.error(`errore nell'inserimento di ${user}`);
      gres = false;
    } else emits('updateAdmin', user);
  }
  if(gres) $toast.success('inseriti admin', {position:'top-right'})
  selectedUsers.value = [];
  selected.value = '';
  closeModal();
}
</script>

<template>
  <div class="modal modal fade overflow-hidden" id="channelAddAdmin" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bolder"> aggiungi admin - {{chname}}</h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <input class="form-control" placeholder="inserisci utente..." :list="getIDlist()" v-model="selected" @keydown.enter="addInListAdmin">
              <datalist :id="getIDlist()">
                <option v-for="(follower,i) in remFollowers?.sort((a, b) => a.localeCompare(b))"
                        :key="i"
                        :value="follower" />
              </datalist>
              <button class="btn btn-primary" @click="addInListAdmin">aggiungi</button>
            </div>

            <h5 class="m-0 mt-3 text-center">utenti selezionati:</h5>
            <div class="d-flex flex-column align-items-center" >
              <div v-for="(user,i) in selectedUsers" :key="user+i" class="w-50 d-flex flex-row justify-content-around mt-2">
                <span>{{ user }}</span>
                <RemoveButton :value="user" @updateList="(name) =>  removeInListAdmin(name)"/>
              </div>
            </div>
            <hr class="mt-2 mb-3">
            <div class="d-flex flex-row justify-content-end">
              <button class="btn btn-primary" @click="confirmAdmins">Conferma</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>