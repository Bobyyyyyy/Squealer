<script setup>
import {computed, onUpdated, ref} from "vue";
  import {currentVip} from "../utilsSMM";
  import {useStore} from "vuex";
  import Map from "../components/post/Map.vue";

  const store = useStore();

  /* TYPE and USER/CHANNEL */
  const postType = ref('Select type')
  const destType = ref('receiver')
  const receiverName = ref('')

  /* TEXT */
  const textSqueal = ref('')          //get text of squeal. Only in text squeal.

  /* IMAGE */
  const imgPath = ref('')             //live change of input value in URL insert.
  const currentImgPath = ref('')      //to show last image from URL
  const showImg = ref(false)          //show preview photo of inserted URL
  const fileUploaded = ref({});       //get info of file uploaded (NOT URL).
  const canUploadFile = computed(() => imgPath.value === '' || currentImgPath.value === '');

  /* MAP */
  const mapLocationLatLng = ref({});  //get [lat,lon] of current position.

  /* QUOTA */
  const quota2remove = computed(() => postType.value ==='text' ? textSqueal.value.length : postType.value ==='Select type' ? 0 : 15);
  /* 15 è il valore tolto per immagine e geolocalizzazione */
  const getLiveDQuota = computed(()=> (store.getters.getQuota.daily - ((destType.value !== 'user') ? quota2remove.value : 0)));
  const getLiveWQuota = computed(()=> (store.getters.getQuota.weekly - ((destType.value !== 'user') ? quota2remove.value : 0)));
  const getLiveMQuota = computed(()=> (store.getters.getQuota.monthly - ((destType.value !== 'user') ? quota2remove.value : 0)));

/*
  async function getCamera(){
    navigator?.mediaDevices.getUserMedia({video: true})
        .then((success) => {
          console.log(success);
        })
  }

 */

  function file2BLOB(file){
    return new Blob([file],{type: file.type});
  }


  async function createPost() {
    try{
      let cnt = postType.value === 'geolocation' ? JSON.stringify(mapLocationLatLng.value.value) :
                  postType.value === 'text' ? textSqueal.value :
                      Object.keys(fileUploaded).length === 0 ? imgPath.value :
                          file2BLOB(fileUploaded.value[0]);

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
    imgPath.value = ''
    currentImgPath.value= ''
    showImg.value = false
    textSqueal.value = ''
    fileUploaded.value = {}
  }

  function showPreviewUploaded(event) {
    fileUploaded.value = event.target.files;
    let blob = file2BLOB(fileUploaded.value[0]);
    currentImgPath.value = URL.createObjectURL(blob);
    showImg.value = true
    console.log(fileUploaded.value[0]);
  }
/*
  onUpdated(()=> {
    if (postType.value === 'image') getCamera()
  })
 */
</script>

<template>
  <div class="modal fade  w-100 h-100 overflow-hidden" id="AddPostModal"  tabindex="-1" aria-hidden="true">
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
                    <div class="d-flex flex-row justify-content-between flex-wrap">
                      <div class="d-flex flex-column">
                        <label for="pathImgForm" class="form-label">Insert photo URL</label>
                        <div class="input-group d-flex flex-row">
                          <input :disabled="Object.keys(fileUploaded).length !== 0"  type="text" placeholder="insert URL" id="pathImgForm" v-model="imgPath" >
                          <button :disabled="Object.keys(fileUploaded).length !== 0" type="button" class="btn btn-secondary" @click=" currentImgPath = imgPath; showImg = true">
                            Preview
                          </button>
                        </div>
                      </div>
                      <div>
                        <p class="m-0"> or </p>
                      </div>
                      <div>
                        <label  for="formFile" class="form-label">upload Photo</label>
                        <input :disabled="!canUploadFile" class="form-control" type="file" id="formFile" accept="image/png, image/jpeg"
                               @change="(event) => showPreviewUploaded(event)">
                      </div>
                    </div>
                    <div v-if="showImg" id="imgAddPost" class=" d-flex flex-row justify-content-center">
                      <img class="img-fluid" :src="currentImgPath" alt="Path non trovato">
                    </div>
                  </div>
                  <Map v-if="postType === 'geolocation'"
                       class="map"
                       :currentlatlng="mapLocationLatLng"
                  />
                </div>
                <div :class="getLiveDQuota < 0 || getLiveWQuota < 0 ? 'justify-content-evenly':'justify-content-center'" class="d-flex flex-row w-100 ms-3 me-3">
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
    max-height: 55vh;
  }

  #AddPostModal{
    height: 50%;
    width: 50%;
  }

  .modal-dialog-centered{
    max-width: 60%;
  }

  .map {
    min-height: 60vh;
  }
</style>
