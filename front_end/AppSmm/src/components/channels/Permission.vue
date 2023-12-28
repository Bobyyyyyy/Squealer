<script setup>
  import {ref} from "vue";
  import {useToast} from "vue-toast-notification";

  const $toast = useToast();

  const props = defineProps({
    follower: Object,
    chname: String,
  })

  const checkbox = ref();

  async function changePermission(){
    let res = await fetch(`/db/channel/permissions`, {
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        user: props.follower.user,
        channel: props.chname,
        canWrite: checkbox.value,
      })
    })
    if (res.ok){
      $toast.success(`${props.follower.user} ora ${checkbox.value ? '' : 'non'} può scrivere.`, {position: 'top-right'});
    }
    else $toast.error(`Errore ${res.statusCode}:${await res.json()}`);
  }
</script>

<template>
  <div class="d-flex flex-row justify-content-between">
    <span>{{follower.user}}</span>
    <div class="form-check form-switch">
      <input @change="changePermission" class="form-check-input" type="checkbox" role="switch" :checked="follower.canWrite ? 'checked': ''" v-model="checkbox">
    </div>
  </div>
  <hr>
</template>

<style scoped>

</style>