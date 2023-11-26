import './index.css'

import NotFound from "./pages/notFound/NotFound.jsx";
import Home from "./pages/home/Home.jsx";
import Channels from "./pages/channels/Channels.jsx";
import AddPost from "./pages/addPost/AddPost.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Search from "./pages/search/Search.jsx";
import Settings from "./pages/settings/Settings.jsx";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import RootLayout from "./layouts/RootLayout.jsx";
import {setQuotaInLocStor, setUsernameInLocStor} from "./components/utils/usefulFunctions.js";

function App() {
    const [user, setUser] = useState(null);
    const savedUser = useRef(false);

    const changePic = async () => {
        {
            let res = await fetch("/db/user/",{
                method:"PUT",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( {newProfilePic: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADEElEQVRYR+2XWahOURTH3VwKUWQK6RqiDJklUjfyRogXpG4eKHLFG6WQeJGEZMiQwovZ61UyJDJlTuISIi5JKEP8fnV2fff0nckXT3b9+s7Ze+21/2edvddZX1WLfK07ZhtgGnTOmPKO8dOwCt5kua/KMmC8K1yBGvgOL+BXwjz99YJW0Ahj4W3aGnkEbMfBEjgOdfApQ3QHxg/ATNgG9ZUKeBI9vZEwvHlaF4wM/1PoV6mAD5GDjnlWLrHJNS/rFbjhnkFrOFdQQC3236A3NCXNTRPgmJtvTMGF4+ZX6RgHZTdumoCBTHoI92B29DRFtBi1ozAY9PWo3OQ0AaOYcA2ORQKKLB5sFTALRsP1/wKKRmBkFLZT/M5IiL9Zz2Z2LNdO0jkdfJ03igroxITX4FHaB19iDtxcU6O+M/zej4235X4BmJb9loS80MwsKw+swHoTJNm9jLz1TIiAR08fWxLGEx2X2odUPJfOnzFHF6L7ibH+au4PQSP0TVrc/qwIaHMWJsEwuJ3mrGRsONc3oQGmVCpgOQ42R2H0Ok/bitFS0D4x/Hkj4FfQLNYGxkPZhFKiytR9CT7DAKi4HtD3ItgJfmL9zl9OCMME+q0bFO2c3VnhyrMH2uPETbUxcupGdIMdgbvRAkP5nQNu1JawC1bCD0gtYMoJ8Pyr3uQzBDzPlTTzxx0wKSmsWT6IC6jDwA0Xig/fX0hG5US42223EhT6RTQJWSHZ3oMb82CwLxWwjs7VYOGp0h3wIOPRc1U9+BgEi2EhmBnXwFp9BwHzI1VWLob+YsbCYTivgGBvwvJV+JrnwWEFWMU+BsM+Gc7nXFyzogKcUwsmKB+2vwKWgcliDxiiIu1PBOh/L/ihqldASLUmECsgm+nTc78f1qcoyiNAP/rzyxn2lH9YrDcbFPAKDL/HLRSO7oMTUWTS0m8eAfrR3wgIp8V1v0KTFyYLRVg+h/a3BbjOc+ihAJ+6Efr8YwH+a6oJAoyCikJrx0U3+GiYSvrjlzVRhw+Q1PSjP8s2q6vQjHh1EJAy/+8O/QaNqqk0M1e3UgAAAABJRU5ErkJggg=="})
            })
            let userMod = await res.json();
            console.log("userMod", userMod);
        }
    }

    useEffect(() => {
        setUsernameInLocStor();
        setQuotaInLocStor();
        //changePic();
    }, []);


    return (
        <BrowserRouter basename={"/user"}>
            <Routes>
                <Route path="/" element={<RootLayout />} >
                    <Route index element={<Home />} />
                    <Route  path="profile" element={<Profile />} />
                    <Route  path="search" element={<Search />} />
                    <Route  path="channels" element={<Channels />} />
                    <Route  path="settings" element={<Settings />} />
                    <Route  path="addpost" element={<AddPost />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
    </BrowserRouter>
    );

}

export default App;