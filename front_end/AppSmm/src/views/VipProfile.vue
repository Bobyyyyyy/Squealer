<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
  import {
    filterValues,
    filterValuesITAS,
    postType,
    postTypeITAS,
    smartPhone,
    sortPosts
  } from "../utils/config.js"
  import {getPosts, getUserInfo, getUserQuota, parseDestinationsViewPost} from "../utils/functions.js";
  import Post from "../components/post/Post.vue";
  import Select from "../components/Select.vue";
  import {useStore} from "vuex";

  const store = useStore();

  const readyPosts = ref(false);

  const keyWordFilter = ref(false);
  const destFilter = ref('Filter');
  const typePostFilter = ref('Type');
  const keyWord = ref('');
  const sortFilter = ref('Sort');

  const follower= ref(0);
  const n_post = ref(0);

  const squeals = computed(()=> store.getters.getSqueal);
  const offset = computed(() => store.getters.getOffset);
  const vip = computed(() => store.getters.getVip);


  let query = ''

  let lastRequestLength = 12;

  async function updatePostType(newText){
    readyPosts.value=false

    if (typePostFilter.value === 'Type') query += `&typeFilter=${newText}`;
    else query = query.replace(`&typeFilter=${typePostFilter.value}`, `&typeFilter=${newText}`)

    typePostFilter.value=newText

    store.commit('clearSqueal');
    lastRequestLength = 12
    store.commit('pushSqueal', await getPosts(query,0) )
    readyPosts.value=true
  }
  async function updateSortFilter(newText){
    readyPosts.value=false

    if (sortFilter.value === 'Sort') query += `&sort=${newText}`;
    else query = query.replace(`&sort=${sortFilter.value}`, `&sort=${newText}`)

    sortFilter.value = newText
    store.commit('clearSqueal');
    lastRequestLength = 12
    store.commit('pushSqueal', await getPosts(query,0) )
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

    destFilter.value = newText;
    store.commit('clearSqueal');
    lastRequestLength = 12
    store.commit('pushSqueal', await getPosts(query,0) )
    readyPosts.value=true
  }

  async function updatePost(){
    store.commit('updateOffset');
    let posts = await getPosts(query,offset.value);
    store.commit('pushSqueal', posts);
    return posts.length;
  }

  async function updateTagPosts(){
    store.commit('clearSqueal');
    store.commit('pushSqueal', await getPosts(`${query}&keyword=${keyWord.value}`, offset.value));
  }


  const scrollEndDetector = async () => {
    if (window.innerHeight + window.pageYOffset >= document.getElementById("postContainer").offsetHeight && lastRequestLength >= 12) {
      lastRequestLength = await(updatePost());
    }
  }


  onMounted(async ()=> {
    readyPosts.value = false

    store.commit('clearSqueal');

    n_post.value = (await getUserInfo(vip.value.name)).nposts;

    document.addEventListener('scroll', scrollEndDetector, true);

    let quota = await getUserQuota(vip.value.name);

    store.commit('setQuota', quota.characters);
    store.commit('setMaxQuota',quota.maxQuota);

    query = `name=${vip.value.name}&limit=12`

    store.commit('pushSqueal',(await getPosts(query, 0)));

    readyPosts.value = true
  })

  onUnmounted(() => {
    store.commit('clearSqueal');
    document.removeEventListener('scroll', scrollEndDetector, true);
  })

</script>

<template>
  <div id="bodyDiv" class="centralDiv">
    <div class="marginCD">
      <div class="d-flex flex-row justify-content-center  profileDim">
        <div class="aspect-ratio object-fit-fill profileDim">
          <img :src= "vip.profilePic" alt="pippo" class="img-fluid rounded-circle" />
        </div>
      </div>

    <h2 class="m-0 text-center text-white fw-bolder">{{'@'+ vip.name }}</h2>
    <h6 class="mt-1 text-center text-white fw-bold mb-0">{{[store.getters.getQuota.daily,store.getters.getQuota.weekly,store.getters.getQuota.monthly].join(' | ')}}</h6>
     <p class="m-0 text-center text-white mt-1 mb-0">{{n_post}} Squeal </p>

      <div class="d-flex flex-column align-items-center">
        <div class="d-flex flex-row justify-content-around align-items-end flex-wrap w-100">
          <div class="d-flex flex-row justify-content-center" style="flex: 1 1 0">
            <Select class="buttonDropDown"
                    :dropItems="filterValues"
                    :dropItemsName="filterValuesITAS"
                    classButton="btn btn-secondary"
                    updateRef = 'updateDestFilter'
                    label="destinazione"
                    def="all"
                    @updateDestFilter = updateDestFilter
            />
          </div>
          <div class="d-flex flex-row justify-content-center" style="flex: 1 1 0">
            <Select class="ms-1 buttonDropDown"
                    classButton="btn btn-secondary"
                    :dropItems="postType"
                    :dropItemsName="postTypeITAS"
                    updateRef = 'updatePostType'
                    label= 'contenuto'
                    def = 'all'
                    @updatePostType = updatePostType
            />
          </div>
          <div class="d-flex flex-row justify-content-center" style="flex: 1 1 0">
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
          <div v-if="keyWordFilter && !smartPhone" class="input-group ms-3 keyword-dim">
            <input type="text" class="form-control" placeholder="Keyword..." aria-label="Keyword's search" v-model="keyWord" @keyup.enter="updateTagPosts">
            <button class="btn btn-secondary" type="button" @click="updateTagPosts">Cerca</button>
          </div>
        </div>
        <div v-if="keyWordFilter && smartPhone" class="input-group">
          <input type="text" class="form-control" placeholder="Keyword..." aria-label="Keyword's search" >
          <button class="btn btn-secondary" type="button" @click="updateTagPosts">Cerca</button>
        </div>
      </div>
      <div id="postContainer" v-if="readyPosts" class="mt-3 d-flex flex-column align-items-center">
          <Post v-for="(post,i) in squeals" :key="post._id"
              :post="post"
              :dest= "parseDestinationsViewPost(post.destinationArray, post.officialChannelsArray)"
              :numberOfPost="i"
              :picProfile = "post.profilePicture"
          />
      </div>
    </div>
  </div>
</template>

<style>

  .profileDim{
    max-height: 30vh;
  }
  .keyword-dim{
    width: 30rem;
    max-width: 40rem;
  }

  @media screen and (max-width: 768px) {

    .keyword-dim{
      width: 100%;
    }

    .profileDim{
      max-height: 15vh;
    }

    .buttonDropDown{
      align-self: end;
      margin-bottom: 2%;
      min-width: 8rem;
    }
    #postContainer{
      padding-bottom: 4rem;
    }
  }

  .aspect-ratio{
    aspect-ratio: 1;
  }

</style>