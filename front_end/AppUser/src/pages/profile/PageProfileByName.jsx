import {useLoaderData} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getPostByUsername} from "../../utils/usefulFunctions.js";
import Post from "../../components/posts/Post.jsx";
import {Spinner} from 'flowbite-react'

function PageProfileByName() {
    const user = useLoaderData();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        let postsRes = await getPostByUsername(user.username);
        setPosts(postsRes);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData()
            .catch(console.error);
    }, [user]);

    return (
        <>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                </div>
            ) : (
                <>
                    <div className={"flex w-full items-center justify-start gap-8 p-4"}>
                        <img
                            src={user.profilePicture} alt={`${user.username}'s profile picture`}
                            className={"w-24 h-24 rounded-full object-cover"}
                        />
                        <div className="flex flex-col w-full justify-between gap-3">
                            <span className={"text-4xl font-extrabold"}>{user.username}</span>
                            <div className="flex flex-wrap justify-start w-full gap-x-8 gap-y-2 text-lg font-normal ">
                                <span>Squeals:
                                    <span className="ml-1 font-medium">{posts.length}</span>
                                </span>
                                <span>Seguiti:
                                    <span className="ml-1 font-medium">{posts.length}</span>
                                </span>
                            </div>
                        </div>
                    </div>
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
                </>
            )}

        </>
    );
}

export default PageProfileByName;