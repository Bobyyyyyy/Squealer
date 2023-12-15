
<script setup>
import {onMounted, reactive, ref} from "vue";
import {Modal} from "bootstrap";
import AddChannelModal from "../components/channels/AddChannelModal.vue";
import Channel from "../components/channels/Channel.vue";
import {currentVip} from "../utils/config.js";
import Select from "../components/Select.vue";

let channels = []
const channelsReady = ref(false);
const visibilityFilter = ref('');
const roleFilter = ref('');

const modalState = reactive({Modal: null,})
onMounted(async () => {
  modalState.ChannelModal = new Modal('#AddChannelModal',{})

  let res = await fetch(`/db/channel/list?vipName=${currentVip.value}`,{
    method:"GET"
  });
  channels = await res.json();
  console.log(channels);
  channelsReady.value = true;
})

function openChannelModal() {
  modalState.ChannelModal.show()
}
function closeChannelModal() {
  modalState.ChannelModal.hide()
}

</script>

<template>
  <div class="centralDiv">
    <div class="marginCD">
      <h1 class="text-center">Lista Canali</h1>
      <div class="d-flex flex-row justify-content-between align-items-end">
        <div id="filterCh" class="input-group m-0">
          <input  type="text" class="form-control " placeholder="Search..." aria-label="Username" aria-describedby="basic-addon1">
          <button type="submit" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </div>
        <Select
            classButton="btn btn-secondary"
            :updateRef="visibilityFilter"
            :dropItems="['public', 'private', 'all']"
            :dropItemsName="['pubblico', 'privato', 'tutto']"
            label="visibilità"
            def="tutto"
        />
        <Select
            classButton="btn btn-secondary"
            :updateRef="roleFilter"
            :dropItems="['creator', 'admin', 'all']"
            :dropItemsName="['creatore', 'privato', 'tutti']"
            label="tipo utente"
            def="tutti"
        />
        <div>
          <button class="btn btn-secondary ms-2" @click="openChannelModal">Add</button>
        </div>
      </div>
      <div v-if="channelsReady" class="d-flex justify-content-center flex-column shadow-sm w-100">
        <Channel v-for="(ch,i) in channels"
                 :key="i"
                 :name="ch.name"
                 :description="ch.description"
                 :isPublic="ch.isPublic"
                 :creator="ch.creator"
                 :admins="ch.admins"
                 channelPic="https://picsum.photos/id/1/300/300"
        />
      </div>
    </div>
  </div>
  <AddChannelModal @closeChannelModel="closeChannelModal"/>
</template>


<style>


  #filterCh{
    width: 50%;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 768px) {
    #filterCh{
      width: auto;
    }
  }



</style>