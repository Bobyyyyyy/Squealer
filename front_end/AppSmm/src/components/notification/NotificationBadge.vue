<script setup>

import {computed, onMounted, ref} from "vue";
import {currentVip} from "../../utils/config.js";
import NotificationModal from "./notificationModal.vue";

defineProps({
  text:String,
  classes:String,
})

const notification = ref(null);

onMounted(async () => {
  let res = await fetch(`/db/notification?user=${currentVip.value}`, {method:"GET"});
  notification.value = await res.json();
})

defineEmits(['openNotificationModal']);

const isNotification = computed(() => notification.value && Object.keys(notification.value).length !== 0)

</script>

<template>
    <button type="button"
            class="btn btn-lg btn-primary position-relative text-center"
            :class="classes"
            :disabled="!isNotification"
            @click="$emit('openNotificationModal')"
            style="width: 6vw; height: 3vh">
      {{ text }}
      <span v-if="isNotification" class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
        <span v-if="isNotification" class="visually-hidden">New alerts</span>
      </span>
    </button>
</template>
