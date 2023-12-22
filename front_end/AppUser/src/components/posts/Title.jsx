import {getProfilePicByUsername, getUsernameFromLocStor, parseTime} from "../utils/usefulFunctions.js";
import React, {Suspense, useEffect, useState} from "react";
import {Link} from "react-router-dom";

function Title({post}) {

    const [profilePic, setProfilePic] = useState();
    const tempo = parseTime(post);
    /*
    const allDest = post.destinationArray.map((dest) => {
        return `${dest.destType === "user" ? "@" : "§"}${dest.name}`;
    })

     */

    useEffect(()=> {
        getProfilePicByUsername(post.owner)
            .then((res)=>{
                setProfilePic(res)
            })
    }, [])


    return (
        <>
            <div className="flex justify-between items-center px-4 py-2">
                <div className="flex w-full items-center" >
                    <Link to={`/search/${post.owner}`}>
                        <img className="w-14 h-14 rounded-full object-cover" alt="foto profilo" src={profilePic} />
                    </Link>
                    <div className="flex flex-col ml-4 gap-2">
                        <Link to={`/search/${post.owner}`}>
                            <h3 className="text-primary w-fit h-fit">
                                    {post.owner}
                            </h3>
                        </Link>
                        <h2 className="flex gap-2 w-fit h-fit">
                            {post.destinationArray.map((dest) => {
                                const isUser = dest.destType === "user";
                                const name = (isUser ? "@" : "§") + dest.name;
                                console.log(dest.name, name)
                                const path = isUser ? `/search/${dest.name}` : `/channels/${dest.name}`;
                                return(
                                    <Link to={path} key={dest._id}>
                                        <span>{name}</span>
                                    </Link>
                                )})
                            }
                        </h2>
                    </div>
                </div>
                    <span className="min-w-fit">{tempo}</span>
            </div>
        </>
    );
}

export default Title;