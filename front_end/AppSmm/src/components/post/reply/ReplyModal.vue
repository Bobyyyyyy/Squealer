<script setup>
import {Modal} from "bootstrap";
import {reactive, ref} from "vue";
import {parseDestinationsViewPost} from "../../../utils/functions.js";
import Post from "../Post.vue";
import Reply from "./Reply.vue";
import {useToast} from "vue-toast-notification";

const $toast = useToast();

const reply = ref('');
const modalStateQuota = reactive({replies: null});

const props = defineProps({
  post:Object,
  idx:Number,
})

const replies = ref([]);
const readyReplies = ref(false);

const openModal = async () => {
  let res = await fetch(`/db/reply?parentid=${props.post._id}`, {
    method:"GET"
  })
  if (res.ok) replies.value = await res.json();
  readyReplies.value = true;
  modalStateQuota.replies = new Modal(`#${getId()}`,{});

  modalStateQuota.replies.show()
}
function closeModal() {
  modalStateQuota.replies.hide()
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
    $toast.success('commmento inserito con successo', {position:'top-right'});
  }
  else $toast.error(`errore: ${(await res.json()).message}`);
}

defineExpose({
  openModal,
})

const getId =  () => `repliesModal${props.idx}`;

</script>

<template>
  <div class="modal fade" :id="getId()" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered ">
      <div class="modal-content modalReplyDim">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Risposte</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body d-flex flex-column justify-content-center">
          <Post
              :post="post"
              :dest= "parseDestinationsViewPost(post.destinationArray, post.officialChannelsArray, post.tags)"
              :numberOfPost="1"
              :viewFooter="false"
              picProfile = "/img/defaultUser.jpeg"
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
    width: 36rem !important;
  }

  @media screen and (max-width: 768px){
    .modalReplyDim{
      width: 100% !important;
    }
  }

</style>