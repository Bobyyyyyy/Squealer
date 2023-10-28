<script setup>
  import HeaderPost from "./HeaderPost.vue"
  import FooterPost from "./FooterPost.vue"
  const profilePicturePath ="/img/profilePicture.png"

  defineProps({
    user: String,
    dest: String,
    picProfile: String,
    content: String,
  })


</script>


<template>
  <div class="card mb-4 mt-1 setDim">
    <HeaderPost
        :name= "user"
        :channel="dest"
        :srcImg="picProfile" />
    <div class="d-flex flex-row justify-content-center">
      <!-- SI devono poter inserire anche altre cose, non solo immagini! Swtich in base al tipo di messaggio? -->
      <img @click="console.log(content)" :src="content"  alt="silly cat" class="img-fluid object-fit-fill" />
    </div>
    <FooterPost
        :likes= "500"
        :comments="500"
        :visual= "500" />
  </div>
</template>

<style>

  .setDim{
    width: auto;
    max-width: 44rem;
  }

  @media screen and (max-width: 768px) {
    .setDim{
      max-width: 100%;
    }
  }

</style>
