import Post from "../../components/posts/Post.jsx";
import React, {Suspense, useEffect, useState} from "react";
import {
    getUsernameFromSessionStore,
    setUsernameInSessionStore
} from "../../utils/usefulFunctions.js";
import {Spinner} from "flowbite-react";

function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const fetchAllPosts = async () => {
        try {

            let res = await fetch(`/db/post/all?offset=0&limit=10`, {
                method: 'GET'
            });
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
        setUsernameInSessionStore()
            .then((res) => {
                fetchAllPosts()
                    .then()
            })
    }, []);


    return (
        <>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                </div>
            ) : (
                <div className={"flex flex-wrap w-full gap-8 items-center justify-center h-screen pb-20 overflow-y-scroll"}>
                    {posts!==null && posts.map((post)=> {
                        return(
                            <Post
                                post={post} key={post._id}
                            />
                    )})}
                </div>
            )}
         </>
    );
}

export default Home;

