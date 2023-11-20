import Body from "./Body.jsx";
import React, {useState} from "react";
import Title from "./Title.jsx";

import {
    Dislike, Like, Heart, MadIcon, ProfilePic
} from "../assets/index.jsx"

function Post({post}) {

    const buttonsReaction = [
        {id: 0, icon: Heart},
        {id: 1, icon: Like},
        {id: 2, icon: Dislike},
        {id: 3, icon: MadIcon}
    ];

    // controllo bottoni
    const [activeButton, setActiveButton] = useState();

    function changeActiveButton({id}) {
        setActiveButton((id === activeButton) ? undefined : id);
    }

    return(
    <>
        <div className="post bg-blue">
            <Title post={post} />
            <Body post={post}/>
            <div className="reactionButtons" >
                {buttonsReaction.map( (item) => (
                    <button
                        key = {item.id}
                        onClick={ () => changeActiveButton({id: item.id})}
                    >
                        { (activeButton === item.id) ? item.icon.active : item.icon.inactive }
                    </button>
                ))}
            </div>
        </div>
    </>
    );
}

export default Post;