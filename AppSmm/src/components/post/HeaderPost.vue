<script setup>
  const props = defineProps({
    name: String,
    channel: String,
    srcImg: String,
  })

  function go2Profile(){
    //fare qnpm ui fetch o al caricamento della pagina?
    //let newUrl = "../profile/" + userName;
    //routing
    console.log("vado da "+ props.name);
  }

  function go2Channel(){
    //leggi sopra
    console.log("vado nel canale: " +  props.channel);
    //quindi ci sarà un emits con routing
  }

</script>

<template>
  <div class="card-header d-flex justify-content-between header_post ">
    <div class="d-flex justify-content-start align-items-center ">
      <img @click="go2Profile" :src=" srcImg " alt="immagine profilo" class="imgFluid" />
      <h4 @click="go2Profile" class="mb-0 setMargin"> {{ name }} </h4>
    </div>
    <div @click="go2Channel" class="d-flex align-items-center ">
      <h4 class="mb-0" id="ChannelName"> {{channel}} </h4>
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