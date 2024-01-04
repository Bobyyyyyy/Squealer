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
  <div class="d-flex flex-column justify-content-around vipCard border-primary bg-body-secondary mt-3">
    <div class="d-flex flex-column justify-content-around align-items-center">
      <div class="d-flex justify-content-center" style="width: 35%">
        <img :src=" srcImage " alt="immagine profilo" class="img-fluid rounded-circle" />
      </div>
      <div class="d-flex justify-content-center">
        <h3 class="mb-0">{{ username }}</h3>
      </div>
    </div>
    <div class="d-flex flex-column postMargin">
      <h5 class="mb-0">Ultimo Post: </h5>
      <div v-if="!noPost" class="d-flex flex-row justify-content-center">
        <Post
            :post="post"
            :dest= "parseDestinationsViewPost(post.destinationArray, post.officialChannelsArray)"
            :numberOfPost="1"
            :picProfile = "srcImage"
        />
      </div>
      <div v-else>
        NON CI SONO POST
      </div>
    </div>
    <div class="d-flex justify-content-center mb-2">
      <button type="button" class="btn btn-primary" @click="$emit('setModal', username)"> Gestisci </button>
    </div>
  </div>
</template>

<style scoped>


  .postMargin{
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  @media screen and (max-width: 768px){
    .vipCard{
      width: 100vw;
    }
  }

</style>