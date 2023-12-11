import {useParams} from "react-router-dom";
import React, {Suspense, useEffect, useRef, useState} from "react";
import {getUsernameFromLocStor, setUsernameInLocStor} from "../../components/utils/usefulFunctions.js";
import Post from "../../components/posts/Post.jsx";
import {FollowIcon, DontFollow} from "../../components/assets/index.jsx";
import {Button} from "flowbite-react";
import RequestModal from "./RequestModal.jsx";
import FollowersModal from "./FollowersModal.jsx";

function SinglePageChannel() {
    const { nome } = useParams();
    const [type, setType] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [description, setDescription] = useState("");
    const [role, setRole] = useState("");
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showFollowerModal, setShowFollowerModal] = useState(false);

    const [requests, setRequests] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [hasUpdatedReq, setHasUpdatedReq] = useState(false);
    const [hasUpdatedFol, setHasUpdatedFol] = useState(false);
    const canSeePosts = useRef(false);

    const fetchAllPosts = async () => {
        try {
            let res = await fetch(`/db/post/all?offset=0&limit=10&channel=${nome}`);
            console.log(res);
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
                    location.reload();
                }
            })
    }

    useEffect(() => {
        fetch(`/db/channel/${nome}`)
            .then((res) => res.json())
            .then((res)=> {
                const username = getUsernameFromLocStor();
                setDescription(res.description)
                setRole(res.role);
                console.log("role", res.role);
                canSeePosts.current = (res.role !== "Not Follower");
                setFollowers(res.followers.sort((a,b) => (a.user > b.user) ? 1 : ((b.user > a.user) ? -1 : 0)))
                setType(res.type);
                setRequests(res.requests)
                setHasUpdatedReq(false);
                setHasUpdatedFol(false);
                console.log("canale", res)
            })
            .then(() => {
                if (canSeePosts) {
                    fetchAllPosts().
                        then()
                }
            })
    }, [hasUpdatedReq, hasUpdatedFol]);

    return (
        <>
            {isLoading && <p>Caricamento...</p>}
            <div className="flex flex-col w-full justify-center items-center gap-4">
                <h3 className={"text-center text-2xl font-extrabold mt-4"}>§{nome}</h3>
                <p>{description}</p>
                {role === "Creator" || role === "Admin" ? (
                        <div className="flex flex-wrap justify-between items-center gap-4 px-8 w-full">
                            <Button
                                onClick={()=>setShowFollowerModal(true)}
                            >
                                Gestisci follower
                            </Button>
                            <FollowersModal
                                    channelName={nome} followers={followers} isOpen={showFollowerModal} setIsOpen={setShowFollowerModal}
                                    hasUpdated={hasUpdatedFol} setHasUpdated={setHasUpdatedFol}
                            />
                            {type === "private" &&
                                <>
                                    <Button
                                        onClick={()=>setShowRequestModal(true)}
                                    >
                                        Gestisci richieste
                                    </Button>
                                    <RequestModal
                                        channelName={nome} requests={requests} isOpen={showRequestModal} setIsOpen={setShowRequestModal}
                                        hasUpdated={hasUpdatedReq} setHasUpdated={setHasUpdatedReq}
                                    />
                                </>
                            }
                            {role === "Creator" &&
                                <>
                                    <Button
                                        onClick={()=>setShowRequestModal(true)}
                                    >
                                        Aggiungi admin
                                    </Button>
                                    <Button
                                        onClick={()=>setShowRequestModal(true)}
                                    >
                                        Rimuovi admin
                                    </Button>
                                </>
                            }
                        </div>
                    ) :
                    <>
                    {role === "Follower" || role === "Writer" ? (
                        <Button  onClick={handleFollow}>
                            {DontFollow}
                            <span className="pl-2">
                                Disicriviti
                            </span>
                        </Button>
                    ): (role === "Not Follower" ? (
                        <Button  onClick={handleFollow}>
                            {FollowIcon}
                            <span className="pl-2">
                                Segui
                            </span>
                        </Button>
                    ) : (
                        <Button  onClick={handleFollow}>
                            {DontFollow}
                            <span className="pl-2">
                                Annulla
                            </span>
                        </Button>
                    ))
                    }
                    </>
                }
                <div className={"flex flex-wrap w-full gap-8 items-center justify-center h-full pb-20 mt-4 overflow-y-scroll"}>
                    {type === "private" && (role === "Not Follower" || role === "Pending")? (
                        <div>
                            Non puoi ancora vedere i post
                        </div>
                        ) : (
                            <>
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
                            </>
                    )}
                </div>
            </div>
        </>
    );
}

export default SinglePageChannel;