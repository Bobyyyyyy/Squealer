<script setup>
  import {useStore} from "vuex";
  import {computed} from "vue";
  import {currentVip} from "../utils/config.js";


  const store = useStore();
  const quota = computed(() => store.getters.getQuota);

  //richiesta che prende la max quota


</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <h4>Remaining quota </h4>
    <div class="d-flex flex-row w-100 justify-content-around">
      <h5 class="m-0">Daily</h5>
      <h5 class="m-0">Weekly</h5>
      <h5 class="m-0">Monthly</h5>
    </div>
    <div class="d-flex flex-row w-100 justify-content-around">
      <h5 class="m-0">{{ quota.daily }}</h5>
      <h5 class="m-0">{{ quota.weekly }}</h5>
      <h5 class="m-0">{{ quota.monthly }}</h5>
    </div>
    <hr>
    <h4>Max quota</h4>
    <div class="d-flex flex-row w-100 justify-content-around">
      <h5 class="m-0">Daily</h5>
      <h5 class="m-0">Weekly</h5>
      <h5 class="m-0">Monthly</h5>
    </div>
    <div class="d-flex flex-row w-100 justify-content-around">
      <h5 class="m-0">{{ quota.daily }}</h5>
      <h5 class="m-0">{{ quota.weekly }}</h5>
      <h5 class="m-0">{{ quota.monthly }}</h5>
    </div>
    <div class="d-flex flex-row w-100 justify-content-around">
      <input type="checkbox" class="btn-check" id="btnCheckDailyReset" autocomplete="off">
      <label class="btn btn-outline-primary" for="btnCheckDailyReset">Reset Daily</label>

      <input type="checkbox" class="btn-check" id="btnCheckWeeklyReset" autocomplete="off">
      <label class="btn btn-outline-primary" for="btnCheckWeeklyReset">Reset Weekly</label>

      <input type="checkbox" class="btn-check" id="btnCheckMonthlyReset" autocomplete="off">
      <label class="btn btn-outline-primary" for="btnCheckMonthlyReset">Reset Monthly</label>

      <input type="checkbox" class="btn-check" id="btnCheckIncreaseMax" autocomplete="off">
      <label class="btn btn-outline-primary" for="btnCheckIncreaseMax">Increase max</label>


    </div>
    <h4>Preview</h4>
    <h5>Remaining quota </h5>
    <div class="d-flex flex-row w-100 justify-content-around">
      <h6 class="m-0">Daily</h6>
      <h6 class="m-0">Weekly</h6>
      <h6 class="m-0">Monthly</h6>
    </div>
    <div class="d-flex flex-row w-100 justify-content-around">
      <h6 class="m-0">{{ quota.daily }}</h6>
      <h6 class="m-0">{{ quota.weekly }}</h6>
      <h6 class="m-0">{{ quota.monthly }}</h6>
    </div>
    <hr>
    <h5>Max quota</h5>
    <div class="d-flex flex-row w-100 justify-content-around">
      <h6 class="m-0">Daily</h6>
      <h6 class="m-0">Weekly</h6>
      <h6 class="m-0">Monthly</h6>
    </div>
    <div class="d-flex flex-row w-100 justify-content-around">
      <h6 class="m-0">{{ quota.daily }}</h6>
      <h6 class="m-0">{{ quota.weekly }}</h6>
      <h6 class="m-0">{{ quota.monthly }}</h6>
    </div>
  </div>
</template>

<style scoped>

</style>