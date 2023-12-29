<script setup>
  import {reactive, ref} from "vue";
  import {Modal} from "bootstrap";
  import RemoveButton from "../RemoveButton.vue";
  import {useToast} from "vue-toast-notification";

  const $toast = useToast();

  const modalState = reactive({removeAdmin: null});

  const props = defineProps({
    admins: Array,
    chname: String,
  })

  const openModal = () => {
    modalState.removeAdmin = new Modal('#channelDeleteAdmin',{});
    modalState.removeAdmin.show();
  }
  function closeModal() {
    modalState.removeAdmin.hide();
    modalState.removeAdmin = null;
  }

  defineExpose({openModal});
  const emits = defineEmits(['updateAdmin']);
  const selectedUsers = ref([]);

  const confirmDelete = async () => {
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
      if (!res.ok){
        $toast.error(`errore nella rimozione di ${user}`);
        gres = false;
      } else emits('updateAdmin', user);
    }
    if(gres) $toast.success('rimossi admin selezionati', {position:'top-right'});
    selectedUsers.value = [];
    closeModal();
  }
</script>

<template>
  <div class="modal modal fade overflow-hidden" id="channelDeleteAdmin" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bolder"> rimuovi admin - {{chname}}</h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-column align-items-center">
              <div v-for="(user,i) in admins?.sort((a, b) => a.localeCompare(b))" :key="user+i" class="w-75 d-flex flex-row justify-content-between mt-1 mb-1 align-items-center">
                <span>{{user}}</span>
                <button type="button" class="btn btn-danger btn-sm" @click="() => {
                  admins.splice(admins.indexOf(user),1);
                  selectedUsers.push(user);
                }">rimuovi</button>
              </div>
            </div>
            <hr class="mt-2 mb-3">
            <div v-if="selectedUsers.length > 0" class="d-flex flex-column align-items-center">
              <span>selezionati:</span>
              <div v-for="(user,i) in selectedUsers" :key="user+i" class="w-50 d-flex flex-row justify-content-around mt-2">
                <span>{{ user }}</span>
                <RemoveButton :value="user" @updateList="() => {
                  selectedUsers.splice(selectedUsers.indexOf(user),1);
                  admins.push(user);
                }" />
              </div>
              <hr class="mt-2 mb-3">
            </div>
            <div class="d-flex flex-row justify-content-end">
              <button class="btn btn-primary" @click="confirmDelete">Conferma</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>