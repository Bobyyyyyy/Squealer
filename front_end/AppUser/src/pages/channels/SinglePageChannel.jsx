import {useParams} from "react-router-dom";
import React, {Suspense, useEffect, useState} from "react";
import {getUsernameFromLocStor, setUsernameInLocStor} from "../../components/utils/usefulFunctions.js";
import Post from "../../components/posts/Post.jsx";
import {FollowIcon, DontFollow} from "../../components/assets/index.jsx";
import {Button} from "flowbite-react";
import RequestModal from "./RequestModal.jsx";

function SinglePageChannel() {
    const { nome } = useParams();
    const [type, setType] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [description, setDescription] = useState("");
    const [role, setRole] = useState("");
    const [isFollower, setIsFollower] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requests, setRequests] = useState([]);
    const [hasUpdated, setHasUpdated] = useState(false);

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

    const handleFollow = () => {
        fetch(`/db/channel/follower`, {
            method:"POST",
            body: JSON.stringify({
                user: getUsernameFromLocStor(),
                channel: nome
            }),
            headers: {
            "Content-Type":"application/json"
        }})
            .then((res)=> {
                if (res.ok) {
                    setIsFollower(!isFollower);
                }
            })
    }

    useEffect(() => {
        fetchAllPosts()
            .then(()=>{
                fetch(`/db/channel/${nome}`)
                    .then((res) => res.json())
                    .then((res)=> {
                        const username = getUsernameFromLocStor();
                        setDescription(res.description)
                        setRole(res.role);
                        console.log("ruolo", res.role)
                        setType(res.type);
                        setRequests(res.requests)
                        setIsFollower(res.followers.some((follower)=> follower.user === username))
                        setHasUpdated(false);
                        console.log("canale", res)
                    })
            })
    }, [hasUpdated]);

    return (
        <>
            {isLoading && <p>Caricamento...</p>}
            <div className="flex flex-col w-full justify-center items-center gap-4">
                <h3 className={"text-center text-2xl font-extrabold mt-4"}>§{nome}</h3>
                <p>{description}</p>
                {role === "Creator" || role === "Admin" ? (
                        <div className="flex justify-around w-full">
                            <Button>
                                Gestisci follower
                            </Button>
                            {type === "private" &&
                                <>
                                <Button
                                    onClick={()=>setShowRequestModal(true)}
                                >
                                    Gestisci richieste
                                </Button>
                                    <RequestModal
                                        channelName={nome} requests={requests} isOpen={showRequestModal} setIsOpen={setShowRequestModal}
                                        hasUpdated={hasUpdated} setHasUpdated={setHasUpdated}
                                    />
                                </>
                            }
                        </div>
                    ) :
                    <>
                    {isFollower ? (
                        <Button  onClick={handleFollow}>
                            {DontFollow}
                            <span className="pl-2">
                                Disicriviti
                            </span>
                        </Button>
                    ):(
                        <Button  onClick={handleFollow}>
                            {FollowIcon}
                            <span className="pl-2">
                                Segui
                            </span>
                        </Button>
                    )}
                    </>
                }
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
        </>
    );
}

export default SinglePageChannel;