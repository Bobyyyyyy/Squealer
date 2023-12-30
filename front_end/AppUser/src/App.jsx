import './index.css'

import NotFound from "./pages/notFound/NotFound.jsx";
import Home from "./pages/home/Home.jsx";
import Channels from "./pages/channels/Channels.jsx";
import AddPost from "./pages/addPost/AddPost.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Search from "./pages/search/Search.jsx";
import Settings from "./pages/settings/Settings.jsx";
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";
import React, {useEffect} from "react";
import RootLayout from "./layouts/RootLayout.jsx";
import {
    checkChannelExists,
    checkUserExists,
    setUsernameInSessionStore
} from "./utils/usefulFunctions.js";
import ErrorPage from "./pages/ErrorPage.jsx";
import PageProfileByName from "./pages/profile/PageProfileByName.jsx";
import SinglePageChannel from "./pages/channels/SinglePageChannel.jsx";
function App() {

    useEffect(() => {
        setUsernameInSessionStore()
            .catch(console.error);
    }, []);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />} >
                <Route index element={<Home />} />
                <Route  path="profile" element={<Profile />} />
                <Route
                    path="search"
                    element={<Search />}
                />
                <Route
                    path="search/:username"
                    element={<PageProfileByName />}
                    loader={checkUserExists}
                    errorElement={<ErrorPage />}
                />
                <Route  path="channels" element={<Channels />} />
                <Route
                    path="channels/:nome"
                    element={<SinglePageChannel />}
                    errorElement={<ErrorPage />}
                    loader={checkChannelExists}
                />
                <Route  path="settings" element={<Settings />} />
                <Route  path="addpost" element={<AddPost />} />
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