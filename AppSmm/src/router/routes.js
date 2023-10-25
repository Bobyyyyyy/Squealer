import HandleVIP from "../views/HandleVIP.vue";
import Home from "../views/Home.vue"
import ChannelList from "../views/ChannelList.vue";
import VipProfile from "../views/VipProfile.vue";
import Messages from "../views/Messages.vue";
import Post from "../components/post/Post.vue";
import SideBar from "../components/sideBar/SideBar.vue";
import VipCard from "../components/handleVip/VipCard.vue";

const routes =[
    {
        path:"/SMM",
        redirect:  { name: "Home" }
    },
    {
        path:"/SMM/",
        redirect:  { name: "Home" }
    },
    {
        path:"/SMM/home",
        name:'Home',
        components: {
            welcomingPage: Home
        },
    },
    {
        path:"/SMM/handlevip",
        name:'HandleVIP',
        components: {
            welcomingPage:HandleVIP
        },
    },
    {
        path: "/SMM/Profile",
        name: "Profile",
        components: {
            sideBar: SideBar,
            SbOn: VipProfile,
        },
    },
    {
        path: "/SMM/Channels",
        name:"Channels",
        components: {
            sideBar: SideBar,
            SbOn: ChannelList
        },
    },
    /*
    {
        path: "/SMM/:user/:vip/Messages",
        name:"Messages",
        components: {
            sideBar: SideBar,
            SbOn: Messages,
        },
    },
    {
        path: "/SMM/:user/:vip/BuyQuota",
        name:"Channels",
        components: {
            sideBar: SideBar,
            SbOn: ChannelList
        },
    },
    */
    {
        path: "/SMM/AddPost",
        name:"Post",
        components: {
            sideBar: SideBar,
        },
    },
    {
        path:"/SMM/*",
        redirect:  { name: "Home" }
    },
    /*
    {
        path: "/SMM/:user/:vip/Stats",
        name:"Stats",
        components: {
            sideBar: SideBar,
            SbOn: VipCard
        },
    }

     */
]


export default {
    routes,
};