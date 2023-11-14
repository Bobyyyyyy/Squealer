<script setup>
  import HeaderPost from "./HeaderPost.vue"
  import FooterPost from "./FooterPost.vue"
  import PostMap from "./PostMap.vue";
  import {computed} from "vue";

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

</script>


<template>
  <div class="card mb-4 d-flex flex-column justify-content-between mt-1 setDim">
    <div class="justify-content-center h-100">
      <HeaderPost
          :name= "user"
          :dest="dest"
          :srcImg="picProfile"
          :dateCreation="creationDate"
      />
      <div class="d-flex flex-row justify-content-center text-center align-items-center">
        <!-- SI devono poter inserire anche altre cose, non solo immagini! Swtich in base al tipo di messaggio? -->
        <img v-if="contentType==='image'" :src="content"  alt="silly cat" class="img-fluid w-100 h-100 object-fit-fill" />
        <postMap v-if="contentType==='geolocation'"
                 :latlng = "JSON.parse(content)"
                 :mapID = "getIdMap()"
        />
        <p v-if="contentType === 'text'" class="mb-0">
          {{content}}
        </p>
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

  .setDim{
    width: 40rem;
    height: auto;
  }

  @media screen and (max-width: 768px) {
    .setDim{
      max-width: 100%;
    }
  }

</style>
