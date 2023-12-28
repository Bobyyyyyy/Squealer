import Body from "./Body.jsx";
import React, {useEffect, useState} from "react";
import Title from "./Title.jsx";

import {
    Dislike, Like, Heart, MadIcon, CommentIcon
} from "../assets/index.jsx"

import {getUsernameFromSessionStore} from "../../utils/usefulFunctions.js";
import {Button} from "flowbite-react";
import RepliesModal from "./RepliesModal.jsx";

function Post({post}) {

    const buttonsReaction = [
        {id: 'heart', icon: Heart},
        {id: 'thumbs-up', icon: Like},
        {id: 'thumbs-down', icon: Dislike},
        {id: 'heartbreak', icon: MadIcon}
    ];

    const lastReaction = post.reactions.find((reaction)=> reaction.user === getUsernameFromSessionStore());
    const [activeButton, setActiveButton] = useState(lastReaction ? lastReaction.rtype : null);

    const [showRepliesModal, setShowRepliesModal] = useState(false);

    async function changeActiveButton({id}) {
        setActiveButton((id === activeButton) ? undefined : id);
        // si può fare perché lo stato activeButton cambia
        // effettivamente quando il componente viene renderizzato
        const user = getUsernameFromSessionStore();
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
            <Title post={post} />
            <Body post={post} />
            <div className="flex w-full justify-evenly py-2 px-4" >
                {buttonsReaction.map((item) => (
                    <button
                        key = {item.id}
                        onClick={ () => changeActiveButton({id: item.id})}
                        className="w-8 h-8"
                    >
                        { (activeButton === item.id) ? item.icon.active : item.icon.inactive }
                    </button>
                ))}
                <button
                    className="w-8 h-8"
                    onClick={() => setShowRepliesModal((prev) => !prev)}>
                    {CommentIcon}
                </button>
            </div>
            <RepliesModal
                isOpen={showRepliesModal} setIsOpen={setShowRepliesModal} postID={post._id}
            />
        </div>
    </>
    );

}

export default Post;
