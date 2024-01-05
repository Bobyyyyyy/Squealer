import './index.css'
import React, {useEffect, useState} from "react";

import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider
} from "react-router-dom";

import {
    checkChannelExists,
    checkUserExists,
    setUsernameInSessionStore
} from "./utils/usefulFunctions.js";

import NotFound from "./pages/notFound/NotFound.jsx";
import Home from "./pages/home/Home.jsx";
import Channels from "./pages/channels/Channels.jsx";
import AddPost from "./pages/addPost/AddPost.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Search from "./pages/search/Search.jsx";
import KeywordPageByUrl from "./pages/search/keywords/KeywordPageByUrl.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import PageProfileByName from "./pages/profile/PageProfileByName.jsx";
import SinglePageChannel from "./pages/channels/SinglePageChannel.jsx";
import RootLayoutAnonymous from "./layouts/RootLayoutAnonymous.jsx";
import HomeAnonymous from "./pages/home/HomeAnonymous.jsx";
import ChannelAnonymous from "./pages/channels/ChannelAnonymous.jsx";
import ProfileAnonymous from "./pages/profile/ProfileAnonymous.jsx";
import RootLayout from "./layouts/RootLayout.jsx";

import {Spinner} from "flowbite-react";

function App() {
    const GUESTREGEX = /guest-\d+/g
    const [isLoading, setIsLoading] = useState(true);
    const [hasLogged, setHasLogged] = useState(false);

    const getUsername = async () => {
        setIsLoading(true);
        let usernameRes = await setUsernameInSessionStore();
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
                    path="search/keyword/:tag"
                    element={<KeywordPageByUrl />}
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
                <Route  path="addpost" element={<AddPost />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        ), {
            basename:"/user"
        });

    const routerUserAnonymous = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayoutAnonymous />} >
                <Route index element={<HomeAnonymous />} />
                <Route  path="channels" element={<ChannelAnonymous />} />
                <Route
                    path="channels/:nome"
                    element={<SinglePageChannel />}
                    errorElement={<ErrorPage />}
                    loader={checkChannelExists}
                />
                <Route  path="profile" element={<ProfileAnonymous />} />
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
                    <RouterProvider router={routerUserAnonymous} />
                )}
            </>
        )}
        </>
    );
}

export default App;