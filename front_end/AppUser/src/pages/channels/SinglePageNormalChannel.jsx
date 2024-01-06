import React, {useEffect, useRef, useState} from "react";
import {
    getPostByChannelName,
    getUsernameFromSessionStore,
    POST_TO_GET, resetPosts,
    scrollEndDetectorHandler
} from "../../utils/usefulFunctions.js";
import Post from "../../components/posts/Post.jsx";
import {FollowIcon, DontFollow} from "../../components/assets/index.jsx";
import {Spinner} from "flowbite-react";
import RequestModal from "./modals/RequestModal.jsx";
import FollowersModal from "./modals/FollowersModal.jsx";
import AddAdminModal from "./modals/AddAdminModal.jsx";
import RmAdminModal from "./modals/RmAdminModal.jsx";
import ChangeChannelPictureModal from "./modals/ChangeChannelPictureModal.jsx";
import DeleteChannelModal from "./modals/DeleteChannelModal.jsx";
import {useParams} from "react-router-dom";


function SinglePageNormalChannel() {
    const {nome} = useParams()

    // related user states
    const [type, setType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [description, setDescription] = useState("");
    const [role, setRole] = useState("");
    const [channelPic, setChannelPic] = useState(null);
    const [canSeePosts, setCanSeePosts] = useState(false);

    // modals states
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [showRmAdminModal, setShowRmAdminModal] = useState(false);
    const [showChangePicModal, setShowChangePicModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // has updated states
    const [hasUpdatedReq, setHasUpdatedReq] = useState(false);
    const [hasUpdatedFol, setHasUpdatedFol] = useState(false);
    const [hasUpdatedAddAdm, setHasUpdatedAddAdm] = useState(false);
    const [hasUpdatedRmAdm, setHasUpdatedRmAdm] = useState(false);

    // users states
    const [requests, setRequests] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [admins, setAdmins] = useState([]);

    // posts states for infinite scroll
    const [posts, setPosts] = useState([]);
    const currentOffset = useRef(0);
    const lastRequestLength = useRef(0);
    const lastHeightDiv = useRef(0);
    const currentNome = useRef(nome);

    const handleFollow = () => {
        fetch(`/db/channel/follower`, {
            method:"POST",
            body: JSON.stringify({
                user: getUsernameFromSessionStore(),
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

    const getChannelInfo = async () => {
        if (currentNome.current !== nome) {
            console.log("CHANNEL INFO NOME CAMBIATO", currentNome.current, nome)
            return;
        }
        let res = await fetch(`/db/channel/${nome}`);
        if (res.ok) {
            res = await res.json();
            setChannelPic(res.profilePicture);
            setDescription(res.description)
            setRole(res.role);
            setCanSeePosts((res.role !== "Not Follower" || res.role !== "Pending"));
            setFollowers(res.followers.sort((a,b) => (a.user > b.user) ? 1 : ((b.user > a.user) ? -1 : 0)))
            setAdmins(res.admins.sort((a,b) => (a.user > b.user) ? 1 : ((b.user > a.user) ? -1 : 0)))
            setType(res.type);
            if (res.type === "public") {
                setRequests([]);
            } else {
                setRequests(res.requests.sort((a,b) => (a.user > b.user) ? 1 : ((b.user > a.user) ? -1 : 0)))
            }
            setHasUpdatedReq(false);
            setHasUpdatedFol(false);
            setHasUpdatedAddAdm(false);
            setHasUpdatedRmAdm(false);
        }
    }

    const fetchPosts = async () => {
        if (currentNome.current !== nome) {
            console.log("CHANNEL INFO NOME CAMBIATO", currentNome.current, nome)
            return;
        }
        setIsLoading(true);
        if (canSeePosts) {
            console.log("nome", nome,"offset", currentOffset.current)
            let newPosts = await getPostByChannelName(nome, currentOffset.current, POST_TO_GET);
            console.log(newPosts)
            currentOffset.current += newPosts.length;
            lastRequestLength.current = newPosts.length;
            setPosts((prev) => [...prev, ...newPosts]);
        }
        setIsLoading(false);
    };

    const scrollEndDetector = async (event) => {
        event.preventDefault();
        await scrollEndDetectorHandler(lastRequestLength, lastHeightDiv, fetchPosts);
    };

    useEffect(() => {
        getChannelInfo()
            .catch(console.error);
    }, [hasUpdatedReq, hasUpdatedFol, hasUpdatedAddAdm, hasUpdatedRmAdm]);

    useEffect(() => {
        resetPosts(setPosts, currentOffset, lastRequestLength, lastHeightDiv);
        document.addEventListener('scroll', scrollEndDetector, false);
        currentNome.current = nome;
        fetchPosts()
            .catch(console.error);
        return () => {
            document.removeEventListener('scroll', scrollEndDetector);
        }
    }, [canSeePosts, nome]);

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
                <div className="flex flex-col w-full justify-center items-center gap-4 mt-2">
                    <div className="flex flex-col items-center justify-start px-4 gap-2 w-full">
                        <div className="flex justify-center gap-3 w-full items-center">
                            {role === "Creator" ? (
                                <>
                                    <button
                                            onClick={()=>setShowChangePicModal(true)}
                                    >
                                        <img
                                            src={channelPic}
                                            alt={`foto canale ${nome}`}
                                            className={"w-20 h-20 rounded-full object-cover aspect-square"}
                                        />
                                    </button>
                                    <ChangeChannelPictureModal isOpen={showChangePicModal} setIsOpen={setShowChangePicModal} channelName={nome} />
                                </>
                            ) : (
                                <img
                                    src={channelPic}
                                    alt={`foto canale ${nome}`}
                                    className="w-20 h-20 rounded-full object-cover aspect-square"
                                />
                            )}
                            <h3 className="text-center text-2xl font-extrabold">§{nome}</h3>
                        </div>
                        <p className="text-center px-2 break-words text-base">{description}</p>
                    </div>
                    {role === "Creator" || role === "Admin" ? (
                            <div className="flex flex-wrap justify-around items-center gap-4 px-4 w-full">
                               <button className="button"
                                    onClick={()=>setShowFollowerModal(true)}
                                >
                                    Followers
                                </button>
                                <FollowersModal
                                        channelName={nome} followers={followers} isOpen={showFollowerModal} setIsOpen={setShowFollowerModal}
                                        hasUpdated={hasUpdatedFol} setHasUpdated={setHasUpdatedFol}
                                />
                                {type === "private" &&
                                    <>
                                       <button className="button"
                                            onClick={()=>setShowRequestModal(true)}
                                        >
                                             Richieste
                                        </button>
                                        <RequestModal
                                            channelName={nome} requests={requests} isOpen={showRequestModal} setIsOpen={setShowRequestModal}
                                            hasUpdated={hasUpdatedReq} setHasUpdated={setHasUpdatedReq}
                                        />
                                    </>
                                }
                                {role === "Creator" &&
                                    <>
                                       <button className="button"
                                            onClick={()=>setShowAddAdminModal(true)}
                                        >
                                            Aggiungi admin
                                        </button>
                                        <AddAdminModal
                                            channelName={nome} followers={followers} isOpen={showAddAdminModal} setIsOpen={setShowAddAdminModal}
                                            hasUpdated={hasUpdatedAddAdm} setHasUpdated={setHasUpdatedAddAdm}
                                        />

                                       <button className="button-warning"
                                            onClick={()=>setShowRmAdminModal(true)}
                                        >
                                            Rimuovi admin
                                        </button>
                                        <RmAdminModal
                                            channelName={nome} admins={admins} isOpen={showRmAdminModal} setIsOpen={setShowRmAdminModal}
                                            hasUpdated={hasUpdatedRmAdm} setHasUpdated={setHasUpdatedRmAdm}
                                        />
                                        <button
                                            className="button-warning"
                                            onClick={() => setShowDeleteModal((prev) => !prev)}
                                        >
                                            Elimina canale
                                        </button>
                                        <DeleteChannelModal setIsOpen={setShowDeleteModal} isOpen={showDeleteModal} channelName={nome}/>
                                    </>
                                }
                            </div>
                        ) :
                        <div className="mx-auto">
                        {role === "Follower" || role === "Writer" ? (
                           <button className="button-delete"  onClick={handleFollow}>
                                <span className="pl-2">
                                    Disicriviti
                                </span>
                                {DontFollow}
                            </button>
                        ): (role === "Not Follower" ? (
                           <button className="button-action"  onClick={handleFollow}>
                                <span className="pl-2">
                                    Segui
                                </span>
                                {FollowIcon}
                            </button>
                        ) : (
                           <button className="button-delete"  onClick={handleFollow}>
                                <span className="pl-2">
                                    Annulla
                                </span>
                                {DontFollow}
                            </button>
                        ))
                        }
                        </div>
                    }
                    {type === "private" && (role === "Not Follower" || role === "Pending")? (
                        <div>
                            Non puoi ancora vedere i post
                        </div>
                        ) : (
                            <div className="flex flex-wrap w-full gap-8 items-center justify-center pb-20 overflow-y-scroll mt-4" id="postDiv">
                                {posts!==null && posts.map((post)=> {
                                    return(
                                            <Post
                                                key={post._id}
                                                post={post}
                                            />
                                    )})}
                                {posts.length===0 &&
                                    <div className="flex w-full items-center justify-center mt-8 text-2xl text-center px-4">
                                        <p>
                                            Non ci sono ancora post indirizzati al canale {nome}
                                        </p>
                                    </div>
                                }
                            </div>
                    )}
                </div>
            )}
        </>
    );
}

export default SinglePageNormalChannel;