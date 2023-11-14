import Post from "./posts/Post.jsx";
import "./styleHome.css"
import {useEffect, useState} from "react";
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

    const [allPosts, setAllPosts] = useState(null);

    async function getPost () {
        try {
            let res = await fetch(`/db/post/all?name=aleuser&offset=0`);
            let posts = (await res.json()).map(post => {
                return {...post}
            });
            console.log("posts", posts);
            return posts;
        } catch (e) {
            throw e
        }
    }

    getPost();


    /*
    {
                    allPosts &&
                        allPosts.map((post)=> (
                            <Post
                                key={post.id}
                                user={post.user}
                                message={post.message}
                            />
                        ))
                }
     */

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

