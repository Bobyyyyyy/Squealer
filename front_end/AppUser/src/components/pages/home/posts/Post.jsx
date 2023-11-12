import Body from "./Body.jsx";
import React, {useState} from "react";
import Title from "./Title.jsx";
import './stylePost.css'
import {
    Dislike, Like, Heart, HeartBroken
} from "../../../assets/index.jsx"
import Button from "../../../utils/buttons/Button.jsx";
function Post({user, message}) {

    const buttonsReaction = [
        {id: 0, icon: Heart},
        {id: 1, icon: Like},
        {id: 2, icon: Dislike},
        {id: 3, icon: HeartBroken}
    ];

    // controllo bottoni
    const [activeButton, setActiveButton] = useState();

    function changeActiveButton({id}) {
        setActiveButton((id === activeButton) ? undefined : id);
    }

    return(
    <>
        <div className="post">
            <Title user={user}/>
            <Body text={message} />
            <div className="reactionButtons" >
                {buttonsReaction.map( (item) => (
                    <Button
                        key = {item.id}
                        icon = {item.icon}
                        isActive={item.id === activeButton}
                        handleClick={ () => changeActiveButton({id: item.id})}
                        sideEffectFunction={() => alert("width: "+ window.innerWidth+ " height: "+ window.innerHeight)}
                    />
                ))}
            </div>
        </div>
    </>
    );
}

export default Post;