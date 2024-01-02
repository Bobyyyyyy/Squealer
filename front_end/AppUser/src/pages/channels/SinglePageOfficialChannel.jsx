import {useLoaderData, useParams} from "react-router-dom";
import {Spinner} from "flowbite-react";
import React, {useEffect, useState} from "react";
import Post from "../../components/posts/Post.jsx";
import { getPostByOfficialChannelName} from "../../utils/usefulFunctions.js";

function SinglePageOfficialChannel() {
    const channel = useLoaderData();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const fetchPost = async () => {
        setIsLoading(true);
        const resPost = await getPostByOfficialChannelName(channel.name);
        console.log(resPost)
        setPosts(resPost);
        setIsLoading(false)
    }

    useEffect(() => {
        fetchPost()
    }, []);

    return (
        <>
            {isLoading ? (
            <div className="flex h-screen items-center justify-center">
                <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
            </div>
            ) : (
                    <div className="flex flex-col w-full justify-center items-center gap-4 mt-2">
                        <div className="flex flex-col items-center justify-start px-4 gap-2 w-full">
                            <div className="flex justify-center items-center gap-3 w-full ">
                                <img
                                    src={channel.profilePicture}
                                    alt={`foto canale ${channel.name}`}
                                    className={"w-20 h-20 rounded-full object-cover"}
                                />
                                <h3 className="text-center text-2xl font-extrabold">§{channel.name}</h3>
                            </div>
                            <p className="text-center px-2 break-words text-sm">{channel.description}</p>
                        </div>

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
                        <p className="text-center">Non ci sono ancora post indirizzati al canale {channel.name}</p>
                    }
                </div>
            )}
        </>
    );
}

export default SinglePageOfficialChannel;