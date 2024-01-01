<script setup>
  import {parseTime} from "../../../utils/functions.js";

  defineProps({
    profilePic: String,
    content: String,
    creator: String,
    dateCreation: String,
  })
</script>

<template>
  <div class="card d-flex flex-row justify-content-between mt-1 replyDim bg-secondary text-dark">
    <div style="height: 6rem; width: 4.5rem">
      <div class="d-flex align-items-center" style="width: 100%; aspect-ratio: 1">
        <img :src="profilePic" alt="immagine di profilo" class="h-100 img-fluid rounded-circle">
      </div>
    </div>
    <div class="d-flex flex-column h-100 flex-grow-1 mt-1 ms-1">
      <div class="d-flex flex-row">
        <div class="w-100 h-auto flex-grow-1">
          <h4 class="m-0">{{creator}}</h4>
        </div>
        <h5 v-tooltip="dateCreation.toString()" class="mb-0 text-dark" style="width: 4rem">
          {{parseTime(dateCreation)}}
        </h5>
      </div>

      <div class="w-100 h-auto">
        <p class="m-0">{{content}}</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.replyDim{
  width: 32rem;
  height: auto;
}

@media screen and (max-width: 768px){
  .replyDim{
    width: 100% !important;
  }
}
</style>