import {Link, useLoaderData} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {
    getPostByUsername,
    POST_TO_GET, resetPosts,
    scrollEndDetectorHandler
} from "../../utils/usefulFunctions.js";
import Post from "../../components/posts/Post.jsx";
import {Spinner} from 'flowbite-react'

function PageProfileByName() {
    const user = useLoaderData();
    const [isLoading, setIsLoading] = useState(true);

    // post related states
    const [posts, setPosts] = useState([]);
    const currentOffset = useRef(0);
    const lastRequestLength = useRef(0);
    const lastHeightDiv = useRef(0);

    const fetchPosts = async () => {
        setIsLoading(true);
        let newPosts = await getPostByUsername(user.username, currentOffset.current, POST_TO_GET);
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
    }, [user.username]);

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
                <>
                    {user.typeUser === "mod" ? (
                        <div className="flex flex-col w-full items-center justify-start mt-6 gap-8 p-4">
                            <span className="text-4xl font-extrabold">{user.username}</span>
                            <div className="flex flex-col w-full gap-2 text-lg text-center">
                                <p>
                                    Questo utente è un moderatore.
                                </p>
                                <p>
                                    Il loro compito è di rendere Squealer una piattaforma sicura e adatta a tutti.
                                </p>
                            </div>
                            <Link
                                className="p-4 bg-primary rounded-md text-xl font-medium"
                                to="/"
                            >
                                Back to the Homepage
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex w-full items-center justify-start gap-6 p-4">
                                <img
                                    src={user.profilePicture} alt={`${user.username}'s profile picture`}
                                    className="w-24 h-24 rounded-full object-cover aspect-square"
                                />

                                <div className="flex flex-col w-fit justify-between gap-3">
                                    <span className="text-4xl font-extrabold">{user.username}</span>
                                    <span className="text-lg font-normal">Squeals:
                                        <span className="ml-1 font-medium">{posts.length}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap w-full gap-8 items-center justify-center pb-20 overflow-y-scroll mt-4" id="postDiv">
                                {posts.map((post)=> {
                                    return(
                                        <Post key={post._id} post={post}
                                        />
                                    )})}
                                {posts.length === 0 &&
                                    <div className="text-lg text-center mt-4">
                                        Al momento non ci sono post!
                                    </div>
                                }
                            </div>
                        </>
                    )}
                </>
            )}

        </>
    );
}

export default PageProfileByName;