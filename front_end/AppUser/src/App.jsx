import './index.css'

import NotFound from "./components/pages/notFound/NotFound.jsx";
import Home from "./components/pages/home/Home.jsx";
import Channels from "./components/pages/channels/Channels.jsx";
import AddPost from "./components/pages/addPost/AddPost.jsx";
import Profile from "./components/pages/profile/Profile.jsx";
import Search from "./components/pages/search/Search.jsx";
import Settings from "./components/pages/settings/Settings.jsx";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import React, {useEffect, useState} from "react";
import RootLayout from "./layouts/RootLayout.jsx";


function App() {
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