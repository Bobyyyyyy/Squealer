import './index.css'

import NotFound from "./pages/notFound/NotFound.jsx";
import Home from "./pages/home/Home.jsx";
import Channels from "./pages/channels/Channels.jsx";
import AddPost from "./pages/addPost/AddPost.jsx";
import AddPost2 from "./pages/addPost/AddPost2.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Search from "./pages/search/Search.jsx";
import Settings from "./pages/settings/Settings.jsx";
import {
    Routes,
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import RootLayout from "./layouts/RootLayout.jsx";
import SinglePageChannel from "./pages/channels/SinglePageChannel.jsx";
import {checkChannelExists} from "./components/utils/usefulFunctions.js";
import ChannelErrorPage from "./pages/channels/ChannelErrorPage.jsx";
function App() {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />} >
                <Route index element={<Home />} />
                <Route  path="profile" element={<Profile />} />
                <Route  path="search" element={<Search />} />
                <Route  path="channels" element={<Channels />} />
                <Route
                    path="channels/:nome"
                    element={<SinglePageChannel />}
                    errorElement={<ChannelErrorPage />}
                    loader={checkChannelExists}
                />
                <Route  path="settings" element={<Settings />} />
                <Route  path="addpost" element={<AddPost2 />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        ), {
            basename:"/user"
        });

    return (
        <RouterProvider router={router} />
    );
}

export default App;