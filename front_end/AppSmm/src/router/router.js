import {createRouter, createWebHistory} from "vue-router";
import {currentVip} from "../utils/config.js";
import {routes} from "./routes.js";


const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

router.beforeEach(async (to)=> {
    if(to.name === 'channelView'){
        let query = `/db/channel/check?channel=${to.params.channelName}&user=${currentVip.value}`;
        let res = await fetch(query,{
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

router.afterEach(() => {
    window.scrollTo(0,0);
})

export {router};