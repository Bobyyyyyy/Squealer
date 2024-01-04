<script setup>
import {computed, ref} from "vue";
  import {useStore} from "vuex";
import {useToast} from "vue-toast-notification";

  const store = useStore();
  const $toast = useToast();
  const vip = computed(()=>store.getters.getVip);

  const channelName = ref('')
  const channelDescription = ref('')
  const checked = ref('private');

  function reset(){
    channelName.value =''
    channelDescription.value = ''
  }

  async function createChannel(){
    try{
      console.log(checked.value);
      const channel = {
        name: channelName.value.toLowerCase().split(' ').join('_'),
        description: channelDescription.value,
        type: checked.value,
        creator: vip.value.name,
      }

      console.log(channel);

      let res = await fetch("/db/channel",{
        method:"POST",
        body: JSON.stringify(channel),
        headers: {
          "Content-Type":"application/json"
        }
      })
      if (res.ok){
        $toast.success(`canale §${channelName.value.toLowerCase().split(' ').join('_')} creato con successo`, {position:"top-right"});
      }
      else throw await res.json();
    }catch (err){
      $toast.error(err.message);
    }
  }

</script>

<template>
  <div class="modal fade w-100 h-100" id="AddChannelModal"  tabindex="-1" aria-hidden="true">
    <div class="d-flex centralDiv align-items-center">
      <div class="modal-dialog modalDim">
        <div class="modal-content flex-">
          <form id="addChannelForm" @submit="(event) => {
              event.preventDefault();
              createChannel();
              reset();
              $emit('closeChannelModel');
          }">
            <div class="modal-body d-flex flex-row justify-content-between">
              <div class="d-flex flex-column w-100">
                <div class="d-flex flex-row gap-2 align-items-end justify-content-between">
                  <div class="d-flex flex-column">
                    <label for="nameChannel" class="form-label">Nome</label>
                    <input type="text" class="form-control" id="nameChannel" v-model="channelName" required>
                  </div>
                  <div class="btn-group" role="group" aria-label="Basic radio toggle button group">

                    <input type="radio" class="btn-check" name="btnTypeChannel" id="btnPrivateChannel" value="private" autocomplete="off" checked v-model="checked">
                    <label class="btn btn-outline-primary" for="btnPrivateChannel">private</label>

                    <input type="radio" class="btn-check" name="btnTypeChannel" id="btnPublicChannel" value="public" autocomplete="off" v-model="checked">
                    <label class="btn btn-outline-primary" for="btnPublicChannel">public</label>

                  </div>
                </div>
                <div class="d-flex flex-column mt-2">
                  <label for="descriptionChannel" class="form-label">Descrizione</label>
                  <textarea rows="4" type="text" class="form-control w-100" id="descriptionChannel"
                            v-model="channelDescription" required />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="d-flex flex-row w-100 justify-content-between">
                <button type="button" class="btn btn-danger"
                        @click="$emit('closeChannelModel')"
                >Indietro</button>
                <button class="btn btn-primary" type="submit"> Crea Canale </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>