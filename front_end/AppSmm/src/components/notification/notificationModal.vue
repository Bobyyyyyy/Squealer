<script setup>
import {computed, onMounted, ref} from "vue";
import {Modal} from "bootstrap";

import {useStore} from "vuex";
import Notification from "./Notification.vue";
import {currentVip} from "../../utils/config.js";
import {useToast} from "vue-toast-notification";

const store = useStore();
const $toast = useToast();

const modalStateNotification = ref({notificationModal: null});
const notifications = computed(() => store.getters.getNotifications);

const parsedNotification = computed(() => {
  let dict = {};
  notifications.value.forEach(notif => {
    if(!dict[notif.channel]){
      dict[notif.channel] =[notif.sender]
    }
    else {
      dict[notif.channel].push(notif.sender);
    }
  })
  console.log(Object.entries(dict));
  return Object.entries(dict);
})

function openModal() {
  console.log(notifications.value);
  modalStateNotification.notificationModal = new Modal("#notModal", {});
  modalStateNotification.notificationModal.show()
}
function closeModal () {modalStateNotification.notificationModal.hide()}

const deleteNotifications = async () =>{
  let res = await fetch('/db/notification', {
    method: 'DELETE',
    body: {
      user: currentVip.value,
    }
  })
  if (res.ok){
    $toast.success('notifiche rimosse', {position: 'top-right'});
    store.commit('deleteNotifications');
  }
  else $toast.error('errore nella rimozione delle notifiche')

}

defineExpose({
  openModal
})

</script>

<template>
  <div class="modal fade overflow-hidden" id="notModal" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5"> Notifiche </h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Notification v-for="(notification,i) in parsedNotification" :key="i"
                          :creators="notification[1]"
                          :num="notification[1].length"
                          :channel="notification[0]"
            />
          </div>
          <button class="btn btn-danger" @click="deleteNotifications">Rimuovi notifiche</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>