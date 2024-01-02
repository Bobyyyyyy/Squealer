import { Outlet, NavLink } from "react-router-dom";
import '../index.css'
import React, {useEffect, useState} from "react";
import {
    AddIcon,
    ChannelIcon,
    HomeIcon,
    SearchIcon,
    UserIcon
} from "../components/assets/index.jsx"
import {
    deleteToastNotification,
    getNotification,
    getToastNotification
} from "../utils/usefulFunctions.js";
import NotificationButton from "./NotificationButton.jsx";
import CustomToast from "../components/toasts/CustomToast.jsx";


export default function RootLayout() {

    const [notifications, setNotifications] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastNotification, setToastNotification] = useState(null)
    const CHECK_NOTIFICATION_TIME = 5000;

    const navigationButtons = [
        {
            id: 0,
            icon: HomeIcon,
            name: "home",
            route: "/"
        },
        {
            id: 1,
            icon: SearchIcon,
            name: "search",
            route: "search"
        },
        {
            id: 2,
            icon: AddIcon,
            name: "add post",
            route: "addpost"
        },

        {
            id: 3,
            icon: ChannelIcon,
            name: "channels",
            route: "channels"
        },
        {
            id: 4,
            icon:UserIcon,
            name: "profile",
            route: "profile"
        },
    ];


    const handleToastNotification = () => {
        const TOAST_TIME = 1500;
        const notificationObj = getToastNotification();
        if (notificationObj !== null) {
            setToastNotification(notificationObj);
            setShowToast(true);
            setTimeout(()=>{
                setShowToast(false);
                deleteToastNotification();
            }, TOAST_TIME)
        }
    }

    useEffect(() => {
        handleToastNotification();
        const interval = setInterval(async () => {
            let notificationRes = await getNotification();
            setNotifications(notificationRes);
        }, CHECK_NOTIFICATION_TIME);
        return () => clearInterval(interval);
    }, []);


    return (
        <div>
            <header>
                <nav className={"fixed bottom-0 flex w-full flex-wrap items-center justify-between bg-[#FBFBFB] py-2 text-black-500 shadow-lg focus:text-neutral-700  lg:py-4 z-10"}>
                    <div className={"flex w-full flex-wrap items-center justify-around px-3 content-around"}>
                        {navigationButtons.map( (item) => (
                            <NavLink
                                to={item.route}
                                className={({isActive}) => `w-8 h-8 ${isActive && ' '}`}
                                key={item.name}
                            >
                                {({isActive}) => {
                                    return (isActive) ? item.icon.active : item.icon.inactive;
                                }}
                            </NavLink>
                        ))}
                    </div>
                </nav>
                {notifications !== null &&
                    <NotificationButton notifications={notifications} setNotifications={setNotifications} />
                }
                {showToast &&
                    <CustomToast message={toastNotification.message} type={toastNotification.type} />
                }
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}