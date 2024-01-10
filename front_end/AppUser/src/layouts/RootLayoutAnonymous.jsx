import { Outlet, NavLink } from "react-router-dom";
import '../index.css'
import React from "react";
import {
    ChannelIcon,
    HomeIcon,
    UserIcon
} from "../components/assets/index.jsx"



function RootLayoutAnonymous() {

    const navigationButtons = [
        {
            id: 0,
            icon: HomeIcon,
            name: "home",
            route: "/"
        },
        {
            id: 1,
            icon: ChannelIcon,
            name: "channels",
            route: "channels"
        },
        {
            id: 2,
            icon: UserIcon,
            name: "profile",
            route: "profile"
        },
    ];


    return (
        <div>
            <header>
                <nav className={"fixed bottom-0 flex w-full flex-wrap items-center justify-between bg-[#FBFBFB] py-2 text-black-500 shadow-lg focus:text-neutral-700  lg:py-4 z-10"}>
                    <div className={"flex w-full flex-wrap items-center justify-around px-3 content-around"}>
                        {navigationButtons.map( (item) => (
                            <NavLink
                                aria-label={`vai alla pagina ${item.name}`}
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
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default RootLayoutAnonymous;