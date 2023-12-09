<script setup>


import {currentVip} from "../../utils/config.js";

  const props = defineProps({
    SMMname: String,
    VIPname: String,
  })

  async function updateSes (){
    {
      let res = await fetch("/db/user/sessionVip",{
        method:"PUT",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({vipName: props.VIPname})
        })
      currentVip.value = (await res.json()).vip;
    }
  }

</script>

<template>
  <div class="modal fade" id="choiceModal" tabindex="-1"  aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body d-flex flex-column justify-content-center">
          <div class="d-flex flex-row justify-content-center">Vuoi entrare nell'account: </div>
          <div class="d-flex flex-row justify-content-center">
            <h4 class="mb-0"> {{VIPname}} </h4>
          </div>
        </div>
        <div class="modal-footer d-flex flex-row justify-content-around">
          <button type="button" class="btn btn-danger"
                  @click="$emit('closeModal')"
          >No, esci</button>
          <button type="button" class="btn btn-primary"
                  @click=
                      "
                      async ()=>{
                      await updateSes();
                      $emit('closeModal');
                      $router.push('/AppSmm/Profilo');
                      }
                      ">
          Si, continua</button>
        </div>
      </div>
    </div>
  </div>
</template>