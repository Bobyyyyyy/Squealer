<script setup>
  import Post from "../post/Post.vue";
  import {reactive} from "vue";
  let srcImg="/img/profilePicture.png";

  const props = defineProps({
    username: String,
    followers: Number,
  })


</script>

<template>
  <div class="d-flex flex-column justify-content-around vipCard">
    <div class="d-flex flex-column justify-content-around">
      <div class="d-flex justify-content-center">
        <img :src=" srcImg " alt="immagine profilo" class="imgFluid" />
      </div>
      <div class="d-flex justify-content-center">
        <h4 class="mb-0">{{ username }}</h4>
      </div>
      <div class="d-flex justify-content-center">
        <h6>{{followers}} followers</h6>
      </div>
    </div>
    <div class="d-flex flex-column postMargin">
      <h5 class="mb-0">Last Post: </h5>
      <div class="d-flex flex-row justify-content-center">
        <Post />
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <button type="button" class="btn btn-primary" @click="$emit('setModal', username)"> Gestisci </button>
    </div>
  </div>
</template>

<style>

  .imgFluid{
    width: 15%;
    margin-bottom: 0;
  }

  .vipCard{
    width: 25rem;
    height: 45rem;
    border: 0.15rem solid;
    border-radius: 12%;
  }

  .postMargin{
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

</style>