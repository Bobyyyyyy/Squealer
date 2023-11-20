import {getUsernameFromLocStor, getQuotaInLocStor, getAllPostFrontend} from "../../components/utils/usefulFunctions.js";
import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx"
import Post from "../../components/posts/Post.jsx";

function Profile () {
    const [posts, setPosts] = useState([]);
    const name = getUsernameFromLocStor();
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllPosts = async () => {
        try {
            let currentUser = getUsernameFromLocStor();
            console.log("name user:", currentUser);

            let res = await fetch(`/db/post/all?name=${currentUser}&offset=0`);

            if (!res.ok) {
                console.log("errore nel fetching dei post");
            }

            let allPosts = await res.json();
            console.log(allPosts)
            setPosts(allPosts);
            console.log("num of post", allPosts.length)
            setIsLoading(false)

        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

    return (
        <>
            <div className={"flex flex-col h-fit"}>
                {/* HEADER */}
                <div className={"flex items-center justify-start p-4 border border-b-black"}>
                    <img className={"w-20 h-20 rounded-full"} src={ProfilePic} alt={"profile"} />
                    <div className="flex flex-col h-full justify-between ml-4">
                        <span className={"text-3xl"}>{name}</span>
                        <div className={"flex justify-between"}>
                            <p className={"text-xl"}>Post: {posts.length}</p>
                            <p className={"ml-6 text-xl"}>Seguiti: {posts.length}</p>
                        </div>
                    </div>
                </div>
                <div className={"flex justify-evenly mt-2"}>
                    <p className={"text-xl"}>Quota giornaliera: {posts.length}</p>
                    <p className={"text-xl"}>Caratteri rimasti: {posts.length}</p>
                </div>
            </div>
            {isLoading && <h1>Caricamento...</h1>}
            {posts.map((post)=> {
                console.log("id",post._id)
                return(
                    <Post
                        key={post._id}
                        post={post}
                    />
                )})}
        </>
    );
}

export default Profile;