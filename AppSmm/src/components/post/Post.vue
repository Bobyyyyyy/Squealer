<script setup>
  import HeaderPost from "./HeaderPost.vue"
  import FooterPost from "./FooterPost.vue"
  const profilePicturePath ="/img/profilePicture.png"
  /*
  defineProps({
    user: Object,
    postDB : Object,
  })
*/
  const user = {
    name: "Popi",
    channel:"cocainaCH",
    img: profilePicturePath,
  }
  const postDB = {
    img: profilePicturePath,
    reaction:{
      like:5,
    },
    comments:{
      number:10,
    },
    views:500,
  }

</script>


<template>
  <div class="card mb-4 mt-1 setDim">
    <HeaderPost
        :name= "user.name"
        :channel="user.channel"
        :srcImg="user.img" />
    <div class="d-flex flex-row justify-content-center">
      <!-- SI devono poter inserire anche altre cose, non solo immagini! Swtich in base al tipo di messaggio? -->
      <img :src=user.img  alt="silly cat" class="img-fluid object-fit-fill" />
    </div>
    <FooterPost
        :likes= "postDB.reaction.like"
        :comments="postDB.comments.number"
        :visual="postDB.views" />
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
