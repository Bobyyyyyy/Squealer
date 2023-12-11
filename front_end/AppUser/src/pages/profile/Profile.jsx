import {getUsernameFromLocStor, getQuotaInLocStor, getPostByUsername ,getProfilePicByUsername, compressBlob, blob2base64} from "../../components/utils/usefulFunctions.js";
import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx"
import Post from "../../components/posts/Post.jsx";

let imageObj = null;

function Profile () {
    const name = getUsernameFromLocStor();
    const [posts, setPosts] = useState([]);
    const [pic, setPic] = useState(null);
    const [btnChangePic, setBtnChangePic] = useState(false);
    const [imgEmpty, setImgEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const changePic = async () => {
        try {
            console.log("img", imageObj);
            if (imageObj !== null) {
                setImgEmpty(false);
                let content = await blob2base64(await compressBlob(imageObj));
                //setPic(content);
                setPic(URL.createObjectURL(imageObj));
                let res = await fetch("/db/user/profilePic", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newProfilePic: content
                    }),
                });
                //console.log("risposta", res);
                setBtnChangePic(false)
            } else {
                setImgEmpty(true);
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getPostByUsername(name)
            .then((res) => {
                setPosts(res);
                getProfilePicByUsername(name)
                  .then((res) => {
                      setPic(res);
                      setIsLoading(false);
                  })
            })
    }, [pic]);


    const handleLogout = async () => {
        let res = await fetch("/logout");
        window.location.href= res.url;
        localStorage.clear();
    }

    return (
        <>
            <div className={"flex flex-col h-fit"}>
                {/* HEADER */}
                <div className={"flex items-center justify-start p-4 border border-b-black"}>
                    <img className={"w-20 h-20 rounded-full"} src={pic} alt={"profile"} />
                    <div className="flex flex-col h-full justify-between ml-4">
                        <span className={"text-3xl"}>{name}</span>
                        <div className={"flex justify-between"}>
                            <p className={"text-xl"}>Post: {posts.length}</p>
                            <p className={"ml-6 text-xl"}>Seguiti: {posts.length}</p>
                        </div>
                    </div>
                </div>
                <div className={"flex justify-evenly mt-2"}>
                    <p className={"text-xl"}>Quota giornaliera: {posts.length}</p>
                    <p className={"text-xl"}>Caratteri rimasti: {posts.length}</p>
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
                        <input
                            type={"file"}
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                            accept={"image/png, image/jpeg"}
                            onChange={async (e)=> {
                                let imageURL = (URL.createObjectURL(e.target.files[0]));
                                imageObj = e.target.files[0];
                                setImgEmpty(false);
                            }}
                         />
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
            </>
    );
}

export default Profile;