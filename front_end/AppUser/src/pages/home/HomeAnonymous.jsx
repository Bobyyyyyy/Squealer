import Post from "../../components/posts/Post.jsx";
import React, { useEffect, useRef, useState} from "react";
import {
    getAllOfficialChannelPost,
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

    const fetchFirstPosts = async () => {
        let newPost = await getAllOfficialChannelPost();
        allPosts.current =  allPosts.current.concat(newPost);
        //setPosts(allPosts.current);
        setIsLoading(false)
    };

    const updatePost = async () => {
        setIsLoading(true);
        let newPosts = await getAllPost(currentOffset.current);
        currentOffset.current += newPosts.length;
        lastRequestLenght.current = newPosts.length;
        //setPosts((prev) => [...prev, ...newPosts]);
        setIsLoading(false);
    }

    const scrollEndDetector = async (event) => {
        event.preventDefault();
        const postDiv = document.getElementById("postDiv");

        if (postDiv && window.innerHeight + window.scrollY >= postDiv.offsetHeight && lastRequestLenght.current >= POST_TO_GET) {
            lastHeightDiv.current = window.scrollY;
            await updatePost();
        }
    };

    useEffect(() => {
        document.addEventListener('scroll', scrollEndDetector, true);
        fetchFirstPosts()
            .catch(console.error);
        return () => {
            document.removeEventListener('scroll', scrollEndDetector);
        }
    }, []);


    useEffect(() => {
        window.scrollTo({ behavior: "instant", top: lastHeightDiv.current, left:0})
    }, [posts]);


    return (
        <>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                </div>
            ) : (
                <div className="max-h-screen">
                    <div className="flex flex-wrap w-full gap-8 items-center justify-center pb-20 overflow-y-scroll" id="postDiv">
                        {posts!==null && posts !==undefined && posts.map((post)=> {
                            return(
                                <Post
                                    post={post} key={post._id}
                                />
                            )})}
                        {posts!==null && posts !==undefined && posts.length === 0 &&
                            <div className="flex w-full items-center justify-center mt-8 text-2xl">
                                Non ci sono ancora post!
                            </div>
                        }
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;