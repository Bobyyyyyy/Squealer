import HandleVIP from "../views/HandleVIP.vue";
import Home from "../views/Home.vue"
import ChannelList from "../views/ChannelList.vue";
import VipProfile from "../views/VipProfile.vue";
import Messages from "../views/Messages.vue";

const baseDir = window.location.origin;


const routes =[
    {
        path:"/SMM_App/",
        redirect: '/SMM_App/Pippo/home',
    },
    {
        path:"/",
        redirect: "/SMM_App/"
    },
    {
        path:"/SMM_App/:user/home",
        name:'Home',
        component: Home,
    },
    {
        path:"/SMM_App/:user/handlevip",
        name:'HandleVIP',
        component: HandleVIP,
    },
    {
        path: "/SMM_App/:user/:vipuser/Channels",
        name:"Channels",
        components: {
            SbOn: ChannelList
        },
    },
    {
        path: "/SMM_App/:user/:vipuser/Profile",
        name:"Profile",
        components: {
            SbOn: VipProfile,
        },
    },
    {
        path: "/SMM_App/:user/:vipuser/Messages",
        name:"Messages",
        components: {
            SbOn: Messages,
        },
    }
]


export default {
    routes,
    baseDir
};