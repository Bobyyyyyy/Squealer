import {useMemo, useEffect, useState} from "react";
import {HomeIcon, SearchIcon, AddIcon, UserIcon, ChannelIcon, SettingIcon, Logout} from "../../assets/index.jsx";
import MobileNavbar from "./mobile/MobileNavbar.jsx";
import {useNavigate, NavLink} from "react-router-dom";
import Sidebar from "./pc/Sidebar.jsx";
function Navbar () {

    const navigate = useNavigate();

    const navigationButtons = [
        {id: 0, icon: HomeIcon, name: "home", route: "/"},
        {id: 1, icon: SearchIcon, name: "search", route: "search"},
        {id: 2, icon: AddIcon, name: "add post", route: "addpost"},
        {id: 3, icon: ChannelIcon, name: "channels", route: "channels"},
        {id: 4, icon: UserIcon, name: "profile", route: "profile"},
        {id: 5, icon: SettingIcon, name: "settings", route: "settings"}
    ];

    /*
    const settingButtons = [
        {id: 5, icon: SettingIcon, name: "settingsIcons", route: "/settingsIcons"},
        {id: 6, icon: Logout, name: "log out"}
    ];

     */
    function getLastPartUrl(url) {
        const path = url.split('/');
        return path.at(-1);
    }

    const [activeButton, setActiveButton] = useState(
        () => {
            let currentPage = getLastPartUrl(window.location.pathname);
            console.log("curr: "+currentPage)
            let correctPage = navigationButtons.filter(item => item.route === currentPage);
            console.log("corr:")
            console.log(correctPage);

        }
    );

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function changeActiveButton({id}) {
        console.log(activeButton);
        console.log('prima: '+window.location.pathname);
        console.log('sas: ' +window.location.pathname.split("/").pop());
        if ( activeButton !== id || (window.location.pathname.split("/").pop() !== navigationButtons[activeButton].route) ) {
            navigate(navigationButtons[id].route);
            setActiveButton(id);
        }
        console.log('dopo: '+window.location.pathname);
    }
    /*
    return (windowWidth <= 510) ?
        (
        <MobileNavbar
            navigationButtons={navigationButtons}
            changeActiveButton={changeActiveButton}
            activeButton={activeButton}
        />
        ) : (
        <Sidebar
            windowWidth = {windowWidth}
            navigationButtons={navigationButtons}
            changeActiveButton={changeActiveButton}
            activeButton={activeButton}
        />
        );

     */
    return (
        <>

        </>
    );
}

export default Navbar;