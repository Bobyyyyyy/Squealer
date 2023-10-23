import {createApp} from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import routes from './router/routes.js'
import {createRouter, createWebHistory} from "vue-router";
import NavBarWel from "./components/NavBarWel.vue";
import VipCard from "./components/handleVip/VipCard.vue";
import VipModal from "./components/handleVip/VipModal.vue";
import Post from "./components/post/Post.vue";
import HandleVIP from "./views/HandleVIP.vue";

const app = createApp(App);

const router = createRouter({
    history: createWebHistory(),
    routes: routes.routes,
});

app.use(router);

app
    .component('NavBarWel', NavBarWel)
    .component('VipCard', VipCard)
    .component('VipModal', VipModal)
    .component('Post', Post)
    .component('HandleVIP', HandleVIP)

app.mount('#app');