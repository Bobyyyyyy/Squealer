<script setup>
  import Reaction from "./Reaction.vue";
  import {currentVip, reactionsIcons} from "../../utils/config.js";
  import {onMounted, reactive, ref} from "vue";
  import ChartModalPost from "./ChartModalPost.vue";

  const props = defineProps({
    reactions: Array,
    postId: String,
    idx: Number,
  });

  const modalActive = ref(false);
  const chartModal = ref();

  const parsedReac = ref ({
    'heart': 0,
    'thumbs-up': 0,
    'thumbs-down': 0,
    'heartbreak': 0,
  })


  const currentActive = ref('');

  const changeReac = async (newReac) => {
    if (currentActive.value !== 'noOne'){
        parsedReac.value[currentActive.value] -= 1;
    }
    currentActive.value = newReac;
    parsedReac.value[currentActive.value]+= 1;
    await fetch(`/db/post/updateReaction`,{
      method:"PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        postId: props.postId,
        user: currentVip.value,
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
        postId: props.postId,
        user: currentVip.value,
      })
    })
  }

  function activeModal(){
    modalActive.value = true;
    chartModal.value.openModal();
  }

  onMounted(()=>{
    props.reactions.forEach(el => {
      if (el.user === currentVip.value) currentActive.value = el.rtype
      parsedReac.value[el.rtype] += 1;
    });

  })

</script>

<template>
  <div class="d-flex flex-row justify-content-around  ms-4 me-4">
    <div class="d-flex flex-column">
      <div class="d-flex flex-row justify-content-between align-items-center mt-2 mb-2">

        <Reaction v-for="(reaction,index) in reactionsIcons"
                  :key="index"
                  :values="(parsedReac[reaction.name])"
                  :icon="reaction"
                  :active="currentActive"
                  @changeReac="(newReac) => changeReac(newReac)"
                  @deleteReac="() => deleteReac() "
        />
      </div>
    </div>
    <div>
      <button type="button" class="btn btn-info" @click="activeModal();">Info</button>
    </div>
  </div>
  <ChartModalPost ref="chartModal" :reactions="parsedReac" :idx="idx"/>

</template>
