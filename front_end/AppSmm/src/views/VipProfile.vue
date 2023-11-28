<script setup>
  import {onMounted, onUnmounted, reactive, ref} from "vue";
  import {currentVip, filterValues, postType, smartPhone, sortPosts} from "../utils/config.js"
  import {getPosts, getUserInfo, getUserQuota, parseDestinations} from "../utils/functions.js";
  import Post from "../components/post/Post.vue";
  import Dropdown from "../components/Dropdown.vue";
  import {useStore} from "vuex";

  const store = useStore();

  const readyPosts = ref(false);

  const profilePicturePath ="/img/profilePicture.png";

  const keyWordFilter = ref(false);
  const destFilter = ref('Filter');
  const typePostFilter = ref('Type');
  const sortFilter = ref('Sort');
  const offset = ref(0);

  const follower= ref(0);
  const n_post = ref(0);

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

      n_post.value = (await getUserInfo()).nposts;

      window.addEventListener("scrollend", scrollendHandler);

      let quota = await getUserQuota();

      store.commit('setQuota', quota.characters);

      query = `name=${currentVip.value}`

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
          <img :src= "profilePicturePath" alt="pippo" class="img-fluid rounded-circle" />
        </div>
      </div>

    <h2 class="m-0 text-center fw-bold">{{'@'+currentVip }}</h2>
    <h6 class="mt-1 text-center mb-0">{{[store.getters.getQuota.daily,store.getters.getQuota.weekly,store.getters.getQuota.monthly].join(' | ')}}</h6>
     <p class="m-0 text-center mt-1 mb-0">{{n_post}} Squeal </p>

      <div class="d-flex flex-column align-items-start">
        <div class="d-flex flex-row justify-content-around align-items-center">
          <Dropdown class="buttonDropDown"
                    :filterRef="destFilter"
                    :dropItems="filterValues"
                    classButton="btn btn-secondary"
                    updateRef = 'updateDestFilter'
                    @updateDestFilter = updateDestFilter
          />
          <Dropdown class="ms-1 buttonDropDown"
                    classButton="btn btn-secondary"
                    :filterRef="typePostFilter"
                    :dropItems="postType"
                    updateRef = 'updatePostType'
                    @updatePostType = updatePostType
          />
          <Dropdown  class="ms-1 buttonDropDown"
                     classButton="btn btn-secondary"
                     :filterRef="sortFilter"
                     :dropItems="sortPosts"
                     updateRef = 'updateSort'
                     @updateSort = updateSortFilter
          />
          <div v-if="keyWordFilter && !smartPhone" class="ms-1">
            <input type="text" placeholder="Keyword..." />
          </div>
        </div>
        <div v-if="smartPhone && keyWordFilter" class="ms-1">
          <input type="text" placeholder="BOH..." />
        </div>
      </div>
      <div id="postContainer" v-if="readyPosts" class="d-flex flex-row flex-wrap justify-content-around mt-3">
        <Post v-for="(post,i) in curPosts" :key="post._id"
              :user="post.owner"
              :dest= "parseDestinations(post.destinationArray)"
              :content="post.content"
              :creationDate="post.dateOfCreation"
              :reactions = "post.reactions"
              :contentType = "post.contentType"
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
    max-height: 30vh;
  }

  @media screen and (max-width: 768px) {

    .profileDim{
      max-height: 15vh;
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