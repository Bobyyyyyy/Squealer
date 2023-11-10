import Post from "./posts/Post.jsx";
import Navbar from "../../utils/navbar/Navbar.jsx";
import "./styleHome.css"
import {useEffect} from "react";
function Home() {
    const user = {name: "mario", age: 23};

    let listOfPost = [
        {id: 0, user: user, message: "dio cane 1"},
        {id: 1, user: user, message: "dio porco 2"},
        {id: 2, user: user, message: "dio gatto 3"}
    ];

    return (
        <>
            <Navbar />
            <div className="containerOfPost">

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

