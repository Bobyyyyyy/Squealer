<script setup>
  import Post from "../post/Post.vue";
  import {parseDestinationsViewPost} from "../../utils/functions.js";
  import {computed, onMounted, ref} from "vue";

  const srcImage = ref('');

  defineEmits(['setModal']);

  const props = defineProps({
    username: String,
    followers: Number,
    post: Object,
  })

  const noPost = computed(()=> {
    return Object.keys(props.post).length === 0
  })

  onMounted(async () => {
      let res = await fetch(`/db/user/profilePic?name=${props.username}`,{
        method:"GET",
      })
      srcImage.value = (await res.json()).profilePic;
  })

</script>

<template>
  <div class="d-flex flex-column justify-content-between vipCard border-primary mt-3">
    <div class="d-flex flex-column justify-content-around align-items-center mt-4">
      <div class="d-flex justify-content-center profilePicContainer" >
        <img :src=" srcImage " alt="immagine profilo" class="img-fluid rounded-circle" />
      </div>
      <div class="d-flex justify-content-center">
        <h3 class="mb-0">@{{ username }}</h3>
      </div>
    </div>
    <div class="d-flex flex-column postMargin">
      <h5 class="mb-0">Ultimo Post: </h5>
      <div v-if="!noPost" class="d-flex flex-row justify-content-center">
        <Post
            :post="post"
            :dest= "parseDestinationsViewPost(post.destinationArray, post.officialChannelsArray)"
            :numberOfPost="0"
            :picProfile = "srcImage"
            :handle = 'true'
        />
      </div>
      <div v-else class="text-center w-100">
        non ci sono squeal
      </div>
    </div>
    <div class="d-flex justify-content-center mb-2">
      <button type="button" class="btn btn-primary" @click="$emit('setModal', username, srcImage)"> Gestisci </button>
    </div>
  </div>
</template>

<style scoped>


  .postMargin{
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .vipCard{
    border-radius: 5%;
    background-color: #232323;
    border: thick double black !important;
  }
  .profilePicContainer{
    height: 15vh;
  }

  @media screen and (max-width: 768px){
    .vipCard{
      width: 100vw;
    }
  }

</style>