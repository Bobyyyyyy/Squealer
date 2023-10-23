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
        path:"/SMM/:user/",
        redirect:  { name: "Home" }
    },
    {
        path:"/SMM/:user/home",
        name:'Home',
        components: {
            welcomingPage: Home
        },
        sensitive: true,
    },
    {
        path:"/SMM/:user/handlevip",
        name:'HandleVIP',
        components: {
            welcomingPage:HandleVIP
        },
    },
    {
        path: "/SMM/:user/:vip",
        redirect: {name:"Profile"}
    },
    {
        path: "/SMM/:user/:vip/Profile",
        name: "Profile",
        components: {
            sideBar: SideBar,
            SbOn: VipProfile,
        },
    },
    {
        path: "/SMM/:user/:vip/Channels",
        name:"Channels",
        components: {
            sideBar: SideBar,
            SbOn: ChannelList
        },
    },
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
    {
        path: "/SMM/:user/:vip/AddPost",
        name:"Post",
        components: {
            sideBar: SideBar,
            SbOn: Post
        },
    },
    {
        path: "/SMM/:user/:vip/Stats",
        name:"Stats",
        components: {
            sideBar: SideBar,
            SbOn: VipCard
        },
    }
]


export default {
    routes,
};