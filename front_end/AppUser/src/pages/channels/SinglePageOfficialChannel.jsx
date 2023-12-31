import {useLoaderData, useParams} from "react-router-dom";
import {Spinner} from "flowbite-react";
import React, {useEffect, useState} from "react";
import Post from "../../components/posts/Post.jsx";
import {getPostByChannelName} from "../../utils/usefulFunctions.js";

function SinglePageOfficialChannel() {
    const channel = useLoaderData();
    console.log(channel)
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const fetchPost = async () => {
        setIsLoading(true);
        const resPost = await getPostByChannelName(channel.name);
        setPosts(resPost);
        setIsLoading(false)
    }

    useEffect(() => {
        fetchPost()
    }, []);

    console.log(channel);
    return (
        <>
            {isLoading ? (
            <div className="flex h-screen items-center justify-center">
                <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
            </div>
            ) : (
                <div className="flex flex-col w-full justify-center items-center gap-4">
                    <h3 className="text-center text-2xl font-extrabold mt-4">§{channel.name}</h3>
                    <p className="w-full h-fit p-2 break-words">{channel.description}</p>
                    {channel.silenceable &&
                        <div>
                            silenziabile
                        </div>
                    }
                    {posts!==null && posts.map((post)=> {
                        return(
                            <Post
                                key={post._id}
                                post={post}
                            />
                        )})}
                    {posts.length===0 &&
                        <p>Non ci sono ancora post indirizzati al canale {channel.name}</p>
                    }
                </div>
            )}
        </>
    );
}

export default SinglePageOfficialChannel;