import {useParams} from "react-router-dom";
import React, {Suspense, useEffect, useState} from "react";
import {setUsernameInLocStor} from "../../components/utils/usefulFunctions.js";
import Post from "../../components/posts/Post.jsx";

function SinglePageChannel() {
    let { nome } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const fetchAllPosts = async () => {
        try {
            let res = await fetch(`/db/post/all?offset=0&limit=10&channel=${nome}`);
            console.log(res);
            if (!res.ok) {
                console.log("errore nel fetching dei post");
            }

            let allPosts = await res.json();
            console.log(allPosts);
            //console.log(allPosts)
            setPosts(allPosts);
            //console.log("num of post", allPosts.length)
            setIsLoading(false)

        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        setUsernameInLocStor()
            .then((res) => {
                fetchAllPosts()
                    .then()
            })
    }, []);

    console.log("entro qui", nome)
    return (
        <div>
            <h3 className={"text-center text-2xl font-extrabold"}>{nome}</h3>
            <div className={"flex flex-wrap w-full gap-8 items-center justify-center h-full pb-20 overflow-y-scroll"}>
                {posts!==null && posts.map((post)=> {
                    //console.log("id",post._id)
                    return(
                            <Post
                                key={post._id}
                                post={post}
                            />
                    )})}
            </div>
        </div>
    );
}

export default SinglePageChannel;