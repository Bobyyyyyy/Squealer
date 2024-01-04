import Post from "../../components/posts/Post.jsx";
import React, { useEffect, useRef, useState} from "react";
import {
    getAllPost, POST_TO_GET, scrollEndDetectorHandler
} from "../../utils/usefulFunctions.js";
import {Spinner} from "flowbite-react";

function Home() {

    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const currentOffset = useRef(0);
    const lastRequestLength = useRef(0);
    const lastHeightDiv = useRef(0);

    const fetchPosts = async () => {
        setIsLoading(true);
        let newPosts = await getAllPost(currentOffset.current, POST_TO_GET);
        currentOffset.current += newPosts.length;
        lastRequestLength.current = newPosts.length;
        setPosts((prev) => [...prev, ...newPosts]);
        setIsLoading(false);
    };

    const scrollEndDetector = async (event) => {
        event.preventDefault();
        await scrollEndDetectorHandler(lastRequestLength, lastHeightDiv, fetchPosts);
    };

    useEffect(() => {
        document.addEventListener('scroll', scrollEndDetector, true);
        fetchPosts()
            .catch(console.error);
        return () => {
            document.removeEventListener('scroll', scrollEndDetector);
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ behavior: "instant", top: lastHeightDiv.current, left: 0})
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
                        {posts!==null && posts.map((post)=> {
                            return(
                                <Post
                                    post={post} key={post._id}
                                />
                        )})}
                        {posts.length === 0 &&
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