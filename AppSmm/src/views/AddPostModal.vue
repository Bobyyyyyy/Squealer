<script setup>
import {computed, onBeforeUpdate, onMounted, ref} from "vue";
  import {currentVip} from "../utilsSMM";
  import {useStore} from "vuex";
import Map from "../components/Map.vue";

  const store = useStore();
  const postType = ref('Select type')
  const destType = ref('receiver')
  const receiverName = ref('')
  const imgUrl = ref('')
  const currentImg = ref('')
  const showImg = ref(false)
  const textSqueal = ref('')

  const quota2remove = computed(() => postType.value ==='text' ? textSqueal.value.length : postType.value ==='Select type' ? 0 : 15);
  /* 15 è il valore tolto per immagine e geolocalizzazione */
  const getLiveDQuota = computed(()=> (store.getters.getQuota.daily - ((destType.value !== 'user') ? quota2remove.value : 0)));
  const getLiveWQuota = computed(()=> (store.getters.getQuota.weekly - ((destType.value !== 'user') ? quota2remove.value : 0)));
  const getLiveMQuota = computed(()=> (store.getters.getQuota.monthly - ((destType.value !== 'user') ? quota2remove.value : 0)));

  async function createPost() {
    try{
      let cnt = postType.value === 'image' ? imgUrl.value : textSqueal.value;

      let post = {
        name: currentVip.value,
        contentType: postType.value,
        content: cnt,
        dateOfCreation: Date.now(),
        receiver: receiverName.value,
        destType: destType.value,
      }

      let res = await fetch("/db/addPost",{
        method: "POST",
        body: JSON.stringify({
          post: post,
          quota: {
            daily: getLiveDQuota.value < 0 ? 0 : getLiveDQuota.value,
            weekly: getLiveWQuota.value - (getLiveDQuota.value < 0 ? -getLiveDQuota.value : 0),
            monthly: getLiveMQuota.value - (getLiveWQuota.value < 0 ? -getLiveWQuota.value : 0),
          }
        }),
        headers: {
          "Content-Type":"application/json"
        }
      })
      let response = await res.json()
      if(response.statusCode === 422){
        throw response;
      }
    }
    catch (err){
      alert(err.mes)
    }
  }

  function reset(){
    postType.value ='Select type'
    destType.value = 'receiver'
    receiverName.value = ''
    imgUrl.value = ''
    currentImg.value= ''
    showImg.value = false
    textSqueal.value = ''
  }

</script>

<template>
  <div class="modal fade  w-100 h-100" id="AddPostModal"  tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-center">
            <h4 class="mb-0 text-center">Add Squeal</h4>
          </div>
          <div class="modal-body">
            <form id="addPostForm">
              <div class="d-flex flex-column">
                <div class="d-flex flex-row justify-content-between align-items-end">
                  <div class="d-flex flex-row align-items-end">
                    <div class="d-flex flex-column">
                      <label for="destPost" class="form-label">Receiver</label>
                      <input type="text" class="form-control" id="destPost"  v-model="receiverName" required>
                    </div>

                    <div class="btn-group">
                      <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        {{ destType }}
                      </button>
                      <ul class="dropdown-menu">
                        <li class="dropdown-item" role="button" @click="destType = 'channel'"> channel </li>
                        <li class="dropdown-item" role="button" @click="destType = 'user'"> user </li>
                      </ul>
                    </div>
                  </div>
                  <div class="btn-group">
                    <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      {{ postType }}
                    </button>
                    <ul class="dropdown-menu">
                      <li class="dropdown-item" role="button" @click="postType = 'text'"> text </li>
                      <li class="dropdown-item" role="button" @click="postType = 'geolocation'"> geolocation </li>
                      <li class="dropdown-item" role="button" @click="postType = 'image'"> image </li>
                    </ul>
                  </div>
                </div>
                <div class="m-1">
                  <textarea v-if=" postType==='text'" rows="6" v-model="textSqueal"  class="form-control"></textarea>

                  <div v-if="postType === 'image'"  class="d-flex flex-column">
                    <div class="input-group d-flex flex-row">
                      <input class="w-75" type="text" placeholder="insert URL" id="pathImg" v-model="imgUrl" >
                      <button type="button" class="btn btn-secondary" @click=" currentImg = imgUrl; showImg = true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                        </svg>
                      </button>
                    </div>

                    <div v-if="showImg" id="imgAddPost" class=" d-flex flex-row align-self-center w-75">
                      <img class="img-fluid" :src="currentImg" alt="NON FUNZIONA UN CAZZO">
                    </div>
                  </div>
                  <Map v-if="postType === 'geolocation'"
                       class="map"
                  />
                </div>
                <div :class="getLiveDQuota < 0 ? 'justify-content-evenly':'justify-content-center'" class="d-flex flex-row w-100 ms-3 me-3">
                  <h6 v-if="getLiveDQuota < 0">extra daily quota: {{-getLiveDQuota}}</h6>
                  <h6 v-if="getLiveWQuota < 0">extra weekly quota: {{-getLiveWQuota}}</h6>
                  <div class="d-flex flex-row">
                    <h6 :class="getLiveDQuota < 0 ? 'text-danger':''">{{getLiveDQuota}}</h6>
                    <h6 :class="getLiveWQuota < 0 ? 'text-danger':''">/{{getLiveWQuota}}</h6>
                    <h6 :class="getLiveMQuota < 0 ? 'text-danger':''">/{{getLiveMQuota}}</h6>
                  </div>
                </div>
                <div class="d-flex flex-row justify-content-end">
                  <button type="button" class="btn btn-danger m-1"
                          @click="$emit('closeAppModal'); reset()"
                  >back</button>
                  <button class="btn btn-primary m-1" type="button" @click="createPost(); reset(); $emit('closeAppModal')"> add Squeal </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>
  #imgAddPost{
    padding: 2%;
    border: 10px;
  }

  #AddPostModal{
    height: 50%;
    width: 50%;
  }

  .modal-dialog-centered{
    max-width: 60%;
  }

  .map{
    min-height: 60vh;
  }

</style>