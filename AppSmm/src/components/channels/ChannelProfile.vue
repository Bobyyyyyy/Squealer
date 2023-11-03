<script setup>
  import {computed, onMounted, ref} from "vue";
  import {useStore} from "vuex";
  import Post from "../post/Post.vue";
  import {currentVip, getPosts, postType, sortPosts} from "../../utilsSMM";
  import Dropdown from "../Dropdown.vue";

  const store = useStore()

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
    query =`name=${currentVip.value}&channel=${chInfo.value.chName}`;
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
            <img src="https://picsum.photos/id/1/300/300" class="img-fluid" alt="gatto che ormai ha stufato">
          </div>
        </div>
        <h2 class="m-1 text-center">{{ chInfo.chName }}</h2>
        <h5 class="m-1 text-center">{{ chInfo.chDescription }}</h5>
      </div>
      <div class="d-flex flex-row justify-content-end">
        <Dropdown class="buttonDropDown"
                  :filterRef="typePostFilter"
                  :dropItems="postType"
                  updateRef = 'updatePostType'
                  @updatePostType = updatePostType
        />
        <Dropdown  class="ms-1 buttonDropDown"
                   :filterRef="sortFilter"
                   :dropItems="sortPosts"
                   updateRef = 'updateSort'
                   @updateSort = updateSortFilter
        />
      </div>
      <div v-if="readyPosts" class="d-flex flex-row flex-wrap justify-content-around mt-3">
        <Post v-for="post in curPosts" :key="post._id"
              :user="post.owner"
              :dest= "post.destination.destType === 'channel'? `§${post.destination.name}`:`@${post.destination.name}`"
              :content="post.content"
              :creationDate="post.dateOfCreation"
              :reactions = "post.reactions"
              :contentType = "post.contentType"
              :destType = "post.destination.destType"
              :postId = "post._id"
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