import {ProfilePic} from "../assets/index.jsx"
import {getProfilePicture, getUsernameFromLocStor, parseTime} from "../utils/usefulFunctions.js";
import React, {Suspense, useEffect, useState} from "react";

function Title({post}) {

    const allDest = post.destinationArray.map((dest) => {
        return `${dest.destType === "user" ? "@" : "§"}${dest.name}`;
    })

    const tempo = parseTime(post);

    const [profilePic, setProfilePic] = useState();
    const prendiProfilo = async () => {
        try {
            let res = await fetch(`/db/user/profilePic?name=${post.owner}`);
            if (res.ok) {
                let profilePic = await res.json();
                //console.log("pic diocane", profilePic.profilePic);
                setProfilePic(profilePic.profilePic)
                return profilePic;
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(()=> {
        /*
        getProfilePicture(post.owner)
            .then((res)=> {
                console.log("res",res);
                setProfilePic(res)
            })

         */
        prendiProfilo().then()
    }, [])

    function Caricamento () {
        return (
            <h1>
                caricamento
            </h1>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center px-4 py-2">
                <div className="flex w-full items-center" >
                    <Suspense fallback={<Caricamento />}>
                        <img className="w-14 h-14 rounded-full" alt="foto profilo" src={profilePic} />
                    </Suspense>
                    <div className="flex flex-col ml-4 gap-2">
                        <h3 className="text-primary w-fit h-fit">
                            {post.owner}
                        </h3>
                        <h2 className="w-fit h-fit">
                            {allDest.join(", ")}
                        </h2>
                    </div>
                </div>
                    <span className="min-w-fit">{tempo}</span>
            </div>
        </>
    );
}

export default Title;