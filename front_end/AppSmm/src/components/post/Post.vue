<script setup>
  import HeaderPost from "./HeaderPost.vue"
  import FooterPost from "./FooterPost.vue"
  import PostMap from "./PostMap.vue";
  import {computed} from "vue";
  import {parseContentText} from "../../utils/functions.js";

  const props = defineProps({
    post: Object,
    dest: String,
    picProfile: String,
    numberOfPost: Number,
    viewFooter:{
      type: Boolean,
      default: true,
    },
    handle: {
      type: Boolean,
      default: false,
    }
  })

  const idMap = `map${props.numberOfPost}${Math.floor(Math.random() * 10000)}`

  const onlyUser = computed(() => {
    let tmpArr = props.dest.split(', ');
    for (let i = 0; i < tmpArr.length; i++) {
      if(tmpArr[i].startsWith('§') || tmpArr[i].startsWith('#') ) return false;
    }
    return true;
  })

  const htmlContent = computed(() => parseContentText(props.post.content,'h4'))
</script>


<template>
  <div class="card mb-4 d-flex flex-column justify-content-between mt-1 postDim bg-secondary" :class="post.contentType === 'geolocation' ? 'map_dim' : ''">

      <HeaderPost
          :name= "post.owner"
          :dest="dest"
          :srcImg="picProfile"
          :dateCreation="new Date(post.dateOfCreation)"
      />
      <div class="d-flex flex-row justify-content-center text-center align-items-center text-dark h-100">
        <img v-if="post.contentType==='image'" :src="post.content"  alt="silly cat" class="img-fluid" />
        <postMap v-if="post.contentType==='geolocation'"
                 :latlng = "post.content"
                 :mapID = "idMap"
        />
        <div v-if="post.contentType === 'text'" class="mb-0 m-2 mb-2 align-self-center w-100" v-html="htmlContent"></div>
        <iframe v-if="post.contentType ==='video'" :src="post.content" width="100%" height="100%" allowfullscreen></iframe>
      </div>
    <div v-if="!onlyUser && viewFooter">
      <FooterPost
          :post="post"
          :idx = "numberOfPost"
          :handle = "handle"
      />
    </div>
  </div>
</template>

<style>

  .postDim{
    width: 40rem;
    height: auto;
  }

  .map_dim{
    height: 30rem !important;
  }

  @media screen and (max-width: 768px) {
    .postDim{
      width: 100%;
    }
  }

</style>
