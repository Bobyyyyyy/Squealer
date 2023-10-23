
<script setup>
import Channel from "../components/Channel.vue";
</script>

<template>
    <div class="centralDiv">
      <div class="marginCD">
        <h1 class="text-center">Lista Canali</h1>
        <div class="d-flex flex-row justify-content-between">
          <div id="filterCh" class="input-group">
            <input  type="text" class="form-control " placeholder="Search..." aria-label="Username" aria-describedby="basic-addon1">
            <button type="submit" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </div>
          <div>
            <button class="btn btn-secondary ms-2" >Add</button>
          </div>
        </div>
        <div class="d-flex justify-content-center flex-column shadow-sm">
          <Channel v-for="i in 20"
          ></Channel>
        </div>
      </div>
    </div>
</template>


<style>


  #filterCh{
    width: 50%;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 768px) {
    #filterCh{
      width: auto;
    }
  }



</style>