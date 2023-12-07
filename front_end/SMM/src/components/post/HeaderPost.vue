<script setup>

  const props = defineProps({
    name: String,
    dest: String,
    srcImg: String,
    dateCreation: Date
  })

  function parseTime(){
    let now = new Date().getTime()

    let timePassed = (now - new Date(props.dateCreation).getTime()) / 1000

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
  <div class="card-header d-flex justify-content-between header_post w-100">
    <div class="d-flex justify-content-start align-items-center w-100">
      <img :src=" srcImg " alt="immagine profilo" class="imgFluid rounded-circle" />
      <div class="d-flex flex-column dimOverflowText flex-grow-1">
        <h3 class="mb-0 setMargin flex-grow-1"> {{ name }} </h3>
        <p v-tooltip="dest" type="text" class="mb-0 overflow-hidden" id="ChannelName" style="white-space: nowrap; text-overflow: ellipsis"> {{dest}} </p>

      </div>
    </div>
    <div class="d-flex justify-content-end align-self-center flex-grow-1" style="width: 5rem">
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

  .dimOverflowText{
    max-width: 40rem;
  }

  .imgFluid{
    min-width: 15%;
    max-width: 15%;
    margin-bottom: 0;
  }

  @media screen and (max-width: 768px){
    .imgFluid{
      min-width: 20%;
      max-width: 20%;
    }
    .dimOverflowText{
      max-width: 14rem;
    }
  }

</style>