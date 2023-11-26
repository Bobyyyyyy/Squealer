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
        <div className="w-full md:w-[32rem] border border-gray-200">
            <Title post={post} />
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

export default Post;