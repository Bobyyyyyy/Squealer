<script setup>
  import {onMounted, ref} from "vue";
  import Post from "../components/post/Post.vue";
  import {filterValues, getVIPname, postType, sortPosts} from "../utilsSMM";
  import Dropdown from "../components/Dropdown.vue";


  const readyPosts = ref(false);

  const profilePicturePath ="/img/profilePicture.png";
  const nFoll = 10;
  const nPost = 500;

  const quotaRes = {
    daily: 10,
    weekly: 180,
    monthly: 12000
  }

  const keyWordFilter = ref(false);
  const destFilter = ref('Filter');
  const typePostFilter = ref('Type');
  const sortFilter = ref('Sort');

  let query = `name=${getVIPname()}`

  let curPosts = []

  function updatePostType(newText){
    if (typePostFilter.value === 'Type') query += `&typeFilter=${newText}`;
    else query = query.replace(`&typeFilter=${typePostFilter.value}`, `&typeFilter=${newText}`)

    typePostFilter.value=newText
    getPosts()

  }
  function updateSortFilter(newText){

    if (sortFilter.value === 'Sort') query += `&sort=${newText}`;
    else query = query.replace(`&sort=${sortFilter.value}`, `&sort=${newText}`)

    sortFilter.value = newText
    getPosts()
  }

  function updateDestFilter(newText){
    keyWordFilter.value = newText === 'keyword'; //BOOL
    if (!keyWordFilter.value){
      if (destFilter.value === 'Filter') query += `&destType=${newText}`;
      else query = query.replace(`&destType=${destFilter.value}`, `&destType=${newText}`)
      destFilter.value = newText
    }
      //GESTIRE IL CASO DELLA KEYWORD

    destFilter.value = newText;
    console.log(query)
    getPosts()
  }

  async function getPosts(){
    readyPosts.value=false
    try{
      let res = await fetch(`/db/posts?${query}`,{
        method:"GET",
      });
      curPosts = (await res.json()).map(post => { return {...post, dateOfCreation: new Date(Date.parse(post.dateOfCreation))} });
      readyPosts.value=true
    }catch (e) {
      throw e
    }
  }

  onMounted(async ()=>{
    try {
      await getPosts()
    } catch (e) {
      console.log(e)
    }
  })
</script>

<template>
  <div class="centralDiv">
    <div class="marginCD">
      <div class="d-flex flex-row justify-content-center  profileDim">
        <div class="aspect-ratio object-fit-fill profileDim">
          <img :src= "profilePicturePath" alt="pippo" class="img-fluid" />
        </div>
      </div>
      <div class="d-flex flex-row w-100 justify-content-between">
        <div class="d-flex flex-column ">
          <div>
            <p class="m-0">{{nFoll}} Followers</p>
          </div>
          <div>
            <p class="m-0">{{nPost}} Posts</p>
          </div>
        </div>
        <div>
          <p class="m-0 fs-3 text-center">{{ getVIPname() }}</p>
        </div>
        <div>
          <p class="m-0">Quota rimanente:</p>
          <p>{{quotaRes.daily}}/{{quotaRes.weekly}}/{{quotaRes.monthly}}</p>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-between">
        <div class="d-flex flex-row justify-content-around align-items-center setFlexDirection">
          <Dropdown
              :filterRef="destFilter"
              :dropItems="filterValues"
              updateRef = 'updateDestFilter'
              @updateDestFilter = updateDestFilter
          />
          <div v-if="keyWordFilter" class="ms-1">
            <input type="text" placeholder="Keyword..." />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-evenly setFlexDirection">

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
      </div>
      <div v-if="readyPosts" class="d-flex flex-row flex-wrap justify-content-around mt-3">
        <Post v-for="(post,i) in curPosts" :key="i"
              :user="post.owner.name"
              :dest= "post.destination.dest.destType === 'channel'? `§${post.destination.receiver.name}`:`@${post.destination.receiver.name}`"
              :content="post.content"
              picProfile = "/img/defaultUser.jpeg"
              :creationDate="post.dateOfCreation"
              :contentType = "post.contentType"
              :destType = "post.destination.dest.destType"
        />
      </div>
    </div>
  </div>
</template>

<style>

  .profileDim{
    height: 20vh;
  }

  @media screen and (max-width: 768px) {

    .profileDim{
      max-height: 10vh;
    }

    .setFlexDirection{
      margin-bottom: 0;
      flex-direction: column !important;
    }

    .buttonDropDown{
      align-self: end;
      margin-bottom: 2%;
    }
  }

  .aspect-ratio{
    aspect-ratio: 1;
  }

</style>