<script setup>

  import {smartPhone} from "../../utils/config.js";
  import Dropdown from "../Dropdown.vue";
  import {logout} from "../../utils/functions.js";


  defineProps({
    centerText: String,
    welcomingPage: Boolean,
  })


</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary maxHNav navBar">
    <div class="d-flex flex-row justify-content-start maxHNav">
      <div class="maxHNav sameWidth">
        <img v-if="welcomingPage" alt="logo" src="/img/logo.png" class="h-100 img-fluid object-fit-contain"  @load=" $emit('imgLoaded')">
        <router-link v-else to="/SMM/Profile" class="d-flex justify-content-center mb-3 h-100">
          <img alt="logo" src="/img/logo.png" class="img-fluid" @load=" $emit('imgLoaded')">
        </router-link>
      </div>
      <div class="sameWidth d-flex align-items-center justify-content-center" style="flex-grow: 2">
        <h2 v-if="smartPhone" class="mb-0 text-center ">{{centerText}}</h2>
        <h2 v-else class="mb-0 fw-bold text-center">{{centerText}}</h2>
      </div>
      <div class="sameWidth align-items-center justify-content-end" >
        <button v-if="welcomingPage" type="button"
                class="btn btn-outline-danger"
                @click="logout"
        >LOGOUT</button>
        <Dropdown v-else-if="smartPhone"
                  classButton="btn btn-outline-danger"
                  classDropDown="dropstart"
                  updateRef="updatePage"
                  :dropItems="['Logout', 'cambia VIP']"
                  @updatePage="async (el) => {
                    if (el === 'cambia VIP')  $router.push('/AppSmm/handlevip');
                    else await logout();
                  }"
        />
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
  max-height: 10vh;
}

@media screen and (max-width: 768px)  {
  .maxHNav{
    min-height: 4rem;
    max-height: 6vh;
  }
}

</style>