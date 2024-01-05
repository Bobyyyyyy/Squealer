<script setup>
import {Modal} from "bootstrap";
import {computed, reactive, ref} from "vue";
import {parseDestinationsViewPost} from "../../../utils/functions.js";
import Post from "../Post.vue";
import Reply from "./Reply.vue";
import {useToast} from "vue-toast-notification";
import {useStore} from "vuex";

const $toast = useToast();
const store = useStore();

const reply = ref('');
const modalState = reactive({replies: null});
const replies = computed(() => store.getters.getReplies);
const vipImage = computed(() => store.getters.getVip.profilePic);

const props = defineProps({
  post:Object,
  idx:Number,
})

const id =  `repliesModal${props.idx}${Math.floor(Math.random() * 1000)}`;

const readyReplies = ref(false);

const openModal = async () => {
  let res = await fetch(`/db/reply?parentid=${props.post._id}`, {
    method:"GET"
  })
  if (res.ok) store.commit('setReplies', await res.json());
  readyReplies.value = true;
  modalState.replies = new Modal(`#${id}`,{});

  modalState.replies.show()
}
function closeModal() {
  modalState.replies.hide();
  store.commit('deleteReplies');
  modalState.replies = null;
}

async function addComment(){
  let res = await fetch('/db/reply/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body:JSON.stringify({
      content: reply.value,
      parentid: props.post._id,
    })
  })
  if(res.ok){
    store.commit('pushReply', {...await res.json(), profilePicture: vipImage.value});
    $toast.success('commmento inserito con successo', {position:'top-right'});
  }
  else $toast.error(`errore: ${(await res.json()).message}`);
}

defineExpose({
  openModal,
})

</script>

<template>
  <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered ">
      <div class="modal-content modalReplyDim">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Risposte</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body d-flex flex-column justify-content-center">
          <Post
              :post="post"
              :dest= "parseDestinationsViewPost(post.destinationArray, post.officialChannelsArray)"
              :numberOfPost="1"
              :viewFooter="false"
              :picProfile = "post.profilePicture"
          />
          <Reply v-if="readyReplies" v-for="(reply, idx) in replies"
                 :key="idx"
                 :profilePic="reply.profilePicture"
                 :content="reply.content"
                 :creator="reply.owner"
                 :dateCreation="reply.dateOfCreation"

          />
        </div>
        <div class="modal-footer">
          <div class="input-group mb-1">
            <input type="text" class="form-control" placeholder="scrivi risposta..." aria-label="scrivi_risposta" v-model="reply" >
            <button type="button" class="btn btn-primary" @click="addComment">Invia</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modalReplyDim{
    width: 43rem !important;
  }

  @media screen and (max-width: 768px){
    .modalReplyDim{
      width: 100% !important;
    }
  }

</style>