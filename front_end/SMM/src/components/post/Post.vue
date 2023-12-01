<script setup>
  import HeaderPost from "./HeaderPost.vue"
  import FooterPost from "./FooterPost.vue"
  import PostMap from "./PostMap.vue";
  import {computed} from "vue";
  import {parseContentText} from "../../utils/functions.js";

  const props = defineProps({
    user: String,
    dest: String,
    picProfile: String,
    content: String,
    contentType:String,
    creationDate: Date,
    postId: String,
    reactions: Array,
    numberOfPost: Number,
  })

  function getIdMap(){
    return `map${props.numberOfPost}`;
  }

  const onlyUser = computed(() => {
    let tmpArr = props.dest.split(', ');
    for (let i = 0; i < tmpArr.length; i++) {
      if(tmpArr[i].startsWith('§')) return false;
    }
    return true;
  })

  const htmlContent = computed(() => parseContentText(props.content,'h4'))
</script>


<template>
  <div class="card mb-4 d-flex flex-column justify-content-between mt-1 postDim">
    <div class="justify-content-center h-100">
      <HeaderPost
          :name= "user"
          :dest="dest"
          :srcImg="picProfile"
          :dateCreation="creationDate"
      />
      <div class="d-flex flex-row justify-content-center text-center align-items-center">
        <img v-if="contentType==='image'" :src="content"  alt="silly cat" class="img-fluid w-100 h-100 object-fit-fill" />
        <postMap v-if="contentType==='geolocation'"
                 :latlng = "JSON.parse(content)"
                 :mapID = "getIdMap()"
        />
        <div v-if="contentType === 'text'" class="mb-0 text-center m-2 mb-2 align-self-center" v-html="htmlContent"></div>
        <iframe v-if="contentType ==='video'" :src="content" width="100%" height="100%" allowfullscreen></iframe>
      </div>
    </div>
    <div v-if="!onlyUser">
      <FooterPost
          :reactions="reactions"
          :postId = "postId"
          :idx = "numberOfPost"
      />
    </div>

  </div>
</template>

<style>

  .postDim{
    width: 40rem;
    height: auto;
  }

  @media screen and (max-width: 768px) {
    .postDim{
      width: 100%;
    }
  }

</style>
