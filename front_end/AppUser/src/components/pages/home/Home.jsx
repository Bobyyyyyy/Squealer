import Post from "./posts/Post.jsx";
import "./styleHome.css"
import {useEffect, useState} from "react";
import {all} from "express/lib/application.js";
import {alert} from "@material-tailwind/react";


function Home() {
    const [error, setError] = useState(false);
    const [state, setState] = useState('');
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        /*
        const fetchAllPosts = async () => {
            setState('loading');
            try {
                let res = await fetch(`/db/post/all?name=aleuser&offset=0`);
                let posts = (await res.json());
                setState('success');
                setPosts(posts);
                console.log("num of post", posts.length)
            } catch (e) {
                setError(e);
                setState('error');
            }
        };

        fetchAllPosts();

         */

    }, []);


    return (state === "loading") ? (
        <h1>Caricamento...</h1>

        ): (state === "error") ? (
        <h1>Errore carimento post</h1>

        ):(
        <>
            <div className="containerOfPost">

                {posts && posts.map((post)=> {
                    console.log("id",post._id)
                    return(
                        <Post
                            key={post._id}
                            post={post}
                        />
                )})}

            </div>
         </>
    );
}

export default Home;

