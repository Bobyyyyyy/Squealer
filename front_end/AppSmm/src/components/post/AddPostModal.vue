<script setup>
  import {computed, ref} from "vue";
  import Map from "./Map.vue";
  import {blob2base64, compressBlob, setupBeep} from "../../utils/functions.js";
  import {currentVip, URLHTTPREGEX} from "../../utils/config.js";
  import {useStore} from "vuex";
  import Select from "../Select.vue";

  const store = useStore();

  const infoTimed = `sintassi Squeal:<br>{NUM} per avere il numero corrente dello squeal<br>{TIME} per avere il tempo di pubblicazione dello squeal<br>{DATE} per avere la data di pubblicazione dello squeal`

  /* TYPE and USER/CHANNEL */
  const postType = ref('Select type')
  const receivers = ref('')
  const receiverArr = computed(()=> receivers.value.replaceAll(" ","").split(','))
  const inChannel = computed(()=> {
    return !!receiverArr.value.find(el => el.startsWith('§'));
  });

  /* TIMED MESSAGE */
  const timed = ref(false);
  const numberOfRepetitions = ref(0);
  const typeFrequency = ref('select Frequency')
  const numFrequency = ref(0);

  /* TEXT */
  const textSqueal = ref('')          //get text of squeal. Only in text squeal.
  const link = computed(() => textSqueal.value.match(URLHTTPREGEX) );
  const linkShorter = ref('');
  const activeChoiceLink = ref(true)

  /* IMAGE */
  const imgPath = ref('')             //live change of input value in URL insert.
  const currentImgPath = ref('')      //to show last image from URL
  const showImg = ref(false)          //show preview photo of inserted URL
  const fileUploaded = ref({});       //get info of file uploaded (NOT URL).
  const canUploadFile = computed(() => imgPath.value === '' || currentImgPath.value === '');

  /* VIDEO */
  const videoPath = ref('');
  const currentVideoPath = ref('');
  const showVideo = ref(false);
  function getEmbed(url) {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    } else {
      return 'error';
    }
  }
  const youtubePath = computed(() => `//www.youtube.com/embed/${getEmbed(currentVideoPath.value)}`)

  /* MAP */
  const mapLocationLatLng = ref({});  //get [lat,lon] of current position.

  /* QUOTA */
  const quota2remove = computed(() => (postType.value === 'text' ? textSqueal.value.length : postType.value === 'Select type' ? 0 : 125)
      * (timed.value && numberOfRepetitions.value > 2 ? parseInt(numberOfRepetitions.value) : 1)
  );
  /* 15 è il valore tolto per immagine e geolocalizzazione */
  const getLiveDQuota = computed(()=> (store.getters.getQuota.daily - (inChannel.value ? quota2remove.value : 0)));
  const getLiveWQuota = computed(()=> (store.getters.getQuota.weekly - (inChannel.value ? quota2remove.value : 0)));
  const getLiveMQuota = computed(()=> (store.getters.getQuota.monthly - (inChannel.value ? quota2remove.value : 0)));


  function parseDestinations(){
    let dest = [];
    let tags = []
    receiverArr.value.forEach(receiver => {
      if(receiver.startsWith('#')){
        tags.push(receiver.substring(1));
      }
      else{
        dest.push({
          name: receiver.substring(1),
          destType: receiver.startsWith('§') ? 'channel' : receiver.startsWith('@') ? 'user' : 'errore',
        })
      }

    })
    return [dest, tags];
  }

  async function createPost() {
    try{

      let tags = [];

      if (postType.value === 'text'){
        tags = textSqueal.value.match(/\#\w+/g)
        if (tags) tags = tags.map(el => el.substring(1));
      }

      let [tmpDest, tmpTags] = parseDestinations(receiverArr.value);
      if (tmpTags.length > 0 ) tags = tags.concat(tmpTags);
      //remove duplicates
      if(tags.length > 0) tags = tags.filter((tag,index) => tags.indexOf(tag) === index);

      let post = {
        creator: currentVip.value,
        contentType: postType.value,
        dateOfCreation: Date.now(),
        destinations: tmpDest,
        timed: timed.value,
        ... (timed) && {
          squealNumber: numberOfRepetitions.value,
          frequency: [numFrequency.value.toString(),typeFrequency.value].join(' ')
        },
        ...(tags !== []) && {tags: tags}
      }

      /* content based on squeal type */
      let content = postType.value === 'geolocation' ? JSON.stringify(mapLocationLatLng.value.value) :
                      postType.value === 'text' ? textSqueal.value :
                          postType.value === 'video' ? youtubePath.value :
                            fileUploaded.value.length === 0 ? currentImgPath.value :
                              await blob2base64(await compressBlob(fileUploaded.value.item(0)));

      post = {...post, content: content};


      let res = await fetch("/db/post",{
        method: "POST",
        body: JSON.stringify({
          post: post,
          quota: {
            daily: getLiveDQuota.value < 0 ? 0 : getLiveDQuota.value,
            weekly: getLiveWQuota.value - (getLiveDQuota.value < 0 ? - getLiveDQuota.value : 0),
            monthly: getLiveMQuota.value - (getLiveWQuota.value < 0 ? - getLiveWQuota.value : 0),
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
      else if(timed.value){
        setupBeep(numberOfRepetitions.value,numFrequency.value,typeFrequency.value);
      }
    }

    catch (err){
      alert(err)
    }
  }

  function reset(){
    postType.value ='Select type'
    receivers.value = ''
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

  async function insertShorter() {
    let oldLink = link.value[0];
    let res = await fetch(`https://csclub.uwaterloo.ca/~phthakka/1pt/addURL.php?url=${oldLink}`);
    linkShorter.value = `https://1pt.co/${(await res.json()).short}`
    textSqueal.value = textSqueal.value.replace(oldLink,linkShorter.value);
  }

</script>

<template>
  <div class="modal fade  w-100 h-100 overflow-hidden" id="AddPostModal"  tabindex="-1" aria-hidden="true">
    <div class="centralDiv z-1">
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-center">
            <h4 class="mb-0 text-center">Crea Squeal</h4>
          </div>
          <div class="modal-body">
            <form id="addPostForm" >
              <div class="d-flex flex-column">
                <div class="d-flex flex-row justify-content-between align-items-end">
                  <div class="d-flex flex-row align-items-end" style="flex:1">
                    <div class="d-flex flex-column">
                      <label for="destPost" class="form-label fw-light">Destinatario/i</label>
                      <input type="text" class="form-control" id="destPost"  v-model="receivers" required>
                    </div>

                  </div>
                  <div class="d-flex justify-content-center" style="flex:1 1 0">
                    <input type="checkbox" class="btn-check" id="btn-check-outlined" v-model="timed" autocomplete="off">
                    <label class="btn btn-outline-primary" for="btn-check-outlined">Temporizzato</label><br>
                  </div>
                  <div class="d-flex flex-row justify-content-end" style="flex: 1 1 0">
                    <Select
                        updateRef="updatePostType"
                        :dropItems="['text','geolocation','image','video']"
                        :dropItemsName="['testo','geolocazione','immagine','video']"
                        classButton="btn btn-secondary"
                        label="tipo squeal"
                        def="inserisci tipo squeal"
                        @updatePostType="(el) => postType = el"
                    />
                  </div>

                  </div>
                <div class="m-1 w-100" style="max-height: 60vh">

                  <textarea v-if=" postType==='text'" rows="6" v-model="textSqueal"  class="form-control"></textarea>
                  <div v-if="!!link && activeChoiceLink" class="d-flex flex-row mt-3 mb-2 align-items-center">
                    <h5 class="fw-light m-0">E' stato rilevato un link. Preferisci crearne uno breve? </h5>
                    <button type="button" class="btn btn-outline-success ms-3 btn-sm " style="width: 5%"
                            @click="async () => {
                              await insertShorter();
                              activeChoiceLink = false;
                            }">si</button>
                    <button type="button" class="btn btn-outline-danger ms-3 btn-sm" style="width: 5%" @click="() => activeChoiceLink = false">no</button>
                  </div>
                  <div v-if="linkShorter !== ''" class="d-flex flex-row mt-3 mb-2 align-items-center">
                    <h5 class="fw-light m-0">Ecco un'anteprima del link:</h5>
                    <a :href="linkShorter" target=”_blank”>
                      <h5 class="mb-0 ms-3">{{linkShorter}}</h5>
                    </a>
                  </div>


                  <div v-if="postType === 'image'"  class="d-flex flex-column">
                    <div class="d-flex flex-column w-100 mt-3">
                      <div class="d-flex flex-row align-items-center">
                        <label for="pathImgForm" class="form-label flex-shrink-0 mb-0 me-2">inserisci URL foto</label>
                        <div class="input-group d-flex flex-row">
                          <input class="form-control" :disabled="Object.keys(fileUploaded).length !== 0"  type="text" placeholder="inserisci URL" id="pathImgForm" v-model="imgPath" >
                          <button :disabled="Object.keys(fileUploaded).length !== 0" type="button" class="btn btn-secondary" @click=" currentImgPath = imgPath; showImg = true">
                            Anteprima
                          </button>
                        </div>
                      </div>
                      <h6 class="m-0 mt-2 text-center">oppure</h6>
                      <div class="d-flex flex-row align-items-center">
                        <label for="formFile" class="form-label flex-shrink-0 mb-0 me-2">carica una foto</label>
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

                  <div v-if="postType === 'video'" class="d-flex flex-column">
                    <div class="d-flex flex-column w-100 mt-3">
                      <div class="d-flex flex-row align-items-center">
                        <label for="pathVideoForm" class="form-label flex-shrink-0 mb-0 me-2 fw-light">inserisci URL youtube</label>
                        <div class="input-group d-flex flex-row">
                          <input class="form-control" type="text" placeholder="inserisci URL" id="pathVideoForm" v-model="videoPath" >
                          <button type="button" class="btn btn-secondary" @click=" currentVideoPath = videoPath; showVideo = true">
                            Anteprima
                          </button>
                        </div>
                      </div>
                      <div v-if="showVideo" id="videoAddPost" class=" d-flex flex-row justify-content-center" style="height: 50vh">
                        <iframe :src="youtubePath"  title="preview video" width="100%" height="100%" allowfullscreen></iframe>
                      </div>
                    </div>
                  </div>

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
                  <div v-if="timed" class="d-flex flex-row flex-fill align-items-end">
                    <div class="d-flex flex-column">
                      <label for="numTimed" class="form-label">Numero di Squeal</label>
                      <input type="number" class="form-control" id="numTimed" v-model="numberOfRepetitions">
                    </div>
                      <div class="d-flex flex-column">
                        <label for="numFrequency" class=" form-label fw-light">Intervallo</label>
                        <input type="number" class="form-control" id="numFrequency" v-model="numFrequency">
                      </div>
                      <Select
                          :dropItems="['seconds','minutes', 'days']"
                          :dropItemsName="['secondi','minuti', 'giorni']"
                          updateRef="updateTypeF"
                          classButton="btn-secondary form-select-lg "
                          @updateTypeF="(el) => typeFrequency=el"
                          label="frequenza"
                          def="secondi"
                          labelClass="form-label fw-light"
                      />

                    <div class="d-flex ms-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16" v-tooltip="infoTimed">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="d-flex flex-row justify-content-end flex-fill align-items-end">
                    <button type="button" class="btn btn-danger m-1"
                            @click="$emit('closeAppModal', false); reset()"
                    >Indietro</button>
                    <button class="btn btn-primary m-1" type="button" @click="createPost(); reset(); $emit('closeAppModal', true)"> Crea Squeal </button>
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
