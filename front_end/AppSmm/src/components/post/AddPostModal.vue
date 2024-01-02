<script setup>
  import 'vue-toast-notification/dist/theme-sugar.css';
  import {computed, onMounted, reactive, ref} from "vue";
  import Map from "./Map.vue";
  import {blob2base64, compressBlob, parse2timestamp, setupBeep} from "../../utils/functions.js";
  import {URLHTTPREGEX} from "../../utils/config.js";
  import {useStore} from "vuex";
  import Select from "../Select.vue";
  import {useToast} from "vue-toast-notification";
  import {Modal} from "bootstrap";

  const store = useStore();
  const $toast = useToast();

  const vip = computed(() => store.getters.getVip);
  const modalState = reactive({post: null});

  const emits = defineEmits(['restoreSideBar', 'addedPost']);

  function openModal() {
    modalState.post.show()
  }

  function closeModal(addedPost, post) {
    emits('restoreSideBar');
    if(addedPost) emits('addedPost', post);
    modalState.post.hide()
  }

  defineExpose({
    openModal,
  })

  onMounted(()=> {
    modalState.post = new Modal('#AddPostModal',{});
  })


  const infoTimed = `sintassi Squeal:<br>{NUM} per avere il numero corrente dello squeal<br>{TIME} per avere il tempo di pubblicazione dello squeal<br>{DATE} per avere la data di pubblicazione dello squeal`

  /* TYPE and USER/CHANNEL */
  const postType = ref('text')
  const receivers = ref('')
  const receiverArr = computed(()=> receivers.value.replaceAll(" ","").split(','))
  const inChannel = computed(()=> {
    return !!receiverArr.value.find(el => el.startsWith('§'));
  });
  const typeSelect = ref();

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
  const youtubePath = computed(() => currentVideoPath.value === '' ? '':`//www.youtube.com/embed/${getEmbed(currentVideoPath.value)}`)

  /* MAP */
  const mapLocationLatLng = ref({});  //get [lat,lon] of current position.

  /* QUOTA */
  const quota2remove = computed(() => (postType.value === 'text' ? textSqueal.value.length : 125)
      * (timed.value && numberOfRepetitions.value > 1 ? parseInt(numberOfRepetitions.value) : 1)
  );
  /* 15 è il valore tolto per immagine e geolocalizzazione */
  const getLiveDQuota = computed(()=> (store.getters.getQuota.daily - (inChannel.value ? quota2remove.value : 0)));
  const getLiveWQuota = computed(()=> (store.getters.getQuota.weekly - (inChannel.value ? quota2remove.value : 0)));
  const getLiveMQuota = computed(()=> (store.getters.getQuota.monthly - (inChannel.value ? quota2remove.value : 0)));


  function parseDestinations(){
    let dest = [];
    receiverArr.value.forEach(receiver => {
      dest.push({
        name: receiver.substring(1),
        destType: receiver.startsWith('§') ? 'channel' : receiver.startsWith('@') ? 'user' : receiver.startsWith('#') ? 'keyword': 'errore',
      })
    })
    return dest;
  }

  async function createPost() {
    try {

      let tags = [];

      if (postType.value === 'text') {
        tags = textSqueal.value.match(/\#\w+/g)
        if (tags) tags = tags.map(el => el.substring(1));
      }

      let dest = parseDestinations(receiverArr.value);
      tags.forEach(tag => {
        dest.push({
          name: tag.substring(1),
          destType: 'keyword',
        })
      })
      //remove duplicates
      if (dest.length > 0) dest = dest.filter((dst, index) => dest.indexOf(dst) === index);

      let post = {
        creator: vip.value.name,
        contentType: postType.value,
        dateOfCreation: Date.now(),
        destinations: dest,
        timed: timed.value,
        ...(timed) && {
          squealNumber: numberOfRepetitions.value,
          millis: parse2timestamp([numFrequency.value.toString(), typeFrequency.value]),
        },
      }


      /* content based on squeal type */
      let content = postType.value === 'geolocation' ? JSON.stringify(mapLocationLatLng.value.value) :
          postType.value === 'text' ? textSqueal.value :
              postType.value === 'video' ? youtubePath.value :
                  fileUploaded.value?.length && fileUploaded.value?.length > 0 ?
                      await blob2base64(await compressBlob(fileUploaded.value.item(0)))
                      : currentImgPath.value;


      if (!content || content === '') {
        return {message: 'Squeal vuoto! Dicci qualcosa'};
      }

      post = {...post, content: content};


      let res = await fetch("/db/post", {
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
          "Content-Type": "application/json"
        }
      })
      if (res.ok) {
        reset();
        $toast.success('Squal aggiunto con successo!', {position: 'top-right'});
        closeModal(true, await res.json());

        if (timed.value) {
          setupBeep(numberOfRepetitions.value, numFrequency.value, typeFrequency.value);
        }
      }
      else{
        throw res;
      }
    }
    catch (err){
      let message = await err.json()
        $toast.error(message);
    }
  }

  function reset(){
    typeSelect.value.reset();
    postType.value ='text'
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
            <form id="addPostForm"  @submit="(event) => {
                      event.preventDefault();
                      createPost()
                      }">
              <div class="d-flex flex-column">
                <div class="d-flex flex-column flex-lg-row justify-content-between align-items-center align-items-lg-end">
                  <div class="d-flex flex-row align-items-end md-w-100 flex-addpost-dest">
                    <div class="d-flex flex-column md-w-100">
                      <label for="destPost" class="form-label fw-light">Destinatario/i</label>
                      <input type="text" class="form-control" placeholder="@pippo, §canalepippo, ..." id="destPost"  v-model="receivers" required>
                    </div>
                  </div>

                  <div class="d-flex flex-row align-items-end justify-content-between flex-addpost-typetemp w-100">
                    <div class="d-flex  justify-content-start justify-content-lg-center w-50 mt-2 mt-lg-0">
                      <input type="checkbox" class="btn-check" id="btn-check-outlined" v-model="timed" autocomplete="off">
                      <label class="btn btn-outline-primary" for="btn-check-outlined">Temporizzato</label><br>
                      <div class="d-flex ms-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16" v-tooltip="infoTimed">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>
                      </div>
                    </div>

                    <div class="d-flex flex-row justify-content-end" >
                      <Select
                          ref="typeSelect"
                          updateRef="updatePostType"
                          :dropItems="['text','geolocation','image','video']"
                          :dropItemsName="['testo','geolocazione','immagine','video']"
                          label="tipo squeal"
                          def="text"
                          @updatePostType="(el) => postType = el"
                      />
                    </div>
                  </div>



                  </div>
                <div class="mt-2 m-lg-1 preview-size" >

                  <textarea v-if=" postType==='text'" rows="6" v-model="textSqueal" maxlength="500" placeholder="cosa pensi?"  class="form-control"></textarea>
                  <div v-if="!!link && activeChoiceLink" class="d-flex flex-row mt-3 mb-2 align-items-center">
                    <h5 class="fw-light m-0">E' stato rilevato un link. Preferisci crearne uno breve? </h5>
                    <button type="button" class="btn btn-outline-success ms-3 btn-sm " style="width: 5%"
                            @click="async () => {
                              await insertShorter();
                              activeChoiceLink = false;
                            }">si</button>
                    <button type="button" class="btn btn-outline-danger ms-3 btn-sm" style="width: 5%" @click="() => activeChoiceLink = false">no</button>
                  </div>
                  <div v-if="linkShorter !== '' && !!link" class="d-flex flex-row mt-3 mb-2 align-items-center">
                    <h5 class="fw-light m-0">Ecco un'anteprima del link:</h5>
                    <a :href="linkShorter" target=”_blank”>
                      <h5 class="mb-0 ms-3">{{linkShorter}}</h5>
                    </a>
                  </div>


                  <div v-if="postType === 'image'"  class="d-flex flex-column">
                    <div class="d-flex flex-column w-100 mt-3">
                      <div class="d-flex flex-row align-items-center">
                        <div class="input-group d-flex flex-row">
                          <input class="form-control" :disabled="Object.keys(fileUploaded).length !== 0"  type="text" placeholder="inserisci URL foto" id="pathImgForm" v-model="imgPath" >
                          <button :disabled="Object.keys(fileUploaded).length !== 0" type="button" class="btn btn-secondary" @click=" currentImgPath = imgPath; showImg = true">
                            Anteprima
                          </button>
                        </div>
                      </div>
                      <h6 class="m-0 mt-2 mb-2 text-center">oppure</h6>
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
                      <div v-if="showVideo" id="videoAddPost" class=" d-flex flex-row justify-content-center w-100 mt-2">
                        <iframe :src="youtubePath"  title="preview video" class="preview-video"  allowfullscreen></iframe>
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
                <div class="d-flex flex-row flex-wrap justify-content-between">
                  <div v-if="timed" class="d-flex flex-row flex-fill align-items-end mb-2 mb-lg-0 ">
                    <div class="d-flex flex-column align-items-center sameWidth">
                      <label for="numTimed" class="form-label fw-light">Numero</label>
                      <input type="number" class="form-control" id="numTimed" v-model="numberOfRepetitions" min="1" required>
                    </div>
                    <div class="d-flex flex-column align-items-center sameWidth ms-2">
                      <label for="numFrequency" class=" form-label fw-light">Intervallo</label>
                      <input type="number" class="form-control" id="numFrequency" v-model="numFrequency" min="1" required>
                    </div>
                    <Select class="sameWidth"
                        :dropItems="['seconds','minutes', 'hours']"
                        :dropItemsName="['secondi','minuti', 'ore']"
                        :required="true"
                        updateRef="updateTypeF"
                        classButton="btn-secondary"
                        @updateTypeF="(el) => typeFrequency=el"
                        label="frequenza"
                        def="secondi"
                        labelClass="form-label fw-light"
                    />
                  </div>
                  <div class="d-flex flex-row justify-content-between justify-content-lg-end flex-fill align-items-end">
                    <button type="button" class="btn btn-danger m-1"
                            @click="closeModal(false); reset()">Indietro</button>
                    <button type="submit" class="btn btn-primary m-1" > Crea Squeal </button>
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
    max-height: 45vh;
  }

  .flex-addpost-dest{
    flex-basis: calc(100%/3);
  }
  .flex-addpost-typetemp{
    flex-basis: calc((100%/3) * 2);
  }

  .preview-size{
    max-height: 60vh;
  }
  .preview-video{
    min-height: 35vh;
    max-height:40vh;
    aspect-ratio: 16/9
  }

  @media screen and (max-width: 768px){
    .modal-dialog-centered{
      max-width: 100% !important;
      min-height: 4rem;
    }
    .md-w-100{
      width: 100%;
    }

    .preview-size{
      max-height: 45vh;
    }
    .map{
      min-height: 40vh;
    }
    #imgAddPost{
      max-height: 25vh;
    }
    .preview-video{
      min-height: 20vh;
      max-height: 30vh;
    }
  }


</style>
