import {getUsernameFromLocStor, getPostByUsername, getUserInfoByUsername, compressBlob, blob2base64} from "../../components/utils/usefulFunctions.js";
import {useEffect, useRef, useState} from "react";
import Post from "../../components/posts/Post.jsx";
import {Spinner} from "flowbite-react";

let imageObj = null;

function Profile () {
    const name = getUsernameFromLocStor();
    const [posts, setPosts] = useState([]);
    const [pic, setPic] = useState(null);
    const [btnChangePic, setBtnChangePic] = useState(false);
    const [imgEmpty, setImgEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLink, setIsLink] = useState(false)

    const user = useRef(null);


    const changePic = async () => {
        try {
            if (imageObj !== null) {
                setImgEmpty(false);
                let content = (isLink) ? imageObj : await blob2base64(await compressBlob(imageObj));
                user.current.profilePicture = ((isLink) ? imageObj : URL.createObjectURL(imageObj));
                let res = await fetch("/db/user/profilePic", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newProfilePic: content
                    }),
                });
                setBtnChangePic(false)
                location.reload();
            } else {
                setImgEmpty(true);
            }
        }
        catch (e) {
            console.log(e)
        }
    }


    const fetchData = async () => {
        setIsLoading(true);
        user.current = await getUserInfoByUsername(name);
        const postRes = await getPostByUsername(name);
        setPosts(postRes);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData()
            .catch(console.error)
    }, []);


    const handleLogout = async () => {
        let res = await fetch("/logout");
        window.location.href= res.url;
        localStorage.clear();
    }

    return (
        <>
        {isLoading || user.current === null ? (
            <div className="flex h-screen items-center justify-center">
                <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
            </div>
        ) : (
            <>
            <div className={"flex flex-col h-fit"}>
                {/* HEADER */}
                <div className={"flex items-center justify-start p-4 border border-b-black"}>
                    <img className={"w-20 h-20 rounded-full object-cover"} src={user.current.profilePicture} alt={"profile"} />
                    <div className="flex flex-col h-full justify-between ml-4">
                        <span className={"text-3xl"}>{name}</span>
                        <div className={"flex justify-between"}>
                            <p className={"text-xl"}>Squeals: {posts.length}</p>
                            <p className={"ml-6 text-xl"}>Canali seguiti: {posts.length}</p>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col justify-evenly my-2 mx-auto"}>
                    <p className={"text-xl"}>Quota giornaliera: {user.current.characters.daily}/{user.current.maxQuota.daily}</p>
                    <p className={"text-xl"}>Quota settimanale: {user.current.characters.weekly}/{user.current.maxQuota.weekly}</p>
                    <p className={"text-xl"}>Quota mensile: {user.current.characters.monthly}/{user.current.maxQuota.monthly}</p>
                </div>
            </div>
            <div className="flex justify-between px-6 py-2">
                <button
                    className="bg-primary px-4 py-2  text-lg rounded"
                    onClick={handleLogout}
                >
                    disconettiti
                </button>
                <button
                    className="bg-primary px-4 py-2  text-lg rounded"
                    onClick={()=>setBtnChangePic(!btnChangePic)}
                >
                    cambia foto profilo
                </button>

            </div>
            {btnChangePic &&
                <>
                    <div className="px-4">
                        {imgEmpty &&
                            <div>
                                Inserisci una foto
                            </div>
                        }
                        <label className="relative inline-flex items-center cursor-pointer mt-2">
                            <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                                onClick={()=> {
                                    setIsLink(!isLink);
                                    setImgEmpty(true);
                                }}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium">Galleria o Link</span>
                        </label>
                        {isLink &&
                            <input
                                type="url"
                                placeholder="link immagine"
                                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                                onChange={async (e)=> {
                                    imageObj = e.target.value;
                                    setImgEmpty(false);
                                }}
                            />
                        }
                        {!isLink &&
                            <input
                                type={"file"}
                                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                accept={"image/png, image/jpeg"}
                                onChange={async (e)=> {
                                    imageObj = e.target.files[0];
                                    setImgEmpty(false);
                                }}
                             />
                        }
                    </div>
                    <div className="flex justify-evenly px-4 py-2">
                        <button
                            className="bg-primary px-4 py-2  text-lg rounded"
                            onClick={changePic}
                        >
                            invia
                        </button>
                        <button
                            className="bg-primary px-4 py-2  text-lg rounded"
                            onClick={()=>setBtnChangePic(false)}
                        >
                            annulla
                        </button>
                    </div>
                </>
            }
            {isLoading && <h1>Caricamento...</h1>}
            {posts.map((post)=> {
                //console.log("id",post._id)
                return(
                    <Post
                        key={post._id}
                        post={post}
                    />
                )})}
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