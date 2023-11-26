import Post from "../../components/posts/Post.jsx";
import {useEffect, useState} from "react";
import {getAllPostFrontend, getUsernameFromLocStor} from "../../components/utils/usefulFunctions.js";
import {useFetch} from "../../components/utils/useFetch.js";

function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    /*
    const {data, isLoading, error} = useFetch(`/db/post/all?name=${getUsernameFromLocStor()}&offset=0`);
    console.log("isLoading", isLoading)
    console.log("data", data);
     */


    const fetchAllPosts = async () => {
        try {
            let currentUser = getUsernameFromLocStor();
            console.log("name user:", currentUser);

            let res = await fetch(`/db/post/all?name=${currentUser}&offset=0`);

            if (!res.ok) {
               console.log("errore nel fetching dei post");
            }

            let allPosts = await res.json();
            //console.log(allPosts)
            setPosts(allPosts);
            //console.log("num of post", allPosts.length)
            setIsLoading(false)

        } catch (e) {
            console.log(e);
        }
    };

    //const getCurrent

    useEffect(() => {
        fetchAllPosts();
    }, []);
    console.log(posts);

    return (
        <>
            {isLoading && <h1>Caricamento...</h1>}
            <div className={"flex flex-wrap w-full gap-8 items-center justify-center h-screen pb-20 overflow-y-scroll"}>
                {posts!==null && posts.map((post)=> {
                    //console.log("id",post._id)
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

