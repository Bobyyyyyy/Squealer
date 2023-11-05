<script setup>
import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
  import Post from "../components/post/Post.vue";
  import {currentVip, filterValues, getPosts, getUserQuota, postType, sortPosts} from "../utilsSMM";
  import Dropdown from "../components/Dropdown.vue";
  import {useStore} from "vuex";

  const store = useStore();
  let nFoll = 10;
  let nPost = 10;



  const readyPosts = ref(false);

  const profilePicturePath ="/img/profilePicture.png";

  const keyWordFilter = ref(false);
  const destFilter = ref('Filter');
  const typePostFilter = ref('Type');
  const sortFilter = ref('Sort');
  const offset = ref(0);

  let query = ''

  let curPosts = reactive([]);

  async function updatePostType(newText){
    readyPosts.value=false

    if (typePostFilter.value === 'Type') query += `&typeFilter=${newText}`;
    else query = query.replace(`&typeFilter=${typePostFilter.value}`, `&typeFilter=${newText}`)

    typePostFilter.value=newText

    curPosts = (await getPosts(query,0))
    readyPosts.value=true
  }
  async function updateSortFilter(newText){
    readyPosts.value=false

    if (sortFilter.value === 'Sort') query += `&sort=${newText}`;
    else query = query.replace(`&sort=${sortFilter.value}`, `&sort=${newText}`)

    sortFilter.value = newText

    curPosts = (await getPosts(query,0))
    readyPosts.value=true
  }
  async function updateDestFilter(newText){
    readyPosts.value=false

    keyWordFilter.value = newText === 'keyword'; //BOOL
    if (!keyWordFilter.value){
      if (destFilter.value === 'Filter') query += `&destType=${newText}`;
      else query = query.replace(`&destType=${destFilter.value}`, `&destType=${newText}`)
      destFilter.value = newText
    }
      //GESTIRE IL CASO DELLA KEYWORD

    destFilter.value = newText;

    curPosts = (await getPosts(query,0))
    readyPosts.value=true
  }

  async function updatePost(){
    offset.value += 12;
    curPosts.push(...(await getPosts(query,offset.value)));
  }

  let scrollendHandler = async () => await(updatePost())

    onMounted(async ()=> {
    readyPosts.value = false
    query = `name=${currentVip.value}`
    window.addEventListener("scrollend", scrollendHandler);

    store.commit('setQuota', await getUserQuota())

    curPosts.push(...(await getPosts(query, 0)));
    readyPosts.value = true
  })

  onUnmounted(() => {
    window.removeEventListener("scrollend",scrollendHandler);
    offset.value = 0;
  })


</script>

<template>
  <div id="bodyDiv" class="centralDiv">
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
          <p class="m-0 fs-3 text-center">{{ currentVip }}</p>
        </div>
        <div>
          <p class="m-0">Quota rimanente:</p>
            <p>{{[store.getters.getQuota.daily,store.getters.getQuota.weekly,store.getters.getQuota.monthly].join('/')}}</p>
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
      <div id="postContainer" v-if="readyPosts" class="d-flex flex-row flex-wrap justify-content-around mt-3">
        <Post v-for="(post,i) in curPosts" :key="post._id"
              :user="post.owner"
              :dest= "post.destination.destType === 'channel'? `§${post.destination.name}`:`@${post.destination.name}`"
              :content="post.content"
              :creationDate="post.dateOfCreation"
              :reactions = "post.reactions"
              :contentType = "post.contentType"
              :destType = "post.destination.destType"
              :postId = "post._id"
              :numberOfPost="i"
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