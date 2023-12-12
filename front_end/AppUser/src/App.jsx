import './index.css'

import NotFound from "./pages/notFound/NotFound.jsx";
import Home from "./pages/home/Home.jsx";
import Channels from "./pages/channels/Channels.jsx";
import AddPost from "./pages/addPost/AddPost.jsx";
import AddPost2 from "./pages/addPost/AddPost2.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Search from "./pages/search/Search.jsx";
import Settings from "./pages/settings/Settings.jsx";
import {Routes, Route, BrowserRouter, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import RootLayout from "./layouts/RootLayout.jsx";
import SinglePageChannel from "./pages/channels/SinglePageChannel.jsx";

function App() {
    const [user, setUser] = useState(null);
    const savedUser = useRef(false);

    return (
        <BrowserRouter basename={"/user"}>
            <Routes>
                <Route path="/" element={<RootLayout />} >
                    <Route index element={<Home />} />
                    <Route  path="profile" element={<Profile />} />
                    <Route  path="search" element={<Search />} />
                    <Route  path="channels" element={<Channels />} />
                    <Route path="channels/:nome" element={<SinglePageChannel />} />
                    <Route  path="settings" element={<Settings />} />
                    <Route  path="addpost" element={<AddPost2 />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
    </BrowserRouter>
    );

}

export default App;