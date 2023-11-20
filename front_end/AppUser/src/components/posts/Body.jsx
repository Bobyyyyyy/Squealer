function Body({post}) {
    return( (post.contentType === "text") ? (
        <p className="message">{post.content}</p>
        ) : (<img className={"message"} src={post.content} alt={"image"}/>
        ));
}

export default Body;