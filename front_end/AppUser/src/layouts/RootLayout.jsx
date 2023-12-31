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
import {getUsernameFromSessionStore} from "../utils/usefulFunctions.js";
import NotificationButton from "./NotificationButton.jsx";


export default function RootLayout() {

    const [notifications, setNotifications] = useState([]);
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

    const getNotification = async () => {
        let res = await fetch(`/db/notification?user=${getUsernameFromSessionStore()}`, {
            method:'GET'
        });
        if (res.ok) {
            res = await res.json();
            if (Object.keys(res).length !== 0) {
                setNotifications(res);
            }
        }

    }

    useEffect(() => {
        getNotification();
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
                {notifications.length !== 0 &&
                    <NotificationButton notifications={notifications} setNotifications={setNotifications} />
                }
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}