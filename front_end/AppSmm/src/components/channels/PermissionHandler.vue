<script setup>
  import {onMounted, onUnmounted, reactive} from "vue";
  import {Modal} from "bootstrap";
  import Permission from "./Permission.vue";

  const modalState = reactive({permissions: null});

  const props = defineProps({
    followers: Array,
    chname: String,
  })

  const openModal = () => {
    modalState.permissions = new Modal('#channelPermissions',{});
    modalState.permissions.show()
  }
  function closeModal() {
    modalState.permissions.hide();
    modalState.permissions = null;
  }

  defineExpose({
    openModal,
  })



</script>

<template>
  <div class="modal modal fade overflow-hidden" id="channelPermissions" tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5 fw-bolder"> Gestisci permessi - {{chname}}</h1>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-row justify-content-between mb-1">
              <span>utente</span>
              <span>può scrivere</span>
            </div>
            <hr class="mt-0">
            <Permission v-for="(follower,i) in followers"
                        :key="i"
                        :follower="follower"
                        :chname="chname"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>