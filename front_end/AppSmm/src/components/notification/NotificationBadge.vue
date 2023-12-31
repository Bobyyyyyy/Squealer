<script setup>

import {computed, onMounted, ref} from "vue";
import {currentVip} from "../../utils/config.js";
import NotificationModal from "./notificationModal.vue";
import {useStore} from "vuex";

const MINUTE = 60000;

const store = useStore();

defineProps({
  text:String,
  classes:String,
})

const notifications = computed(() => store.getters.getNotifications);
const isNotif = computed(() => notifications.value.length > 0);

const checkNot = async () => {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const check = async () => {
    let res = await fetch(`/db/notification?user=${currentVip.value}`, {
      method:"GET",
    })
    store.commit('setNotification', await res.json());
  }

  await check();

  while (true){
    setTimeout(check, MINUTE);
    await sleep(MINUTE);
  }
}

onMounted(async () => {
  checkNot();
})

defineEmits(['openNotificationModal']);


</script>

<template>
    <button type="button"
            class="btn btn-lg btn-primary position-relative text-center"
            :class="classes"
            :disabled="!isNotif"
            @click="$emit('openNotificationModal')"
            style="width: 6vw; height: 3vh">
      {{ text }}
      <span v-if="isNotif" class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
        <span v-if="isNotif" class="visually-hidden">New alerts</span>
      </span>
    </button>
</template>
