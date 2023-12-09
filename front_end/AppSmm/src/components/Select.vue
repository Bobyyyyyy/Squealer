<script setup>
  import {ref} from "vue";

  const props = defineProps({
    updateRef: String,
    dropItems: Array,
    dropItemsName: Array,
    classButton: String,
    label: String,
    def: String,
    labelClass:{
      type:String,
      default: '',
    }
  })

  const selected = ref(props.def);

  const getID = (label) => `select${label}`;

</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <label :for=getID(label) :class="labelClass" class="fw-light" >{{label}}</label>
    <select :id=getID(label) :class="classButton" v-model="selected" class="select btn ms-2" role="button" @change="$emit(updateRef, selected)" aria-expanded="false">
      <option v-for="(el,i) in dropItems" :key="i" :value="el" :selected="el === def ? 'selected': ''">{{dropItemsName[i]}}</option>
    </select>
  </div>

</template>