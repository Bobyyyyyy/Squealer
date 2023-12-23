import {getProfilePicByUsername, getUsernameFromLocStor, parseTime} from "../utils/usefulFunctions.js";
import React, {Suspense, useEffect, useState} from "react";

function Title({post}) {

    const [profilePic, setProfilePic] = useState();
    const tempo = parseTime(post);
    const allDest = post.destinationArray.map((dest) => {
        return `${dest.destType === "user" ? "@" : "§"}${dest.name}`;
    })

    useEffect(()=> {
        getProfilePicByUsername(post.owner)
            .then((res)=>{
                setProfilePic(res)
            })
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