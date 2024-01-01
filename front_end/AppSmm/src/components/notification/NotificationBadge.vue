<script setup>

import {computed, onMounted, ref} from "vue";
import {currentVip} from "../../utils/config.js";
import NotificationModal from "./notificationModal.vue";
import {useStore} from "vuex";
import Dropdown from "../Dropdown.vue";
import {logout} from "../../utils/functions.js";

const MINUTE = 60000;

const store = useStore();

defineProps({
  text:String,
  classes:String,
  disable: {
    type: Boolean,
    default: true,
  },
  smartphoneNav:{
    type: Boolean,
    default: false
  }
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
    <Dropdown v-if="smartphoneNav"
              id="notification_badge"
              :filterRef="currentVip"
              classButton="btn btn-lg btn-primary position-relative text-center h-100 w-100 p-0 d-flex flex-row align-items-center ps-1 pe-1"
              updateRef="action"
              classDropDown="dropstart"
              :dropItems="['cambia VIP', 'mostra notifiche','logout']"
              @action="async (el) => {
              if (el === 'cambia VIP')  $router.push('/AppSmm/handlevip');
              else if (el === 'mostra notifiche') $emit('openNotificationModal')
              else await logout();
      }"
    >
      <span v-if="isNotif" class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
        <span v-if="isNotif" class="visually-hidden">New alerts</span>
      </span>
    </Dropdown>


    <button v-else id="notification_badge"
            type="button"
            class="btn btn-lg btn-primary position-relative text-center"
            :class="classes"
            :disabled="disable && !isNotif"
            @click="$emit('openNotificationModal')">
      {{ text }}
      <span v-if="isNotif" class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
        <span v-if="isNotif" class="visually-hidden">New alerts</span>
      </span>
    </button>
</template>

<style scoped>
  #notification_badge{
    width: 6vw; height: 3vh
  }

  @media screen and (max-width: 768px){
    #notification_badge{
      width: auto;
      padding-left: 1vw !important;
      padding-right: 1vw !important;
      height: 3vh
    }
  }
</style>
