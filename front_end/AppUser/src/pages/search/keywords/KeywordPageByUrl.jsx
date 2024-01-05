import {useParams} from "react-router-dom";
import Post from "../../../components/posts/Post.jsx";
import React, {useEffect, useRef, useState} from "react";
import {Spinner} from "flowbite-react";
import {getPostByKeyword, POST_TO_GET, scrollEndDetectorHandler} from "../../../utils/usefulFunctions.js";
import KeywordPostContainer from "./KeywordPostContainer.jsx";

function KeywordPageByUrl() {
    const {tag} = useParams();

    return (
        <KeywordPostContainer tag={tag} />
    );
}

export default KeywordPageByUrl