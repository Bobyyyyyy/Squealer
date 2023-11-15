import Post from "./posts/Post.jsx";
import "./styleHome.css"
import {useEffect, useState} from "react";
import {all} from "express/lib/application.js";
function Home() {
    const user = {name: "mario", age: 23};

    let listOfPost = [
        {id: 0, user: user, message: "dio cane 1"},
        {id: 1, user: user, message: "dio porco 2"},
        {id: 2, user: user, message: "dio gatto 3"},
        {id: 3, user: user, message: "dio cane 11"},
        {id: 4, user: user, message: "dio porco 2242"},
        {id: 5, user: user, message: "dio gatto 424223"}
    ];

    async function getPost () {
        try {
            let res = await fetch(`/db/post/all?name=aleuser&offset=0`);
            let posts = (await res.json());

            console.log("posts", posts);
            return posts;
        } catch (e) {
            throw e;
        }
    }

    useEffect(() => {

    }, []);

    //let allPosts = getPost();
    //console.log("è un array? ", typeof allPosts );

    return (
        <>
            <div className="containerOfPost">

                {listOfPost.map((post)=> (
                  <Post
                    key={post.id}
                    user={post.user}
                    message={post.message}
                />
                ))
                }
            </div>
         </>
    );
}

export default Home;

