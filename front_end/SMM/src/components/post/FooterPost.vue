<script setup>
  import Reaction from "./Reaction.vue";
  import {currentVip, reactionsIcons} from "../../utils/config.js";
  import {onMounted, reactive, ref, watch} from "vue";
  import ChartModalPost from "./ChartModalPost.vue";
  import {parseReactionType} from "../../utils/functions.js";

  const props = defineProps({
    reactions: Array,
    postId: String,
    idx: Number,
  });

  const modalActive = ref(false);
  const chartModal = ref();
  const parsedType = reactive({});

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
        user:currentVip.value,
        date: new Date().toISOString(),
      }

      let idx = props.reactions.findIndex(el => el.user === newReaction.user);
      if (idx >= 0){
        props.reactions[idx] = newReaction;
      }
      else{
        props.reactions.push(newReaction);
      }
      console.log(props.reactions);
  }

  const changeReac = async (newReac) => {
    if (currentActive.value !== 'noOne'){
        parsedReac.value[currentActive.value] -= 1;
    }
    currentActive.value = newReac;
    parsedReac.value[currentActive.value]+= 1;

    updateProps(newReac);

    parsedType.value = parseReactionType(props.reactions);

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

    let idx = props.reactions.findIndex(el => el.user === currentVip.value);
    if (idx >= 0) currentActive.value = props.reactions[idx].rtype

    parsedType.value = parseReactionType(props.reactions);

    parsedReac.value['heart'] = parsedType.value['heart'].length;
    parsedReac.value['thumbs-up'] = parsedType.value['thumbs-up'].length
    parsedReac.value['thumbs-down'] = parsedType.value['thumbs-down'].length
    parsedReac.value['heartbreak'] = parsedType.value['heartbreak'].length

    chartModal.value.setDataReady();
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
  <ChartModalPost ref="chartModal" :reactions="parsedType" :idx="idx"/>
</template>
