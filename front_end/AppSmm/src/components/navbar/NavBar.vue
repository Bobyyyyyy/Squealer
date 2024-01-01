<script setup>

import {currentVip, smartPhone} from "../../utils/config.js";
  import Dropdown from "../Dropdown.vue";
  import {logout} from "../../utils/functions.js";
import NotificationBadge from "../notification/NotificationBadge.vue";


  defineProps({
    centerText: String,
    welcomingPage: Boolean,
  })


</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary maxHNav navBar align-items-center">
    <div class="d-flex flex-row justify-content-start h-100 w-100">
      <div class="justify-content-start align-item sameWidth">
        <div class="img-container d-flex justify-content-start">
          <img v-if="welcomingPage" alt="logo" src="/img/logo.png" class="img-fluid object-fit-contain h-100"  @load=" $emit('imgLoaded')">
          <router-link v-else to="/SMM/Profile" class="d-flex justify-content-start mb-3 h-100">
            <img alt="logo" src="/img/logo.png" class="img-fluid" @load=" $emit('imgLoaded')">
          </router-link>
        </div>

      </div>
      <div class="sameWidth d-flex align-items-center justify-content-center" style="flex-grow: 3">
        <h2 v-if="smartPhone" class="mb-0 text-center ">{{centerText}}</h2>
        <h2 v-else class="mb-0 fw-bold text-center">{{centerText}}</h2>
      </div>
      <div class="sameWidth align-items-center justify-content-end" >
        <button v-if="welcomingPage" type="button"
                class="btn btn-outline-danger"
                @click="logout"
        >LOGOUT</button>
        <div v-else-if="smartPhone" class="sameWidth align-items-center justify-content-end">
          <NotificationBadge :text="currentVip"
                             :class="'nameUser p-0 text-center fw-bold fs-6'"
                             :disable="false"
                             :smartphoneNav = "true"
                             @openNotificationModal="$emit('openNotificationModal')"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>

.navBar{
  padding-right: 2vw;
  padding-left: 2vw;
}

.maxHNav{
  min-height: 6rem;
  height: 6rem;
  max-height: 6rem;
}

@media screen and (max-width: 768px)  {
  .maxHNav{
    min-height: 4rem;
    max-height: 4rem;
    height: 4rem;
  }
  .img-container{
    height: 100%;
  }
}

</style>