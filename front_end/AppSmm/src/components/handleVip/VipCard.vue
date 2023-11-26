<script setup>
  import Post from "../post/Post.vue";
  import {parseDestinations} from "../../utils/functions.js";
  import {computed, onMounted} from "vue";
  let srcImg="/img/profilePicture.png";

  defineEmits(['setModal']);

  const props = defineProps({
    username: String,
    followers: Number,
    post: Object,
  })

  const noPost = computed(()=> {
    return Object.keys(props.post).length === 0
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
    </div>
    <div class="d-flex flex-column postMargin">
      <h5 class="mb-0">Last Post: </h5>
      <div v-if="!noPost" class="d-flex flex-row justify-content-center">
        <Post
            :user="post.owner"
            :dest= "parseDestinations(post.destinationArray)"
            :content="post.content"
            :creationDate="new Date(post.dateOfCreation)"
            :reactions = "post.reactions"
            :contentType = "post.contentType"
            :postId = "post._id"
            :numberOfPost="i"
            picProfile = "/img/defaultUser.jpeg"
        />
      </div>
      <div v-else>
        NON CI SONO POST
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