<script setup>
import {computed, ref} from "vue";
  import {useStore} from "vuex";
  import Post from "../post/Post.vue";
  import {postType, sortPosts} from "../../utilsSMM";

  const store = useStore()

const typePostFilter = ref('Type');
const sortFilter = ref('Sort');

function updateSortFilter(newText){
  sortFilter.value=newText
}
function updateTextType(newText){
  typePostFilter.value=newText
}

  let chInfo = computed(()=> store.state.currentChannel)

</script>

<template>
  <div class="centralDiv">
    <div class="marginCD">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-center w-100">
          <div class="maxWidth">
            <img src="https://picsum.photos/id/1/300/300" class="img-fluid" alt="gatto che ormai ha stufato">
          </div>
        </div>
        <h2 class="m-1 text-center">{{ chInfo.chName }}</h2>
        <h5 class="m-1 text-center">{{ chInfo.chDescription }}</h5>
      </div>
      <div class="d-flex flex-row justify-content-end">
        <div class="dropdown buttonDropDown">
          <a class="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{typePostFilter}}</a>
          <ul class="dropdown-menu">
            <li v-for="(el,i) in postType" :key="i" ><a class="dropdown-item" @click="updateTextType(el)">{{ el }}</a></li>
          </ul>
        </div>
        <div class="dropdown ms-1 buttonDropDown">
          <a class="btn btn-primary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{ sortFilter }}</a>
          <ul class="dropdown-menu">
            <li v-for="(el,i) in sortPosts" :key="i" ><a class="dropdown-item" @click="updateSortFilter(el)">{{ el }}</a></li>
          </ul>
        </div>
      </div>
      <div class="d-flex flex-row flex-wrap justify-content-around mt-3">
        <Post v-for="(el,i) in 10" :key="i"
        />
      </div>
    </div>
  </div>
</template>

<style>
  .maxWidth{
    max-width:  20vh;
  }
</style>