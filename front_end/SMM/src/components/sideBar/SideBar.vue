<script setup>
  import SideBarEL from "./SideBarEL.vue";
  import NavBar from "../navbar/NavBar.vue";
  import AddPostModal from "../post/AddPostModal.vue";
  import {Modal} from 'bootstrap'
  import {onMounted, reactive, ref} from "vue";
  import {getPage} from "../../utils/functions.js";
  import {currentVip, expanded, sideBarElements, smartPhone, smm} from "../../utils/config.js"
  import BuyQuotaModal from "../../quota/buyQuotaModal.vue";
  import Dropdown from "../Dropdown.vue";
  import {logout} from "../../utils/functions.js";
  import NotificationBadge from "../notification/NotificationBadge.vue";
  import NotificationModal from "../notification/notificationModal.vue";

  const modalState = reactive({addPostModal: null})
  const beforeModalPage = ref('');
  const quotaModal = ref();
  const notificationModal = ref()

  onMounted(async () => {
    modalState.addPostModal = new Modal('#AddPostModal',{});
    modalState.notificationModal = new Modal('#notModal',{});
  })

  const activeBut = ref(getPage());

  function openAppModal() {
    modalState.addPostModal.show()
  }
  function closeAppModal(addedPost) {
    modalState.addPostModal.hide()
    activeBut.value = beforeModalPage.value
    if(addedPost && activeBut.value === 'Profilo') location.reload();
  }

  function openNotificationModal () {notificationModal.value.openModal()}

  function setupAppModal() {
    openAppModal();
    beforeModalPage.value = getPage();
  }
  function setupQuotaModal() {
    quotaModal.value.openModal();
    beforeModalPage.value = getPage();
  }

  function getUrlPage(page){
    return "/SMM/"+ page.split(' ').join('');
  }

  //HISTORY:    Forse si può fare utilizzano le lifecycle hooks
  window.addEventListener("popstate",()=>{
    activeBut.value = window.location.pathname.split('/').slice(-1).join().split(/(?=[A-Z])/).join(' ');
  },false)

</script>


<template>
  <div v-if="smartPhone">
    <NavBar center-text=''
            class="setW100"
            :welcomingPage = "false"
            centerText="Squealer"
    />
  </div>

  <nav id="sideBar"
      class="d-flex justify-content-between position-fixed flex-shrink-0 border changeDirFlex setW100">
    <div class="d-flex changeDirFlex setW100 setHeight">
      <div v-if="!smartPhone" class="">
        <router-link to="/SMM/Profilo" class="d-flex justify-content-center mb-3" @click="activeBut='Profilo'">
          <div class="fs-4 w-50 d-flex align-self-center">
            <img alt="logo" src="/img/logo.png" class="img-fluid">
          </div>
        </router-link>
        <hr>
      </div>

      <ul class="nav nav-pills mb-auto setW100"
          :class="smartPhone? 'flex-row justify-content-around flex-shrink-0' :'flex-column' ">
        <SideBarEL v-for="element in sideBarElements"
                   :key="element.text"
                   ref="elementSideBar"
                   :item="element"
                   :expanded="expanded"
                   :active = "activeBut"
                   @changeActive="(name) => {
                     activeBut = name
                   }"

                   @pushTo = "(name) => {
                     if(name === 'Aggiungi Squeal') setupAppModal()
                     else if (name === 'Compra Quota') setupQuotaModal();
                     else  $router.push(getUrlPage(name))
                   }"
        />
      </ul>
    </div>
    <div v-if="!smartPhone" class="d-flex flex-column align-items-center">
      <ul class="nav nav-pills flex-column mb-auto">
        <li>
          <NotificationBadge :text="currentVip"
                             :class="'nameUser p-0 text-center fw-bold fs-5'"
                             @openNotificationModal="openNotificationModal"
                              />
        </li>
        <li>
          <button type="button" class="btn text-danger d-flex flex-row align-items-center"
                  @click=" $router.push('/SMM/sceltavip')"
                  :class="expanded ? 'justify-content-start' : 'justify-content-center'">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
              <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
            </svg>
            <p v-if="expanded" class="mb-0 ms-2">
              Scegli VIP
            </p>
          </button>
        </li>
        <Dropdown class="align-self-center"
            :filterRef="smm"
            updateRef="logout"
            :dropItems = "['logout']"
            classButton="btn-outline-danger"
            @logout="async () => await logout()"
        />
        <!-- TODO: SISTEMARE VISTA TABLET -->
      </ul>
    </div>
  </nav>
  <AddPostModal @closeAppModal = "closeAppModal" />
  <buyQuotaModal ref="quotaModal" />
  <NotificationModal ref="notificationModal" />
</template>

<style scoped>

  #sideBar{
    height: 100vh;
    padding-bottom: 2vh;
    padding-left: 1vh;
    width: 12vw;
    background-color: #f5f5f5;
    z-index: 1;
  }
  .nameUser{
    padding-left:16px ;
  }

  .changeDirFlex{
    flex-direction: column !important;
  }

  @media screen and (max-width: 768px){
    #sideBar{
      height: 4rem;
      display: flex;
      flex-direction: row !important;
      justify-content: space-evenly !important;
      bottom: 0;
      align-items: end;
      padding-top: 0;
      padding-bottom: 0;
      z-index: 1001;
    }
    .changeDirFlex{
      flex-direction: row !important;
    }

    .setW100{
      width: 100% !important;
    }
    .setHeight{
      height: 100%;
    }
  }
  
 @media screen and (max-width: 1450px) and (min-width: 768px) {
    #sideBar{
      width: 7%;
    }
 } 

</style>