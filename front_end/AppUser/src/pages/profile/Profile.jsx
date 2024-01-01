import {
    getUsernameFromSessionStore,
    getPostByUsername,
    getUserInfoByUsername,
    getQuotaByUsername,
    handleLogout
} from "../../utils/usefulFunctions.js";
import React, {useEffect, useRef, useState} from "react";
import Post from "../../components/posts/Post.jsx";
import {Spinner} from "flowbite-react";
import BuyQuotaModal from "./modals/BuyQuotaModal.jsx";
import HireSmmModal from "./modals/HireSmmModal.jsx";
import DeleteAccountModal from "./modals/DeleteAccountModal.jsx";
import ChangeProfilePictureModal from "./modals/ChangeProfilePictureModal.jsx";
import ChangePswModal from "./modals/ChangePswModal.jsx";


function Profile () {
    const name = getUsernameFromSessionStore();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [quota, setQuota] = useState(null);
    const [smm, setSmm] = useState([]);
    const [hasSMM, setHasSMM] = useState(false);

    const [updatedQuota, setUpdatedQuota] = useState(false);
    const [updatedSmm, setUpdatedSmm] = useState(false);

    const [showBuyQuotaModal, setShowBuyQuotaModal] = useState(false);
    const [showChangePicModal, setShowChangePicModal] = useState(false);
    const [showSmmModal, setShowSmmModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const user = useRef(null);

    const getSmm = async () => {
        let filter = JSON.stringify({
            vipUsername: getUsernameFromSessionStore(),
        });
        let res = await fetch(`/db/user/allSmm?limit=100&offset=0&filter=${filter}`, {
            method: 'GET'
        })
        if (res.ok) {
            return await res.json();
        }
    }

    const fetchData = async () => {
        setIsLoading(true);
        const quotaRes = await getQuotaByUsername(name);
        setQuota(quotaRes);
        user.current = await getUserInfoByUsername(name);
        const postRes = await getPostByUsername(name);
        setPosts(postRes);
        setIsLoading(false);
    }

    const updateSmm = async () => {
        let resSMM = await getSmm();
        setHasSMM(resSMM.found);
        setSmm(resSMM.smmUser);
        setUpdatedSmm(false);
    }

    useEffect(() => {
        fetchData()
            .catch(console.error)
    }, []);

    useEffect(() => {
        updateSmm()
            .catch(console.error)
    }, [updatedSmm]);


    useEffect(() => {
        getQuotaByUsername(name)
            .then((res) => {
                setQuota(res);
                setUpdatedQuota(false);
            })
    }, [updatedQuota])


    return (
        <>
        {isLoading || user.current === null || posts === undefined ? (
            <div className="flex h-screen items-center justify-center">
                <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
            </div>
        ) : (
            <>
            <div className={"flex flex-col h-fit"}>
                {/* HEADER */}
                <div className="flex items-center justify-start p-4 border border-b-black">
                    <button
                        onClick={()=>setShowChangePicModal(!showChangePicModal)}
                    >
                        <img
                            src={user.current.profilePicture}
                            className={"w-20 h-20 rounded-full object-cover"}
                            alt={"profile"}
                        />
                    </button>
                    <ChangeProfilePictureModal setIsOpen={setShowChangePicModal} isOpen={showChangePicModal} user={user} />
                    <div className="flex flex-col h-full justify-between ml-4 gap-2">
                        <span className={"text-3xl font-bold"}>{name}</span>
                        <span className={"text-xl"}>Squeals: {posts.length}</span>
                    </div>
                </div>
                <div className={"flex flex-col justify-evenly my-2 mx-auto"}>
                    <p className={"text-xl"}>Quota giornaliera: {quota.characters.daily < 0 ? 0 : quota.characters.daily}/{quota.maxQuota.daily}</p>
                    <p className={"text-xl"}>Quota settimanale: {quota.characters.weekly < 0 ? 0 : quota.characters.weekly}/{quota.maxQuota.weekly}</p>
                    <p className={"text-xl"}>Quota mensile: {quota.characters.monthly < 0 ? 0 : quota.characters.monthly}/{quota.maxQuota.monthly}</p>
                </div>
            </div>
            <div className="flex flex-wrap justify-between gap-4 px-4 py-2">
                <button
                    className="button"
                    onClick={handleLogout}
                >
                    Disconettiti
                </button>
                <button
                    className="button-warning"
                    onClick={() => setShowDeleteModal((prev) => !prev)}
                >
                    Elimina account
                </button>
                <DeleteAccountModal setIsOpen={setShowDeleteModal} isOpen={showDeleteModal} />
                <button
                    className="button"
                    onClick={() => setShowChangePasswordModal((prev) => !prev)}
                >
                    Cambia password
                </button>
                <ChangePswModal setIsOpen={setShowChangePasswordModal} isOpen={showChangePasswordModal} />
                {user.current.typeUser === "vip" &&
                <>
                    <button
                        className="button"
                        onClick={()=>setShowBuyQuotaModal(true)}
                    >
                        Compra quota
                    </button>
                    <BuyQuotaModal isOpen={showBuyQuotaModal} setIsOpen={setShowBuyQuotaModal} setHasUpdated={setUpdatedQuota}/>
                    <button
                        className="button"
                        onClick={()=>setShowSmmModal(true)}
                    >
                        Gestisci SMM
                    </button>
                    <HireSmmModal
                        isOpen={showSmmModal} setIsOpen={setShowSmmModal}
                        setHasUpdated={setUpdatedSmm} smm={smm} hasSMM={hasSMM}
                    />
                </>}
            </div>
            {posts.map((post)=> {
                return(
                    <Post
                        key={post._id}
                        post={post}
                    />
                )})
            }
            {posts.length === 0 &&
            <div className="text-lg text-center mt-4">
                Al momento non ci sono post!
            </div>}
            </>
        )}
        </>
    );
}

export default Profile;