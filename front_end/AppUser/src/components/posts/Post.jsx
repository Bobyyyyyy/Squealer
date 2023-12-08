import Body from "./Body.jsx";
import React, {Suspense, useEffect, useState} from "react";
import Title from "./Title.jsx";

import {
    Dislike, Like, Heart, MadIcon, ProfilePic
} from "../assets/index.jsx"
import {getUsernameFromLocStor} from "../utils/usefulFunctions.js";

function Post({post}) {

    const buttonsReaction = [
        {id: 'heart', icon: Heart},
        {id: 'thumbs-up', icon: Like},
        {id: 'thumbs-down', icon: Dislike},
        {id: 'heartbreak', icon: MadIcon}
    ];


    // controllo bottoni
    const lastReaction = post.reactions.find((reaction)=> reaction.user === getUsernameFromLocStor());
    const [activeButton, setActiveButton] = useState(lastReaction ? lastReaction.rtype : null);

    async function changeActiveButton({id}) {
        setActiveButton((id === activeButton) ? undefined : id);
        // si può fare perché lo stato activeButton cambia
        // effettivamente quando il componente viene renderizzato
        const user = getUsernameFromLocStor();
        if (id !== activeButton) {
            const newReaction = {
                rtype: id,
                user: user,
                date: new Date().toISOString(),
            }
            await fetch(`/db/post/updateReaction`,{
                method:"PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    postId: post._id,
                    user: user,
                    reaction: id,
                })
            })
        } else {
            await fetch(`/db/post/deleteReaction`,{
                method:"PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    postId: post._id,
                    user: user,
                })
            })
        }
    }

    return(
    <>
        <div className="w-full md:w-[32rem] border border-gray-200">
            <Suspense fallback={<Caricamento />}>
                <Title post={post} />
            </Suspense>
            <div>
                <Body post={post} />
            </div>
            <div className="flex w-full justify-evenly py-2 px-4" >
                {buttonsReaction.map( (item) => (
                    <button
                        key = {item.id}
                        onClick={ () => changeActiveButton({id: item.id})}
                        className="w-8 h-8"
                    >
                        { (activeButton === item.id) ? item.icon.active : item.icon.inactive }
                    </button>
                ))}
            </div>
        </div>
    </>
    );

}
function Caricamento () {
    return (
        <h1>
            caricamento
        </h1>
    );
}

export default Post;
