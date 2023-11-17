<script setup>
  import SideBarEL from "./SideBarEL.vue";
  import NavBarWel from "../navbar/NavBar.vue";
  import AddPostModal from "../post/AddPostModal.vue";
  import {Modal} from 'bootstrap'
  import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
  import {getPage} from "../../utils/functions.js";
  import {currentVip, sideBarElements, smm } from "../../utils/config.js"

  const windowWidth = ref(window.innerWidth);
  const modalState = reactive({Modal: null,})
  const beforeModalPage = ref('');

  const onWidthChange =  () => windowWidth.value = window.innerWidth
  onMounted(async () => {
    window.addEventListener('resize', onWidthChange);

    modalState.Modal = new Modal('#AddPostModal',{});
  })
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))

  const activeBut = ref(getPage());

  function openAppModal() {
    modalState.Modal.show()
  }
  function closeAppModal() {
    modalState.Modal.hide()
    activeBut.value = beforeModalPage.value
  }

  function setUpModal() {
    openAppModal();
    beforeModalPage.value = getPage();
  }


  const width = computed(() => windowWidth.value)
  const expanded = computed(() => width.value > 1450 );
  const smartPhone = computed(()=> width.value < 768);


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
    <!-- AGGIUNGERE NAVBAR NEL CASO SMARTPHONE -->
    <NavBarWel center-text=''
               class="setW100"

    />
  </div>

  <nav id="sideBar"
      class="d-flex justify-content-between position-fixed flex-shrink-0 border changeDirFlex setW100">

    <div class="d-flex changeDirFlex setW100 setHeight">
      <div v-if="!smartPhone" class="">
        <router-link to="/SMM/Profile" class="d-flex justify-content-center mb-3" @click="activeBut='Profile'">
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
                     if(name === 'Add Post') setUpModal()
                     else this.$router.push(getUrlPage(name))
                   }"
        />
      </ul>
    </div>
    <div v-if="!smartPhone" class="d-flex flex-column">
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nameUser" >
          {{smm}}
        </li>
        <li class="nameUser" >
          {{currentVip}}
        </li>
        <li>
            <a
                class="nav-link text-danger d-flex flex-row align-items-center mb-3"
               :class="expanded ? 'justify-content-start' : 'justify-content-center'"
               @click="
                        this.$router.push('/SMM/handlevip');
                        $emit('setInWel')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
              </svg>
              <p v-if="expanded" class="mb-0 ms-2">
                Choice VIP
              </p>
            </a>
        </li>
      </ul>
    </div>
  </nav>
  <AddPostModal
    @closeAppModal = "closeAppModal"
  />
</template>

<style>

  #sideBar{
    height: 100vh;
    padding-bottom: 2vh;
    padding-left: 1vh;
    width: 10vw;
    z-index: 2000;
  }
  .nameUser{
    padding-left:16px ;
  }

  .changeDirFlex{
    flex-direction: column !important;
  }

  @media screen and (max-width: 768px){
    #sideBar{
      position: fixed;
      height: auto;
      display: flex;
      flex-direction: row !important;
      justify-content: space-evenly !important;
      bottom: 0;
      align-items: end;
      padding-top: 0;
      padding-bottom: 0;
    }
    .changeDirFlex{
      flex-direction: row !important;
    }

    .setW100{
      width: 100% !important;
    }
    .setHeight{
      height: auto;
    }
  }
  
 @media screen and (max-width: 1450px) and (min-width: 768px) {
    #sideBar{
      width: 7%;
    }
 } 

</style>