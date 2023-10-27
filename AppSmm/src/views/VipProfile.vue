<script setup>
import {onMounted, ref} from "vue";
  import Post from "../components/post/Post.vue";
import {currentVip, getVIPname, postType, sortPosts} from "../utilsSMM";

  const readyPosts = ref(false);

  const profilePicturePath ="/img/profilePicture.png";
  const nFoll = 10;
  const nPost = 500;

  const quotaRes = {
    daily: 10,
    weekly: 180,
    monthly: 12000
  }

  const filterValues =['Pubblici', 'Privati', 'Singoli']

  const keyWordFilter = ref(false);
  const textFilter = ref('Filter');
  const typePostFilter = ref('Type');
  const sortFilter = ref('Sort');

  let curPosts = []

  function setKeyWdFilter() {
    keyWordFilter.value = !keyWordFilter.value
  }

  function disableKeyWdFilter(){
    keyWordFilter.value=false
  }

  function updateTextFilter(newText){
    textFilter.value=newText
  }

  function updateTextType(newText){
    typePostFilter.value=newText
  }
  function updateSortFilter(newText){
    sortFilter.value=newText
  }

  onMounted(async ()=>{
    try{
      let res = await fetch(`/db/posts?name=${getVIPname()}`,{
        method:"GET",
      });
      curPosts = await res.json();
      readyPosts.value=true
    }catch (e) {
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
          <div class="dropdown">
            <a class="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{textFilter}}</a>
            <ul class="dropdown-menu">
              <li v-for="(el,i) in filterValues" :key ="i">
                <a class="dropdown-item" @click="disableKeyWdFilter(); updateTextFilter(el)">{{ el }}</a>
              </li>
              <li><a class="dropdown-item" v-on:click="setKeyWdFilter(); updateTextFilter('Keyword')">Keyword</a></li>
            </ul>
          </div>
          <div v-if="keyWordFilter" class="ms-1">
            <input type="text" placeholder="Keyword..." />
          </div>
        </div>

        <div class="d-flex flex-row justify-content-evenly setFlexDirection">
          <div class="dropdown buttonDropDown">
            <a class="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{typePostFilter}}</a>
            <ul class="dropdown-menu">
              <li v-for="(el,i) in postType" :key="i" ><a class="dropdown-item" v-on:click="disableKeyWdFilter();updateTextType(el)">{{ el }}</a></li>
            </ul>
          </div>
          <div class="dropdown ms-1 buttonDropDown">
            <a class="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{ sortFilter }}</a>
            <ul class="dropdown-menu">
              <li v-for="(el,i) in sortPosts" :key="i" ><a class="dropdown-item" v-on:click="disableKeyWdFilter(); updateSortFilter(el)">{{ el }}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="readyPosts" class="d-flex flex-row flex-wrap justify-content-around mt-3">
        <Post v-for="(post,i) in curPosts" :key="i"
              :user="post.owner.name"
              :dest= "post.destination.destType == 'channel'? `§${post.destination.receiver.name}`:`@${post.destination.receiver.name}`"
              :content="post.content"
              picProfile = "/img/defaultUser.jpeg"
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