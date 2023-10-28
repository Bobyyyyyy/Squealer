<script setup>
  import {currentVip} from "../../utilsSMM";

  defineProps({
    SMMname: String,
    VIPname: String,
  })

</script>

<template>
  <div class="modal fade" id="choiceModal" tabindex="-1"  aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body d-flex flex-column justify-content-center">
          <div class="d-flex flex-row justify-content-center">Vuoi entrare nell'account: </div>
          <div class="d-flex flex-row justify-content-center">
            <h4 class="mb-0"> {{VIPname}} </h4>
          </div>
        </div>
        <div class="modal-footer d-flex flex-row justify-content-around">
          <button type="button" class="btn btn-danger"
                  @click="$emit('closeModal')"
          >No, esci</button>
          <button type="button" class="btn btn-primary"
                  @click=
                      "
                      currentVip = VIPname
                      this.$router.push('/SMM/Profile');
                      $emit('closeModal')
                      ">
          Si, continua</button>
        </div>
      </div>
    </div>
  </div>
</template>