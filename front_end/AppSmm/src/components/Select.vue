<script setup>
import {onMounted, ref} from "vue";

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
    },
    required:{
      type:Boolean,
      default: false
    }
  })

  const selected = ref('props.def');
  const getID = (label) => `select${label}`;
  onMounted(() => selected.value = props.def);

</script>

<template>
  <div class="d-flex flex-column align-items-center ms-2">
    <label :for=getID(label) :class="labelClass" class="fw-light" >{{label}}</label>
    <select :id=getID(label) :class="classButton" v-model="selected" class="select btn" role="button" @change="$emit(updateRef, selected)" aria-expanded="false" :required="required">
      <option v-for="(el,i) in dropItems" :key="i" :value="el">{{dropItemsName[i]}}</option>
    </select>
  </div>

</template>