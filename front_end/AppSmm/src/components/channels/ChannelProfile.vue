<script setup>
  import {computed, onMounted, onUnmounted, ref} from "vue";
  import Post from "../post/Post.vue";
  import Select from "../Select.vue";
  import {postType, postTypeITAS, sortPosts} from "../../utils/config.js";
  import {getPosts, parseDestinationsViewPost} from "../../utils/functions.js";
  import {useStore} from "vuex";
  import Spinner from "../Spinner.vue";
  import PermissionHandler from "./PermissionHandler.vue";
  import AddAdminHandler from "./AddAdminHandler.vue";
  import DeleteAdminHandler from "./DeleteAdminHandler.vue";
  import RequestHandler from "./RequestHandler.vue";

  const store = useStore();

  const typePostFilter = ref('Type');
  const sortFilter = ref('Sort');
  const readyPosts = ref(false);

  const squeals = computed(()=> store.getters.getSqueal);
  const offset = computed(() => store.getters.getOffset);
  const vip = computed(() => store.getters.getVip);

  const channel = ref({});
  const readyChannel = ref(false);

  const permissionModal = ref();
  const addAdminModal = ref();
  const deleteAdminModal = ref();
  const requestModal = ref();

  let query = ''

  let lastRequestLength = 12;

  const updateAfterInsert = (admin) => {
    let adminInfo = channel.value.followers.find(foll => foll.user === admin);
    channel.value.admins.push({
      name: adminInfo.user,
      profilePic: adminInfo.profilePic,
    });
    channel.value.followers.splice(channel.value.followers.map(follower => follower.user).indexOf(admin.name),1);
  }
  const updateAfterDelete = admin => {
    channel.value.followers.push({user: admin.name, canWrite: true, profilePic: admin.profilePic});
    channel.value.admins.splice(channel.value.admins.map(admin => admin.name).indexOf(admin.name),1);
  }
  const updateRequests = (user,accepted) => {
    channel.value.requests.splice(channel.value.requests.map(req => req.user).indexOf(user.user),1);
    if(accepted) channel.value.followers.push({user:user.user, canWrite: true, profilePic: user.profilePic});
  }

  async function updateSortFilter(newText){
    readyPosts.value=false

    if (sortFilter.value === 'Sort') query += `&sort=${newText}`;
    else query = query.replace(`&sort=${sortFilter.value}`, `&sort=${newText}`)

    sortFilter.value = newText

    store.commit('clearSqueal');
    store.commit('pushSqueal', await getPosts(query,0) )
    readyPosts.value=true
  }
  async function updatePostType(newText){
    readyPosts.value=false

    if (typePostFilter.value === 'Type') query += `&typeFilter=${newText}`;
    else query = query.replace(`&typeFilter=${typePostFilter.value}`, `&typeFilter=${newText}`)

    typePostFilter.value=newText

    store.commit('clearSqueal');
    store.commit('pushSqueal', await getPosts(query,0))
    readyPosts.value=true
 }

  async function updatePost(){
    store.commit('updateOffset');
    let posts = await getPosts(query,offset.value);
    store.commit('pushSqueal', posts);
    return posts.length;
  }

  const scrollEndDetector = async () => {
    if (window.innerHeight + window.pageYOffset >= document.getElementById("bodyDivChannel").offsetHeight && lastRequestLength >= 12) {
      lastRequestLength = await(updatePost());
    }
  }

  onMounted(async ()=>{
    document.addEventListener('scroll', scrollEndDetector, true);
    readyPosts.value=false;
    readyChannel.value = false;
    let name = window.location.pathname.split("/").pop();

    let res = await fetch(`/db/channel/${name}`,{
      method:'GET'
    });
    channel.value = await res.json();;
    readyChannel.value = true;
    query =`name=${vip.value.name}&channel=${name}&smm=${true}&limit=12`;

    store.commit('clearSqueal');
    store.commit('pushSqueal',(await getPosts(query, 0)));

    readyPosts.value=true
  })

  onUnmounted(() => {
    store.commit('clearSqueal');
    document.removeEventListener('scroll', scrollEndDetector, true);
  })

</script>

<template>
  <div id="bodyDivChannel" class="centralDiv">
    <div v-if="readyChannel" class="marginCD">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-center w-100">
          <div class="maxWidth">
            <img :src="channel.profilePicture" class="img-fluid rounded-circle" alt="gatto che ormai ha stufato">
          </div>
        </div>
        <h2 class="m-1 text-center">{{ channel.name }}</h2>
        <h5 class="m-1 text-center">{{ channel.description }}</h5>
        <div class="w-50 d-flex flex-row  align-self-center  justify-content-center">
          <div class="text-center bordEl" >
            <span v-if="channel.creator === vip.name" class="badge rounded-pill text-bg-primary"> creatore </span>
            <span v-else-if="channel.admins.map(admin => admin.name).includes(vip.name)" class="badge rounded-pill text-bg-warning"> admin </span>
          </div>
          <div class="text-center bordEl ">
            <span v-if="channel.type === 'public'" class="badge rounded-pill text-bg-success"> pubblico </span>
            <span v-else class="badge rounded-pill text-bg-danger"> privato </span>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column flex-lg-row justify-content-between align-items-center align-items-lg-end">
        <div class="d-flex flex-row flex-wrap justify-content-around gap-2 mt-2">
          <button type="button" class="btn btn-primary" @click="permissionModal.openModal">Permessi</button>
          <button v-if="channel.type === 'private'" type="button"  class="btn btn-primary ms-2" @click="requestModal.openModal">Richieste</button>
          <button v-if="channel.creator === vip.name" type="button" class="btn btn-primary ms-2" @click="addAdminModal.openModal">Aggiungi admin</button>
          <button v-if="channel.creator === vip.name" type="button" class="btn btn-primary ms-2" @click="deleteAdminModal.openModal">Rimuovi admin</button>
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
      </div>
      <div v-if="readyPosts" class="d-flex flex-row flex-wrap justify-content-around mt-3">
        <Post v-for="(post,i) in squeals" :key="post._id"
              :post="post"
              :dest= "parseDestinationsViewPost(post.destinationArray, post.officialChannelsArray, post.tags)"
              :numberOfPost="i"
              picProfile = "/img/defaultUser.jpeg"
        />
      </div>
    </div>
    <Spinner v-else />
  </div>
  <RequestHandler ref="requestModal" :chname="channel.name" :requests="channel.requests" @updateFollowers="(user,accepted) => updateRequests(user,accepted)" />
  <DeleteAdminHandler ref="deleteAdminModal" :chname="channel.name" :admins="channel.admins" @updateAdmin="admin => updateAfterDelete(admin)"/>
  <AddAdminHandler ref="addAdminModal" :followers="channel.followers" :chname="channel.name" @updateAdmin="admin => updateAfterInsert(admin)" />
  <PermissionHandler ref="permissionModal" :followers="channel.followers" :chname="channel.name" />
</template>

<style scoped>
  .maxWidth{
    max-width:  20vh;
  }
  @media screen and (max-width: 768px){
    .btn{
      width: 10rem !important;
    }
  }
</style>