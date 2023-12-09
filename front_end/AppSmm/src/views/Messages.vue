<script setup>
import Post from "../components/post/Post.vue";

</script>

<template>
  <div class="centralDiv">
    <div class="marginCD">
      <h4 class="m-0 text-center mb-3">Lista Squeal indirizzati a singoli</h4>
      <div id="searchBar">
        <div  id="inputGroup" class="d-flex flex-row justify-content-start ">
          <div class="input-group">
            <input type="text" class="form-control mb-1" placeholder="Search User...">
            <button type="submit" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-evenly flex-wrap TEST ">
        <Post v-for="i in 10" :key="i" />
      </div>
    </div>
  </div>
</template>

<style>
  .TEST{
    margin-left: 10%;
    margin-right: 10%;
  }

  #searchBar{
    max-width: 50%;
  }

  #inputGroup{
    margin-left: 10%;
  }
</style>