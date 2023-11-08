<script setup>
import {computed, onUpdated, ref} from "vue";
  import {currentVip} from "../utilsSMM";
  import {useStore} from "vuex";
  import Map from "../components/post/Map.vue";
import Dropdown from "../components/Dropdown.vue";

  const store = useStore();

  const infoTimed = `Squeal syntax:<br>{NUM} to get the number of squeal post<br>{TIME} to get time of squeal post<br>{DATE} to get date of squeal post`

console.log(infoTimed)

  /* TYPE and USER/CHANNEL */
  const postType = ref('Select type')
  const destType = ref('receiver')
  const receiverName = ref('')

  /* TIMED MESSAGE */
  const timed = ref(false);
  const numberOfRepetitions = ref(0);
  const typeFrequency = ref('select Frequency')

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
  const quota2remove = computed(() => (postType.value === 'text' ? textSqueal.value.length : postType.value === 'Select type' ? 0 : 125)
      * (timed.value && numberOfRepetitions.value > 2 ? parseInt(numberOfRepetitions.value) : 1)
  );
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


  async function createPost() {
    try{

      /* #, to create channel by hashtag */
      /*
      let tags = [];
      if (postType.value === 'text'){
        tags = textSqueal.value.match(/\#\w+/g)
      }
       */

      let post = {
        name: currentVip.value,
        contentType: postType.value,
        dateOfCreation: Date.now(),
        receiver: receiverName.value,
        destType: destType.value,
      }

      const toBase64 = file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      })


      /* content based on squeal type */
      let content = postType.value === 'geolocation' ? JSON.stringify(mapLocationLatLng.value.value) :
                      postType.value === 'text' ? textSqueal.value :
                        fileUploaded.value.length === 0 ? imgPath.value :
                            await toBase64(fileUploaded.value[0]);

      post = {...post, content: content};

      console.log(post);

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
      alert(err)
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
    currentImgPath.value = URL.createObjectURL(fileUploaded.value[0]);
    showImg.value = true
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
                  <div class="d-flex flex-row align-items-end" style="flex:1">
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
                  <div class="d-flex justify-content-center" style="flex:1">
                    <input type="checkbox" class="btn-check" id="btn-check-outlined" v-model="timed" autocomplete="off">
                    <label class="btn btn-outline-primary" for="btn-check-outlined">Timed</label><br>
                  </div>

                  <div class="btn-group d-flex" style="flex:1">
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
                      <img class="img-fluid object-fit-contain" :src="currentImgPath" alt="Path non trovato">
                    </div>
                  </div>
                  <Map v-if="postType === 'geolocation'"
                       class="map"
                       :currentlatlng="mapLocationLatLng"
                  />
                </div>
                <div :class="getLiveDQuota < 0 || getLiveWQuota < 0 ? 'justify-content-evenly':'justify-content-center'" class="d-flex flex-row">
                  <h6 v-if="getLiveDQuota < 0">extra daily quota: {{-getLiveDQuota}}</h6>
                  <h6 v-if="getLiveWQuota < 0">extra weekly quota: {{-getLiveWQuota}}</h6>
                  <div class="d-flex flex-row">
                    <h6 :class="getLiveDQuota < 0 ? 'text-danger':''">{{getLiveDQuota}}</h6>
                    <h6 :class="getLiveWQuota < 0 ? 'text-danger':''">/{{getLiveWQuota}}</h6>
                    <h6 :class="getLiveMQuota < 0 ? 'text-danger':''">/{{getLiveMQuota}}</h6>
                  </div>
                </div>
                <div class="d-flex flex-row justify-content-between">
                  <div v-if="timed" class="d-flex flex-row flex-fill">
                    <div class="d-flex flex-column">
                      <label for="numTimed" class="form-label">Squeal Number</label>
                      <input type="number" class="form-control" id="numTimed" v-model="numberOfRepetitions">
                    </div>
                    <div class="d-flex flex-column ms-2">
                      <label for="repFrequency" class="form-label">Frequency</label>
                      <div class="input-group" id="repFrequency">
                        <input type="number" class="form-control" id="numFrequency">
                        <Dropdown :filterRef="typeFrequency"
                                  updateRef="updateTypeF"
                                  @updateTypeF="(el) => typeFrequency=el"
                                  :dropItems="['minutes', 'days', 'weeks']"
                                  classButton="btn-outline-secondary"
                        />
                      </div>
                    </div>
                    <div class="d-flex ms-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16" v-tooltip="infoTimed">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="d-flex flex-row justify-content-end flex-fill align-items-end">
                    <button type="button" class="btn btn-danger m-1"
                            @click="$emit('closeAppModal'); reset()"
                    >back</button>
                    <button class="btn btn-primary m-1" type="button" @click="createPost(); reset(); $emit('closeAppModal')"> add Squeal </button>
                  </div>
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

  #imgAddPost{
    padding: 2%;
    border: 10px;
    max-height: 55vh;
  }

</style>
