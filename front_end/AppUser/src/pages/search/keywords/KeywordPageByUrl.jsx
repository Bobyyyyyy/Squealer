import {useParams} from "react-router-dom";
import React from "react";
import KeywordPostContainer from "./KeywordPostContainer.jsx";

function KeywordPageByUrl() {
    const {tag} = useParams();

    return (
        <KeywordPostContainer tag={tag} />
    );
}

export default KeywordPageByUrl