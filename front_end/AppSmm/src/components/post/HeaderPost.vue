<script setup>

  import {getPage} from "../../utils/functions.js";

  const props = defineProps({
    name: String,
    dest: String,
    srcImg: String,
    dateCreation: Date,
    destType:String,
  })

  function go2Channel(){
    //leggi sopra
    console.log("vado nel canale: " +  props.channel);
    //quindi ci sarà un emits con routing
  }


  function parseTime(){
    let now = new Date().getTime()

    let timePassed = (now - (props.dateCreation)?.getTime()) / 1000

    return timePassed < 60 ? `${Math.floor(timePassed)} s.` :
              timePassed < 60*60 ? `${Math.floor(timePassed/60)} m.` :
                 timePassed < 60*60*24 ? `${Math.floor(timePassed/(60*60))} h.` :
                     timePassed < 60*60*24*7 ? `${Math.floor(timePassed/(60*60*24))} d.` :
                         timePassed < 60*60*24*7*4 ? `${Math.floor(timePassed/(60*60*24*7))} w.` :
                             timePassed < 60*60*24*7*4*12 ? `${Math.floor(timePassed/(60*60*24*7*4))} m.` :
                                 `1+ y.`
  }

</script>

<template>
  <div class="card-header d-flex justify-content-between header_post ">
    <div class="d-flex justify-content-start align-items-center ">
      <img :src=" srcImg " alt="immagine profilo" class="imgFluid" />
      <div class="d-flex flex-column flex-fill">
        <h3 class="mb-0 setMargin"> {{ name }} </h3>
        <h5 v-if="getPage() !=='Channels'" @click="go2Channel" type="button" class="mb-0" id="ChannelName"> {{dest}} </h5>


      </div>
    </div>
    <div class="d-flex text-center align-items-center ">
      <h5 v-tooltip="dateCreation.toString()" class="mb-0">
        {{parseTime()}}
      </h5>

    </div>
  </div>
</template>

<style>

  .header_post{
    height: 6rem;
  }

  .setMargin{
    margin-left: 2%;
  }


  .imgFluid{
    width: 15%;
    margin-bottom: 0;
  }

</style>