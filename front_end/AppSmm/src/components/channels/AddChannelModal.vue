<script setup>
  import {ref} from "vue";
  import {currentVip} from "../../utilsSMM.js";

  const channelName = ref('')
  const channelDescription = ref('')
  function reset(){
    channelName.value =''
    channelDescription.value = ''
  }

  async function createChannel(){
    try{
      const channel = {
        name: channelName.value.toLowerCase().split(' ').join('_'),
        description: channelDescription.value,
        isPublic: document.querySelector("input[name=btnTypeChannel]:checked").value === 'public',
        creator: currentVip.value,
      }

      await fetch("/db/Channel",{
        method:"POST",
        body: JSON.stringify(channel),
        headers: {
          "Content-Type":"application/json"
        }
      })

    }catch (err){
      console.log(err)  //GESTIRE ERRORE
    }
  }

</script>

<template>
  <div class="modal fade w-100 h-100" id="AddChannelModal"  tabindex="-1" aria-hidden="true">
    <div class="d-flex centralDiv z-1 align-items-center">
      <div class="modal-dialog modalDim">
        <div class="modal-content flex-">
          <form id="addChannelForm">
            <div class="modal-body d-flex flex-row justify-content-between">
              <div class="d-flex flex-column w-100">
                <div class="d-flex flex-row align-items-end justify-content-between">
                  <div class="d-flex flex-column">
                    <label for="nameChannel" class="form-label">Name</label>
                    <input type="text" class="form-control" id="nameChannel" v-model="channelName" required>
                  </div>
                  <div class="btn-group" role="group" aria-label="Basic radio toggle button group">

                    <input type="radio" class="btn-check" name="btnTypeChannel" id="btnPrivateChannel" value="private" autocomplete="off" checked>
                    <label class="btn btn-outline-primary" for="btnPrivateChannel">private</label>

                    <input type="radio" class="btn-check" name="btnTypeChannel" id="btnPublicChannel" value="public" autocomplete="off">
                    <label class="btn btn-outline-primary" for="btnPublicChannel">public</label>

                  </div>
                </div>
                <div class="d-flex flex-column ">
                  <label for="descriptionChannel" class="form-label">Description</label>
                  <textarea rows="4" type="text" class="form-control w-100" id="descriptionChannel"
                            v-model="channelDescription" required />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger"
                      @click="$emit('closeChannelModel')"
              >Indietro</button>
              <button class="btn btn-primary" type="button" @click="createChannel(); reset(); $emit('closeChannelModel')"> Crea Canale </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>