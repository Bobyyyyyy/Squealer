import React, {useEffect, useState} from "react";
import {
    getChannelPicByChannelName,
    getPostByChannelName,
    getUsernameFromSessionStore
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

    const [type, setType] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [description, setDescription] = useState("");
    const [role, setRole] = useState("");
    const [channelPic, setChannelPic] = useState(null);
    
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showFollowerModal, setShowFollowerModal] = useState(false);
    const [showAddAdminModal, setShowAddAdimnModal] = useState(false);
    const [showRmAdminModal, setShowRmAdminModal] = useState(false);
    const [showChangePicModal, setShowChangePicModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const [hasUpdatedReq, setHasUpdatedReq] = useState(false);
    const [hasUpdatedFol, setHasUpdatedFol] = useState(false);
    const [hasUpdatedAddAdm, setHasUpdatedAddAdm] = useState(false);
    const [hasUpdatedRmAdm, setHasUpdatedRmAdm] = useState(false);

    const [requests, setRequests] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [admins, setAdmins] = useState([]);

    const [canSeePosts, setCanSeePosts] = useState(false);

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

    const fetchPost = async () => {
        setIsLoading(true);
        const picChannelRes = await getChannelPicByChannelName(nome);
        setChannelPic(picChannelRes.profilePicture);
        if (canSeePosts) {
            const resPost = await getPostByChannelName(nome);
            setPosts(resPost);
        } else {
            setPosts([]);
        }
        setIsLoading(false)
    }

    const updateRequestAdminFollower = async () => {
        let res = await fetch(`/db/channel/${nome}`);
        res = await res.json();
        setDescription(res.description)
        setRole(res.role);
        setCanSeePosts((res.role !== "Not Follower" || res.role !== "Pending"));
        setFollowers(res.followers.sort((a,b) => (a.user > b.user) ? 1 : ((b.user > a.user) ? -1 : 0)))
        setAdmins(res.admins.sort((a,b) => (a.user > b.user) ? 1 : ((b.user > a.user) ? -1 : 0)))
        setType(res.type);
        setRequests(res.requests.sort((a,b) => (a.user > b.user) ? 1 : ((b.user > a.user) ? -1 : 0)))
        setHasUpdatedReq(false);
        setHasUpdatedFol(false);
        setHasUpdatedAddAdm(false);
        setHasUpdatedRmAdm(false);
    }

    useEffect(() => {
        updateRequestAdminFollower()
            .catch(console.error);
    }, [hasUpdatedReq, hasUpdatedFol, hasUpdatedAddAdm, hasUpdatedRmAdm]);


    useEffect(() => {
        fetchPost()
            .catch(console.error);
    }, [canSeePosts, nome]);

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
                                            className={"w-20 h-20 rounded-full object-cover"}
                                        />
                                    </button>
                                    <ChangeChannelPictureModal isOpen={showChangePicModal} setIsOpen={setShowChangePicModal} channelName={nome} />
                                </>
                            ) : (
                                <img
                                    src={channelPic}
                                    alt={`foto canale ${nome}`}
                                    className={"w-20 h-20 rounded-full object-cover"}
                                />
                            )}
                            <h3 className="text-center text-2xl font-extrabold">§{nome}</h3>
                        </div>
                        <p className="text-center px-2 break-words text-sm">{description}</p>
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
                                            onClick={()=>setShowAddAdimnModal(true)}
                                        >
                                            Aggiungi admin
                                        </button>
                                        <AddAdminModal
                                            channelName={nome} followers={followers} isOpen={showAddAdminModal} setIsOpen={setShowAddAdimnModal}
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
                                        <p className="text-center">Non ci sono ancora post indirizzati al canale {nome}</p>
                                    }
                                </>
                        )}
                        </div>
                </div>
            )}
        </>
    );
}

export default SinglePageNormalChannel;