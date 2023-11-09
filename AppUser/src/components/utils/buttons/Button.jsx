import React, {useEffect, useState} from 'react';
import './styleBtn.css';
import {useNavigate} from "react-router-dom";

function Button({icon, isActive, handleClick, sideEffectFunction, textDescription}) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    if (isActive) {
        sideEffectFunction();
    }


    let btnStyle, insideBtn;

    if (windowWidth <= 760 || (textDescription===undefined)) {
        // Button for small screens (phones)
        insideBtn = (
            <img className="imageIcon" src={isActive ? icon.active : icon.inactive} alt="imageIcon"/>
        );
        btnStyle = "btnStyle btnStyleNoText";
    } else {
        // Button for larger screens
        insideBtn = (
            <>
                <img className="imageIcon" src={isActive ? icon.active : icon.inactive} alt="imageIcon"/>
                <span className="text">{textDescription}</span>
            </>
        );
        btnStyle = "btnStyle btnStyleWithText";
    }


    return (
        <button className={btnStyle} onClick={handleClick}>
            <div className="imageAndText">
                {insideBtn}
            </div>
        </button>
    );
}

export default Button;
