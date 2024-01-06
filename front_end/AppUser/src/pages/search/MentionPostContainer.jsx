import React, {useEffect, useRef, useState} from "react";
import {
    getPostByMention,
    POST_TO_GET,
    scrollEndDetectorHandler
} from "../../utils/usefulFunctions.js";
import {Spinner} from "flowbite-react";
import Post from "../../components/posts/Post.jsx";

function MentionPostContainer({mention, has2update}) {
        const [isLoading, setIsLoading] = useState(true);
        const [posts, setPosts] = useState([]);
        const currentOffset = useRef(0);
        const lastRequestLength = useRef(0);
        const lastHeightDiv = useRef(0);

        const fetchPosts = async () => {
            setIsLoading(true);
            let newPosts = await getPostByMention(mention, currentOffset.current, POST_TO_GET);
            currentOffset.current += newPosts.length;
            lastRequestLength.current = newPosts.length;
            setPosts((prev) => [...prev, ...newPosts]);
            setIsLoading(false);
        }

        const scrollEndDetector = async (event) => {
            event.preventDefault();
            await scrollEndDetectorHandler(lastRequestLength, lastHeightDiv, fetchPosts);
        };

        useEffect(() => {
            if (has2update) {
                document.addEventListener('scroll', scrollEndDetector, true);
                fetchPosts()
                    .catch(console.error);
                return () => {
                    document.removeEventListener('scroll', scrollEndDetector);
                }
            }
        }, [mention, has2update]);


        useEffect(() => {
            window.scrollTo({ behavior: "instant", top: lastHeightDiv.current, left:0})
        }, [posts]);

        return (
            <>
                {isLoading ? (
                    <div className="flex h-screen items-center justify-center" aria-live="polite">
                        <Spinner aria-label="Caricamento in corso" size="xl" color="pink" />
                    </div>
                ) : (
                    <div className="max-h-screen">
                        <div className="flex flex-wrap w-full gap-8 items-center justify-center pb-20 overflow-y-scroll" id="postDiv">
                            {posts !== null && posts !== undefined && posts.map((post) => (
                                <Post
                                    post={post} key={post._id}
                                />
                            ))}
                            {posts !== null && posts !== undefined && posts.length === 0 && (
                                <div className="flex w-full items-center justify-center mt-8 text-2xl text-center" aria-live="assertive">
                                    <p>
                                        Non ci sono ancora post che contengono
                                        <span className="font-semibold">
                                            {" "}{mention}!
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        );

}

export default MentionPostContainer;