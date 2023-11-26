import {createApp} from 'vue'
import App from './App.vue'

import '../../../public/assets/custom.scss'


import './assets/style.css'
import tooltips from "./directives/tooltips.js";


import NavBarWel from "./components/navbar/NavBar.vue";
import VipCard from "./components/handleVip/VipCard.vue";
import VipModal from "./components/handleVip/VipModal.vue";
import Post from "./components/post/Post.vue";
import HandleVIP from "./views/HandleVIP.vue";

import {router} from './router/router.js'
import {store} from "./store/store.js";


const app = createApp(App);

app.use(router);
app.use(store);

app
    .component('NavBarWel', NavBarWel)
    .component('VipCard', VipCard)
    .component('VipModal', VipModal)
    .component('Post', Post)
    .component('HandleVIP', HandleVIP)

app.directive('tooltip',tooltips)

app.mount('#app');