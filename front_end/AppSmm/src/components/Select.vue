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

  function reset(){
    selected.value=props.def;
  }

  defineExpose({reset});

</script>

<template>
  <div class="d-flex flex-column align-items-center ms-2">
    <label :for=getID(label) :class="labelClass" class="fw-light" >{{label}}</label>
    <select :id=getID(label) v-model="selected" class="form-select text-dark" role="button" @change="$emit(updateRef, selected)" aria-expanded="false" :required="required" style="background-color: var(--bs-secondary);">
      <option v-for="(el,i) in dropItems" :key="i" :value="el">{{dropItemsName[i]}}</option>
    </select>
  </div>

</template>