<script setup>
import {Modal} from "bootstrap";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {parseDestinationsViewPost} from "../../../utils/functions.js";
import Post from "../Post.vue";

const reply = ref('');
const modalStateQuota = reactive({replies: null});

const props = defineProps({
  post:Object,
  idx:Number,
})

const openModal = () => {
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
}

defineExpose({
  openModal,
})

const getId =  () => `repliesModal${props.idx}`;


onMounted(()=> {
  modalStateQuota.replies = new Modal(`#${getId()}`,{});
})


</script>

<template>
  <div class="modal fade" :id="getId()" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Risposte</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body d-flex justify-content-center">
          <Post
              :post="post"
              :dest= "parseDestinationsViewPost(post.destinationArray, post.tags)"
              :numberOfPost="1"
              :viewFooter="false"
              picProfile = "/img/defaultUser.jpeg"
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

</style>