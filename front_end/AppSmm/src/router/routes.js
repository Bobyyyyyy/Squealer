import HandleVIP from "../views/HandleVIP.vue";
import Home from "../views/Home.vue"
import ChannelList from "../views/ChannelList.vue";
import VipProfile from "../views/VipProfile.vue";
import SideBar from "../components/sideBar/SideBar.vue";
import ChannelProfile from "../components/channels/ChannelProfile.vue";
import statsPage from "../views/statsPage.vue";

export const routes =[
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
        path:"/SMM/sceltavip",
        name:'HandleVIP',
        components: {
            welcomingPage: HandleVIP
        },
    },
    {
        path: "/SMM/Profilo",
        name: "Profilo",
        components: {
            sideBar: SideBar,
            SbOn: VipProfile,
        },
    },
    {
        path: "/SMM/Canali",
        name:"Canali",
        components: {
            sideBar: SideBar,
            SbOn: ChannelList
        },
    },
    {
        path: "/SMM/Canali/:nomeCanale" ,
        name:"listaCanali",
        components: {
            sideBar: SideBar,
            SbOn: ChannelProfile
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

     */
    {
        path:  "/SMM/CompraQuota",
        name:"Quota",
        components: {
            sideBar: SideBar,
        },
    },
    {
        path: "/SMM/AggiungiSqueal",
        name:"Squeal",
        components: {
            sideBar: SideBar,
        },
    },
    {
        path:"/SMM/*",
        redirect:  { name: "Home" }
    },
    {
        path: "/SMM/Statistiche",
        name:"Statistiche",
        components: {
            sideBar: SideBar,
            SbOn: statsPage
        },
    }
]



