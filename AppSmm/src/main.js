import {createApp} from 'vue'
import {createStore} from 'vuex'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import "../../public/style.css"

import routes from './router/routes.js'
import {createRouter, createWebHistory} from "vue-router";
import tooltips from "./directives/tooltips";


import NavBarWel from "./components/NavBarWel.vue";
import VipCard from "./components/handleVip/VipCard.vue";
import VipModal from "./components/handleVip/VipModal.vue";
import Post from "./components/post/Post.vue";
import HandleVIP from "./views/HandleVIP.vue";
import {getVIPname} from "./utilsSMM";


const app = createApp(App);

const store = createStore({
    state () {
        return {
            currentChannel: {
                chName: '',
                chDescription: '',
            }
        }
    },
    mutations: {
        uploadChannel (state,channelInfo) {
            state.currentChannel.chName = channelInfo.chName;
            state.currentChannel.chDescription = channelInfo.chDescription;
        }
    },
})

const router = createRouter({
    history: createWebHistory(),
    routes: routes.routes,
});

router.beforeEach(async (to,from)=> {
    if(to.name === 'channelView'){
        console.log(to)
        let res = await fetch(`/db/channelCheck?channel=${to.params.channelName}&user=${getVIPname()}`,{
            method: "GET"
        })
        switch ((await res.json()).canAccessAs) {
            /* AGGIUNERE LE VIEW DIVERSE IN BASE AL TIPO DI UTENTE */
            case 'admin':
            case 'creator':
            case 'follower':
                return true;
            case 'noEntry': {
                return {name: 'Channels'};
            }
        }
    }
    return true;
})


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