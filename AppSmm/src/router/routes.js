import HandleVIP from "../views/HandleVIP.vue";
import Home from "../views/Home.vue"
import ChannelList from "../views/ChannelList.vue";
import VipProfile from "../views/VipProfile.vue";
import Messages from "../views/Messages.vue";
import Post from "../components/post/Post.vue";
import {getSMMname} from "../utils";

const baseDir = window.location.origin;


const routes =[
    {
        path:"/SMM/:user/",
        redirect:  { name: "Home" }
    },
    {
        path:"/SMM/:user/home",
        name:'Home',
        component: Home,
    },
    {
        path:"/SMM/:user/handlevip",
        name:'HandleVIP',
        component: HandleVIP,
    },
    {
        path: "/SMM/:user/:vip/Channels",
        name:"Channels",
        components: {
            SbOn: ChannelList
        },
    },
    {
        path: "/SMM/:user/:vip/Profile",
        name:"Profile",
        components: {
            SbOn: VipProfile,
        },
    },
    {
        path: "/SMM/:user/:vip/Messages",
        name:"Messages",
        components: {
            SbOn: Messages,
        },
    },
    {
        path:"/SMM/:user/handlevip",
        name:'HandleVIP',
        component: HandleVIP,
    },
    {
        path: "/SMM/:user/:vip/BuyQuota",
        name:"Channels",
        components: {
            SbOn: ChannelList
        },
    },
    {
        path: "/SMM/:user/:vip/AddPost",
        name:"Profile",
        components: {
            SbOn: Post
        },
    }
]


export default {
    routes,
    baseDir
};