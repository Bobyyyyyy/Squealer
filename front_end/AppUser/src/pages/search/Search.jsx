import Searchbar from "./Searchbar.jsx";
import React, {useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import KeywordPostContainer from "./keywords/KeywordPostContainer.jsx";
import MentionPostContainer from "./MentionPostContainer.jsx";

function Search ()  {

    const TIME_2_WAIT = 500;

    const buttonsFilter = [
        {id: 'user', name: "user"},
        {id: 'keyword', name: "keyword"},
        {id: 'mention', name: "nel testo"},
    ];

    const [activeButton, setActiveButton] = useState(buttonsFilter[0].id);
    const [showContent, setShowContent] = useState(false);

    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);

    const [debouncedName, setDebouncedName] = useState('');

    const debouncedHandleChange = useCallback(
        debounce(async (username) => {
            await handleChangeActiveButton(username);
            setShowContent(true);
        }, TIME_2_WAIT),
        []
    );

    async function handleChangeActiveButton(username) {
        if (activeButton === "user") {
            let filter = JSON.stringify({
                name: username,
                type: ''
            })
            let res = await fetch(`/db/user/all?limit=100&offset=0&filter=${filter}`)
            if (res.ok) {
                res = await res.json();
                setUsers(res);
            }
        }
    }

    useEffect(() => {
        setShowContent(false)
        if (!!name) {
            setDebouncedName(name);
        } else {
            setUsers([]);
            setShowContent(false)
        }
    }, [name, activeButton]);

    useEffect(() => {
        if (!!debouncedName) {
            debouncedHandleChange(debouncedName);
        }
    }, [debouncedName, activeButton]);

    return (
        <>
            <div className="flex flex-col p-4 max-h-screen">
                <Searchbar setName={setName} name={name} />
                <div className="flex w-full justify-between mt-4 items-center">
                    {buttonsFilter.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveButton(item.id)}
                            className={`${activeButton === item.id ? "button" : "button-unselected"}`}
                            aria-pressed={activeButton === item.id}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
                {activeButton === "user" && !!name && showContent && (
                    <div className="flex flex-wrap w-full overflow-y-scroll mt-2 gap-4 pb-40">
                        {users.map((user) => {
                            return (
                                <Link className="w-full" to={`/search/${user.username}`} key={user._id}>
                                    <div className="flex w-full justify-start items-center gap-4">
                                        <img
                                            src={user.profilePicture}
                                            alt={`${user.username}'s profile picture`}
                                            className="w-14 h-14 aspect-square rounded-full object-cover"
                                        />
                                        <div className="flex flex-col justify-between overflow-x-hidden w-full">
                                            <span className="font-semibold text-lg truncate">{user.username}</span>
                                            <span className="font-normal text-base text-gray-600">{user.typeUser}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        {users.length === 0 && (
                            <div className="flex w-full items-center justify-center mt-8 text-2xl text-center" aria-live="polite">
                                <p>Nessun utente trovato</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showContent && (
                <>
                    {activeButton === "keyword" && !!name && (
                            <KeywordPostContainer tag={name} has2update={showContent} />
                    )}
                    {activeButton === "mention" && !!name && (
                            <MentionPostContainer mention={name} has2update={showContent} />
                    )}
                </>
            )}
        </>
    );
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

export default Search;