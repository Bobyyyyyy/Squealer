import Post from "../../components/posts/Post.jsx";
import React, {Suspense, useEffect, useState} from "react";
import {
    getUsernameFromLocStor,
    setUsernameInLocStor
} from "../../components/utils/usefulFunctions.js";

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
        setUsernameInLocStor()
            .then((res) => {
                fetchAllPosts()
                    .then()
            })
    }, []);


    function Caricamento () {
        return (
            <h1>
                caricamento
            </h1>
        );
    }

    return (
        <>
            {isLoading && <h1>Caricamento...</h1>}
            {!isLoading &&
            <div className={"flex flex-wrap w-full gap-8 items-center justify-center h-screen pb-20 overflow-y-scroll"}>
                {posts!==null && posts.map((post)=> {
                    //console.log("id",post._id)
                    return(
                        <Suspense fallback={<Caricamento />} key={post._id}>
                            <Post
                                post={post}
                            />
                        </Suspense>
                )})}
            </div>
            }
         </>
    );
}

export default Home;

