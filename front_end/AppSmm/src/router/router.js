import {createRouter, createWebHistory} from "vue-router";
import {routes} from "./routes.js";
import {store} from "../store/store.js"


const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

router.beforeEach(async (to)=> {
    if(to.name === 'canaleSingolo'){
        let vipName = ''
        if (store.getters.getVip.name === '') {
            let response = await fetch("/db/user/sessionVip",{
                method:"GET",
            });
            vipName = (await response.json())?.vip || '';
        }
        else {
            vipName = store.getters.getVip.name
        }

        let query = `/db/channel/check?channel=${to.params.nomeCanale}&user=${vipName}`;
        let res = await fetch(query,{
            method: "GET"
        })
        switch ((await res.json()).canAccessAs) {
            case 'admin':
            case 'creator':
            case 'follower':
                return true;
            default :
                return {name: 'Canali'};

        }
    }
    return true;
})

router.afterEach(() => {
    window.scrollTo(0,0);
})

export {router};