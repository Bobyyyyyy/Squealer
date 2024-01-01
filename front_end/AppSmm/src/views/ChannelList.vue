
<script setup>
import {computed, onMounted, reactive, ref, watch, watchEffect} from "vue";
import {Modal} from "bootstrap";
import AddChannelModal from "../components/channels/AddChannelModal.vue";
import Channel from "../components/channels/Channel.vue";
import {currentVip, CHANNEL_OFFSET} from "../utils/config.js";
import Select from "../components/Select.vue";

let offset = ref(0);
let limit = ref(CHANNEL_OFFSET);
const channels = ref([]);
const searchChannel = ref('');

const filters = computed(() => {
  let filters = {}
  if(roleFilter.value === '' || roleFilter.value === 'all') {
    filters.hasAccess = currentVip.value;
    filters.creator = currentVip.value;
    filters.both = true;
  }
  else if(roleFilter.value === 'admin') filters.hasAccess = currentVip.value;
  else filters.creator = currentVip.value;
  if(visibilityFilter.value !== '' && visibilityFilter.value !== 'all') filters.type = visibilityFilter.value;
  if(searchChannel.value !== '') filters.name = searchChannel.value;
  return JSON.stringify(filters);
})

const query = computed( () => `/db/channel?filters=${filters.value}&limit=${limit.value}&offset=${offset.value}`);

const visibilityFilter = ref('');
const roleFilter = ref('');
const modalState = reactive({Modal: null,})

async function updateChannels(query){
  let res = await fetch(query,{
    method:"GET"
  });
  return await res.json();
}

onMounted(async () => {
  modalState.ChannelModal = new Modal('#AddChannelModal',{})
})

function openChannelModal() {
  modalState.ChannelModal.show()
}
function closeChannelModal() {
  modalState.ChannelModal.hide()
}

watchEffect(async () => {
  console.log(query.value);
  channels.value = await updateChannels(query.value);
});

</script>

<template>
  <div class="centralDiv">
    <div class="marginCD">
      <div class="d-flex flex-row flex-wrap justify-content-between align-items-end pt-4 pb-2 mb-2 m-lg-0">
        <div id="filterCh" class="input-group mb-2 m-lg-0">
          <input  type="text" class="form-control " placeholder="Cerca..." aria-label="channel search" aria-describedby="cerca canale" v-model="searchChannel">
          <button type="submit" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </button>
        </div>
        <Select
            updateRef="updateVisibility"
            :dropItems="['public', 'private', 'all']"
            :dropItemsName="['pubblico', 'privato', 'tutto']"
            label="visibilità"
            def="all"
            @updateVisibility="(vis) => visibilityFilter = vis"
        />
        <Select
            updateRef="updateRole"
            :dropItems="['creator', 'admin', 'all']"
            :dropItemsName="['creatore', 'amministratore', 'tutti']"
            label="tipo utente"
            def="all"
            @updateRole="(role) => roleFilter = role "
        />
        <div>
          <button class="btn btn-secondary ms-2" @click="openChannelModal">Crea</button>
        </div>
      </div>
      <div class="d-flex justify-content-center flex-column shadow-sm w-100">
        <Channel v-for="(ch,i) in channels"
                 :key="i"
                 :name="ch.name"
                 :description="ch.description"
                 :isPublic="ch.type === 'public'"
                 :creator="ch.creator"
                 :admins="ch.admins"
                 channelPic="https://picsum.photos/id/1/300/300"
        />
      </div>
    </div>
  </div>
  <AddChannelModal @closeChannelModel="closeChannelModal"/>
</template>


<style scoped>


  #filterCh{
    width: 50%;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 768px) {
    #filterCh{
      width: 100%;
    }
  }



</style>