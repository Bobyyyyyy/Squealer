import {createApp} from 'vue'
import App from './App.vue'

import '../public/assets/custom.scss'


import './assets/style.css'
import tooltips from "./directives/tooltips.js";
import {router} from './router/router.js'
import {store} from "./store/store.js";


import NavBarWel from "./components/navbar/NavBar.vue";
import VipCard from "./components/handleVip/VipCard.vue";
import VipModal from "./components/handleVip/VipModal.vue";
import Post from "./components/post/Post.vue";
import HandleVIP from "./views/HandleVIP.vue";
import AddChannelModal from "./components/channels/AddChannelModal.vue";
import Channel from "./components/channels/Channel.vue";
import ChannelProfile from "./components/channels/ChannelProfile.vue";


const app = createApp(App);

app.use(router);
app.use(store);

app
    .component('NavBarWel', NavBarWel)
    .component('VipCard', VipCard)
    .component('VipModal', VipModal)
    .component('Post', Post)
    .component('HandleVIP', HandleVIP)
    .component("AddChannelModal", AddChannelModal)
    .component("Channel",Channel)
    .component("ChannelProfile",ChannelProfile)



app.directive('tooltip',tooltips)

app.mount('#app');

