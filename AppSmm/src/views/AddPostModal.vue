<script setup>

import {computed, ref} from "vue";
import {currentVip} from "../utils";

  const postType = ref('Select type')
  const imgUrl = ref('')
  let currentImg = ref('')
  const showImg = ref(false)

  async function createPost() {
    console.log(currentVip.value)
    let cnt = postType.value == 'image' ? imgUrl.value : document.getElementById("textPost").value;

    let post = {
      name: currentVip.value,
      contentType: postType.value,
      content: cnt,
      dateOfCreation: Date.now(),
      receiver: document.getElementById("destPost").value,
    }


    console.log(JSON.stringify(post))
    console.log(JSON.parse(JSON.stringify(post)))
    console.log("INIZIO FETCH")

      const res = await fetch("/db/addPost",{
        method: "POST",
        body: JSON.stringify(post),
        headers: {
          "Content-Type":"application/json"
        }
      })

      const result = await res.json();
      console.log(result);

  }

  function reset(){
    postType.value ='Select type'
    imgUrl.value = ''
    currentImg.value= ''
    showImg.value = false
  }

/*TODO
  fare richiesta e prendere i canali in cui posso scrivere, per far diminuire il numero di errori
  capire come gestire la risposta del server in caso in cui l'utente non esista
 */

</script>

<template>
  <div class="modal fade w-100 h-100" id="AddPostModal"  tabindex="-1" aria-hidden="true">
    <div class="d-flex centralDiv z-1 align-items-center">
    <div class="modal-dialog modalDim">
      <div class="modal-content flex-">
        <form id="addPostForm">
          <div class="modal-body d-flex flex-row justify-content-between">
            <div>
              <label for="destPost" class="form-label">Destinatario</label>
              <input type="text" class="form-control" id="destPost" value="PippoVIP" required>
              <!-- Aggiungere un pazzo validatore -->
            </div>
            <div class="btn-group">
              <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {{ postType }}
              </button>
              <ul class="dropdown-menu">
                <li class="dropdown-item" role="button" @click="postType = 'text'"> text </li>
                <li class="dropdown-item" role="button" @click="postType = 'geolocalization'"> geolocalization </li>
                <li class="dropdown-item" role="button" @click="postType = 'image'"> image </li>
              </ul>
            </div>
          </div>
          <div class="paddingEqual">
            <textarea rows="6" id="textPost" v-if=" postType == 'text'" class="form-control"></textarea>
            <div v-if="postType == 'image'" class="d-flex flex-column">
              <div class="input-group d-flex flex-row">
                <input class="w-75" type="text" placeholder="insert URL" id="pathImg" v-model="imgUrl" >
                <button type="button" class="btn btn-secondary" @click=" currentImg = imgUrl; showImg = true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                  </svg>
                </button>
              </div>
              <div v-if="showImg" id="imgAddPost" class=" d-flex flex-row align-self-center w-75">
                <img class="img-fluid" :src="currentImg" alt="NON FUNZIONA UN CAZZO">
              </div>
              <!--Aggiungere altri tipi di post-->
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger"
                    @click="$emit('closeAppModal')"
            >Indietro</button>
            <button class="btn btn-primary" type="button" @click="createPost(); reset()"> Crea Post </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  </div>
</template>

<style>
  #imgAddPost{
    padding: 2%;
    border: 10px;
  }

  #AddPostModal{
    height: 50%;
    width: 50%;
  }
  .modalDim{
    min-width: 50%;
    min-height: 50%;
  }

  .paddingEqual{
    padding-left: var(--bs-modal-padding);
    padding-right: var(--bs-modal-padding);
    padding-bottom: var(--bs-modal-padding);
  }

</style>