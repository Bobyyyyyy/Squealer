import {useLoaderData} from "react-router-dom";
import {Spinner, ToggleSwitch} from "flowbite-react";
import React, {useEffect, useRef, useState} from "react";
import Post from "../../components/posts/Post.jsx";
import {
    getPostByOfficialChannelName,
    getUsernameFromSessionStore,
    isUserAnonymous,
    POST_TO_GET,
    resetPosts,
    scrollEndDetectorHandler
} from "../../utils/usefulFunctions.js";

function SinglePageOfficialChannel() {
    const channel = useLoaderData();

    const isAnonymous = isUserAnonymous();
    const [isLoading, setIsLoading] = useState(true);

    const [posts, setPosts] = useState([]);
    const currentOffset = useRef(0);
    const lastRequestLength = useRef(0);
    const lastHeightDiv = useRef(0);
    const [isSilenced, setIsSilenced] = useState(() => {
        if (channel.silenceable) {
            let user = channel.silenced.filter((user) => user === getUsernameFromSessionStore());
            return user.length !== 0;
        } else {
            return false;
        }
    });

    const handleSilenceChannel = async () => {
        setIsSilenced((prev) => !prev);
        try {
             await fetch(`/db/official/silenced`,{
                method:"PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    channelName: channel.name,
                    username: getUsernameFromSessionStore()
                })
            })
        } catch (e) {
            console.log(e);
        }
    }

    const fetchPosts = async () => {
        setIsLoading(true);
        let newPosts = await getPostByOfficialChannelName(channel.name, currentOffset.current, POST_TO_GET);
        currentOffset.current += newPosts.length;
        lastRequestLength.current = newPosts.length;
        setPosts((prev) => [...prev, ...newPosts]);
        setIsLoading(false);
    };

    const scrollEndDetector = async (event) => {
        event.preventDefault();
        await scrollEndDetectorHandler(lastRequestLength, lastHeightDiv, fetchPosts);
    };

    useEffect(() => {
        resetPosts(setPosts, currentOffset, lastRequestLength, lastHeightDiv);
        document.addEventListener('scroll', scrollEndDetector, true);
        fetchPosts()
            .catch(console.error);
        return () => {
            document.removeEventListener('scroll', scrollEndDetector);
        }
    }, [channel.username]);

    useEffect(() => {
        window.scrollTo({ behavior: "instant", top: lastHeightDiv.current, left:0})
    }, [posts]);

    return (
        <>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                </div>
            ) : (
                <div className="flex flex-col w-full justify-center items-center gap-4 mt-2">
                    <div className="flex flex-col items-center justify-start px-4 gap-2 w-full">
                        <div className="flex justify-center items-center gap-3 w-full">
                            <img
                                src={channel.profilePicture}
                                alt={`foto canale ${channel.name}`}
                                className="w-20 h-20 rounded-full object-cover aspect-square"
                            />
                            <h3 className="text-center text-2xl font-extrabold">§{channel.name}</h3>
                        </div>
                        <p className="text-center px-2 break-words text-lg">{channel.description}</p>
                    </div>
                    {channel.silenceable && !isAnonymous && (
                        <div className="flex justify-center gap-2" aria-label="Gestione silenziamento canale">
                            <span className="text-base">Canale silenziato</span>
                            <ToggleSwitch
                                checked={isSilenced}
                                onChange={async () => await handleSilenceChannel()}
                                aria-label="Silenzia canale"
                            />
                        </div>
                    )}
                    <div
                        className="flex flex-wrap w-full gap-8 items-center justify-center pb-20 overflow-y-scroll mt-4"
                        id="postDiv"
                        aria-live="polite"
                    >
                        {posts !== null && posts.map((post) => {
                            return <Post key={post._id} post={post} />;
                        })}
                        {posts.length === 0 && (
                            <div className="flex w-full items-center justify-center mt-8 text-2xl text-center px-4">
                                <p>
                                    Non ci sono ancora post indirizzati al canale {channel.name}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default SinglePageOfficialChannel;