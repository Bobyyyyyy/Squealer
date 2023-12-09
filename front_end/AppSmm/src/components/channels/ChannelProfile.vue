<script setup>
  import {computed, onMounted, ref} from "vue";
  import Post from "../post/Post.vue";
  import Select from "../Select.vue";
  import {currentVip, postType, postTypeITAS, sortPosts} from "../../utils/config.js";
  import {getPosts, parseDestinationsViewPost} from "../../utils/functions.js";
  import {useStore} from "vuex";

  const store = useStore();

  const chInfo = computed(()=> store.state.currentChannel)

  const typePostFilter = ref('Type');
  const sortFilter = ref('Sort');
  const readyPosts = ref(false);

  let query = ''
  let curPosts = []

  async function updateSortFilter(newText){
    readyPosts.value=false

    if (sortFilter.value === 'Sort') query += `&sort=${newText}`;
    else query = query.replace(`&sort=${sortFilter.value}`, `&sort=${newText}`)

    sortFilter.value = newText

    curPosts = await getPosts(query)
    readyPosts.value=true
  }
  async function updatePostType(newText){
  readyPosts.value=false

  if (typePostFilter.value === 'Type') query += `&typeFilter=${newText}`;
  else query = query.replace(`&typeFilter=${typePostFilter.value}`, `&typeFilter=${newText}`)

  typePostFilter.value=newText

  curPosts = await getPosts(query)
  readyPosts.value=true
 }

  onMounted(async ()=>{
    query =`name=${currentVip.value}&channel=${chInfo.value.chName}&smm=${true}`;
    readyPosts.value=false
    curPosts = await getPosts(query)
    readyPosts.value=true
  })

</script>

<template>
  <div class="centralDiv">
    <div class="marginCD">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-center w-100">
          <div class="maxWidth">
            <img src="https://picsum.photos/id/1/300/300" class="img-fluid rounded-circle" alt="gatto che ormai ha stufato">
          </div>
        </div>
        <h2 class="m-1 text-center">{{ chInfo.chName }}</h2>
        <h5 class="m-1 text-center">{{ chInfo.chDescription }}</h5>
      </div>
      <div class="d-flex flex-row justify-content-end">
        <Select class="ms-1 buttonDropDown"
                classButton="btn btn-secondary"
                :dropItems="postType"
                :dropItemsName="postTypeITAS"
                updateRef = 'updatePostType'
                label= 'contenuto'
                def = 'all'
                @updatePostType = updatePostType
        />

        <Select  class="ms-1 buttonDropDown"
                 classButton="btn btn-secondary"
                 :dropItems="sortPosts"
                 :dropItemsName="sortPosts"
                 updateRef = 'updateSort'
                 label="ordina per"
                 :def="sortPosts[0]"
                 @updateSort = updateSortFilter
        />
      </div>
      <div v-if="readyPosts" class="d-flex flex-row flex-wrap justify-content-around mt-3">
        <Post v-for="(post,i) in curPosts" :key="post._id"
              :user="post.owner"
              :dest= "parseDestinationsViewPost(post.destinationArray, post.tags)"
              :content="post.content"
              :creationDate="post.dateOfCreation"
              :reactions = "post.reactions"
              :contentType = "post.contentType"
              :postId = "post._id"
              :numberOfPost="i"
              :views="post.views.length"
              picProfile = "/img/defaultUser.jpeg"
        />
      </div>
    </div>
  </div>
</template>

<style>
  .maxWidth{
    max-width:  20vh;
  }
</style>