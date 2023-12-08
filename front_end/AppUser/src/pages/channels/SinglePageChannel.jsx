import {useParams} from "react-router-dom";
import React, {Suspense, useEffect, useState} from "react";
import {setUsernameInLocStor} from "../../components/utils/usefulFunctions.js";
import Post from "../../components/posts/Post.jsx";

function SinglePageChannel() {
    const { nome } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [description, setDescription] = useState("")

    const fetchAllPosts = async () => {
        try {
            let res = await fetch(`/db/post/all?offset=0&limit=10&channel=${nome}`);
            console.log(res);
            if (!res.ok) {
                console.log("errore nel fetching dei post");
            }

            let allPosts = await res.json();
            console.log(allPosts);
            //console.log(allPosts)
            setPosts(allPosts);
            //console.log("num of post", allPosts.length)
            setIsLoading(false)

        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        setUsernameInLocStor()
            .then((res) => {
                fetchAllPosts()
                    .then(()=>{
                        fetch(`/db/channel/${nome}`)
                            .then((res)=>res.json())
                            .then((res)=>{
                                setDescription(res.description)
                                console.log("canale", res)
                            })
                    })
            })
    }, []);

    console.log("entro qui", nome)
    return (
        <div>
            <h3 className={"text-center text-2xl font-extrabold mt-4"}>§{nome}</h3>
            <p>{description}</p>
            <div className={"flex flex-wrap w-full gap-8 items-center justify-center h-full pb-20 mt-4 overflow-y-scroll"}>
                {posts!==null && posts.map((post)=> {
                    //console.log("id",post._id)
                    return(
                            <Post
                                key={post._id}
                                post={post}
                            />
                    )})}
                {posts.length===0 &&
                    <p>Non ci sono ancora post indirizzati al canale {nome}</p>
                }
            </div>
        </div>
    );
}

export default SinglePageChannel;