import './App.css'

import NotFound from "./components/pages/notFound/NotFound.jsx";
import Home from "./components/pages/home/Home.jsx";
import Channels from "./components/pages/channels/Channels.jsx";
import AddPost from "./components/pages/addPost/AddPost.jsx";
import Profile from "./components/pages/profile/Profile.jsx";
import Search from "./components/pages/search/Search.jsx";
import Settings from "./components/pages/settings/Settings.jsx";
import {Routes, Route} from "react-router-dom";
import React, {useEffect, useState} from "react";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} >
                <Route path="profile" element={<Profile />} />
                <Route path="search" element={<Search />} />
                <Route path="channels" element={<Channels />} />
                <Route path="settings" element={<Settings />} />
                <Route path="addpost" element={<AddPost />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}


/*
function App() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get("/api/items")
            .then(response => setItems(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Items</h1>
            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
*/
export default App;


function Prova () {
    return (
        <div>
            prova
        </div>
    );
}