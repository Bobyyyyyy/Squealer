<script setup>
  import {computed} from "vue";

  const props = defineProps({
    num: Number,
    channel: String,
    creators: Array,
  })

  const message = computed(() => props.num === 1 ? [`In §${props.channel} c'è ${props.num} squeal nuovo`, 'il creatore è: ']:
      [`In §${props.channel} ci sono ${props.num} squeal nuovi`, 'i creatori sono: '])

</script>

<template>
  <div class="d-flex flex-column w-100 align-items-start">
    <span>{{message[0]}}</span>
    <div class="d-flex flex-row gap-2">{{message[1]}}
      <p v-for="(creator,i) in [...new Set(creators)]" :key="creator+i">{{creator}}{{creators.indexOf(creator) === creators.length - 1 ? '' : ','}}</p>
    </div>
  </div>
  <hr>
</template>