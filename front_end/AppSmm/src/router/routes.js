import HandleVIP from "../views/HandleVIP.vue";
import Home from "../views/Home.vue"
import ChannelList from "../views/ChannelList.vue";
import VipProfile from "../views/VipProfile.vue";
import SideBar from "../components/sideBar/SideBar.vue";
import ChannelProfile from "../components/channels/ChannelProfile.vue";
import statsPage from "../views/statsPage.vue";

export const routes =[
    {
        path:"/AppSmm/home",
        name:'Home',
        components: {
            welcomingPage: Home
        },
    },
    {
        path:"/AppSmm/sceltavip",
        name:'HandleVIP',
        components: {
            welcomingPage: HandleVIP
        },
    },
    {
        path: "/AppSmm/Profilo",
        name: "Profilo",
        components: {
            sideBar: SideBar,
            SbOn: VipProfile,
        },
    },
    {
        path: "/AppSmm/Canali",
        name:"Canali",
        components: {
            sideBar: SideBar,
            SbOn: ChannelList
        },
    },
    {
        path: "/AppSmm/Canali/:nomeCanale" ,
        name:"canaleSingolo",
        components: {
            sideBar: SideBar,
            SbOn: ChannelProfile
        },
    },

    {
        path:  "/AppSmm/CompraQuota",
        name:"Quota",
        components: {
            sideBar: SideBar,
        },
    },
    {
        path: "/AppSmm/AggiungiSqueal",
        name:"Squeal",
        components: {
            sideBar: SideBar,
        },
    },
    {
        path: "/AppSmm/Statistiche",
        name:"Statistiche",
        components: {
            sideBar: SideBar,
            SbOn: statsPage
        },
    },
    {
        path:"/AppSmm/",
        redirect:  { name: "Home" }
    },
    {
        path: "/assets_vue/",
        redirect:  { name: "Home" }
    },
    {
        path: "/*",
        redirect:  { name: "Home" }
    },
]



