import Post from "../../components/posts/Post.jsx";
import React, { useEffect, useRef, useState} from "react";
import {
    getAllPost
} from "../../utils/usefulFunctions.js";
import {Spinner} from "flowbite-react";

function Home() {

    const POST_TO_GET = 10;

    const allPosts = useRef([]);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const currentOffset = useRef(POST_TO_GET);
    const lastRequestLenght = useRef(POST_TO_GET);
    const lastHeightDiv = useRef(0);

    const fetchAllPosts = async () => {
        try {
            console.log("fetch all posts")
            let res = await fetch(`/db/post/all?offset=0&limit=10`, {
                method: 'GET'
            });
            console.log(res);
            if (!res.ok) {
               console.log("errore nel fetching dei post");
            }

            let newPost = await res.json();
            allPosts.current =  allPosts.current.concat(newPost);
            setPosts(allPosts.current);
            setIsLoading(false)

        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        document.addEventListener('scroll', scrollEndDetector, true);
        fetchAllPosts()
        return () => {
            document.removeEventListener('scroll', scrollEndDetector);
        }
    }, []);


    useEffect(() => {
        window.scrollTo({ behavior: "instant", top: lastHeightDiv.current, left:0})
    }, [posts]);

    const updatePost = async () => {
        setIsLoading(true);
        let newPosts = await getAllPost(currentOffset.current);
        currentOffset.current += newPosts.length;
        lastRequestLenght.current = newPosts.length;
        setPosts((prev) => [...prev, ...newPosts]);
        setIsLoading(false);
    }

    const scrollEndDetector = async (event) => {
        event.preventDefault();
        const postDiv = document.getElementById("postDiv");

        if (postDiv && window.innerHeight + window.scrollY >= postDiv.offsetHeight && lastRequestLenght.current >= POST_TO_GET) {
            lastHeightDiv.current = window.scrollY;
            updatePost();
        }
    };


    return (
        <>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                </div>
            ) : (
                <div className="max-h-screen">
                    <div className="flex flex-wrap w-full gap-8 items-center justify-center pb-20 overflow-y-scroll" id="postDiv">
                        {posts!==null && posts.map((post)=> {
                            return(
                                <Post
                                    post={post} key={post._id}
                                />
                        )})}
                    </div>
                </div>
            )}
         </>
    );
}

export default Home;