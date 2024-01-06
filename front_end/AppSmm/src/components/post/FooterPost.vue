<script setup>
  import Reaction from "./Reaction.vue";
  import {reactionsIcons} from "../../utils/config.js";
  import {computed, onMounted, reactive, ref} from "vue";
  import ChartModalPost from "./ChartModalPost.vue";
  import {parseReactionType} from "../../utils/functions.js";
  import ReplyModal from "./reply/ReplyModal.vue";
  import {useStore} from "vuex";

  const store = useStore();

  const vip = computed(()=>store.getters.getVip);

  const props = defineProps({
    post: Object,
    idx: Number,
    handle: {
      type:Boolean,
      default: false,
    }
  });

  const modalActive = ref(false);
  const chartModal = ref();
  const replyModal = ref();
  const parsedType = reactive({});
  const replyOpen = ref(false);

  const parsedReac = ref ({
    'heart': 0,
    'thumbs-up': 0,
    'thumbs-down': 0,
    'heartbreak': 0,
  })


  const currentActive = ref('');

  function updateProps(newReac){
      let newReaction = {
        rtype: newReac,
        user: vip.value.name,
        date: new Date().toISOString(),
      }

      let idx = props.post.reactions.findIndex(el => el.user === newReaction.user);
      if (idx >= 0){
        props.post.reactions[idx] = newReaction;
      }
      else{
        props.post.reactions.push(newReaction);
      }
      console.log(props.post.reactions);
  }

  const changeReac = async (newReac) => {
    if (currentActive.value !== 'noOne'){
        parsedReac.value[currentActive.value] -= 1;
    }
    currentActive.value = newReac;
    parsedReac.value[currentActive.value]+= 1;

    updateProps(newReac);

    parsedType.value = parseReactionType(props.post.reactions);

    await fetch(`/db/post/updateReaction`,{
      method:"PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        postId: props.post._id,
        user: vip.value.name,
        reaction: newReac,
      })
    })
  }

  const deleteReac = async () => {
    parsedReac.value[currentActive.value] -= 1;
    currentActive.value = 'noOne';
    await fetch(`/db/post/deleteReaction`,{
      method:"PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        postId: props.post.postId,
        user: vip.value.name,
      })
    })
  }

  function activeModal(){
    modalActive.value = true;
    chartModal.value.openModal();

  }

  function openReplyModal(){
    replyOpen.value = true;
    replyModal.value.openModal();
  }

  onMounted(()=>{
    let idx = props.post.reactions.findIndex(el => el.user === vip.value.name);
    if (idx >= 0) currentActive.value = props.post.reactions[idx].rtype

    parsedType.value = parseReactionType(props.post.reactions);

    parsedReac.value['heart'] = parsedType.value['heart'].length;
    parsedReac.value['thumbs-up'] = parsedType.value['thumbs-up'].length
    parsedReac.value['thumbs-down'] = parsedType.value['thumbs-down'].length
    parsedReac.value['heartbreak'] = parsedType.value['heartbreak'].length

    chartModal.value.setDataReady();
  })

</script>

<template>
  <div class="d-flex flex-row justify-content-around align-items-center text-dark ms-1 me-1 mb-1">
    <div class="d-flex flex-row align-items-center sameWidth justify-content-between">
      <div v-if="!handle" class="d-flex flex-row align-items-center">
        <Reaction
            v-for="(reaction,index) in reactionsIcons"
            :key="index"
            :values="(parsedReac[reaction.name])"
            :icon="reaction"
            :active="currentActive"
            @changeReac="(newReac) => changeReac(newReac)"
            @deleteReac="() => deleteReac() "
        />

      </div>
      <div class="d-flex flex-row align-items-center justify-content-end">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
        </svg>
        <h6 class="m-0 ms-2 me-2">
          {{post.views.length}}
        </h6>
      </div>
    </div>

    <div class="d-flex align-items-center sameWidth">
      <svg v-if="!handle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
        <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
      </svg>
      <h6 v-if="!handle" @click="openReplyModal" class="m-0 ms-1 text-dark" type="button">
        Risposte
      </h6>
      <div class="d-flex sameWidth justify-content-end">
        <button type="button" class="btn btn-outline-info" @click="activeModal();">Info</button>
      </div>

    </div>

  </div>
  <ChartModalPost ref="chartModal" :reactions="parsedType" :idx="idx"/>
  <ReplyModal ref="replyModal" :post="post" :idx="idx"/>
</template>
