import Post from "./posts/Post.jsx";
import Navbar from "../../utils/navbar/Navbar.jsx";
import "./styleHome.css"
import {useEffect, useState} from "react";
function Home() {
    const user = {name: "mario", age: 23};

    let listOfPost = [
        {id: 0, user: user, message: "dio cane 1"},
        {id: 1, user: user, message: "dio porco 2"},
        {id: 2, user: user, message: "dio gatto 3"},
        {id: 0, user: user, message: "dio cane 1"},
        {id: 1, user: user, message: "dio porco 2"},
        {id: 2, user: user, message: "dio gatto 3"}
    ];

    const [allPosts, setAllPosts] = useState(null);
    /*
    async function getPost () {
        try {
            let res = await fetch(`/db/post/all`, {
                method: "GET",
            });
            let posts = (await res.json()).map(post => {
                return {...post, dateOfCreation: new Date(Date.parse(post.dateOfCreation))}
            });
            console.log(posts);
            return posts;
        } catch (e) {
            throw e
        }
    }
    useEffect( async ()=> {
        setAllPosts(getPost());
    }, [])

     */

    return (
        <>
            <Navbar />
            <div className="containerOfPost">
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
                {listOfPost.map( (item) => (
                    <Post
                        key={item.id}
                        user={item.user}
                        message={item.message}
                    />
                ))}
            </div>
         </>
    );
}

export default Home;

