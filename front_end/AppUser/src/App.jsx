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
import React, {useEffect, useState} from "react";
import RootLayout from "./layouts/RootLayout.jsx";
import {
    checkChannelExists,
    checkUserExists,
    setUsernameInSessionStore
} from "./utils/usefulFunctions.js";
import ErrorPage from "./pages/ErrorPage.jsx";
import PageProfileByName from "./pages/profile/PageProfileByName.jsx";
import SinglePageChannel from "./pages/channels/SinglePageChannel.jsx";
import {Spinner} from "flowbite-react";
function App() {
    const GUESTREGEX = /guest-\d+/g
    const [isLoading, setIsLoading] = useState(true);
    const [hasLogged, setHasLogged] = useState(false);
    const getUsername = async () => {
        setIsLoading(true);
        let usernameRes = await setUsernameInSessionStore();
        console.log("has logged res", usernameRes);
        if (usernameRes.username.match(GUESTREGEX)) {
            setHasLogged(false);
        } else {
            setHasLogged(true);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getUsername()
            .catch(console.error);
    }, []);

    const routerUserLogged = createBrowserRouter(
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
        <>
        {isLoading ? (
            <div className="flex h-screen items-center justify-center">
                <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
            </div>
        ) : (
            <>
                {hasLogged ? (
                    <RouterProvider router={routerUserLogged} />
                ) : (
                    <div>non hai loggato</div>
                )}
            </>
        )}
        </>
    );
}

export default App;