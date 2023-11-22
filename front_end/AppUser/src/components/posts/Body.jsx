function Body({post}) {

    return (
        <div className={"flex justify-center"}>
            {post.contentType === "text" &&
                <p className="">{post.content}</p>
            }
            {post.contentType === "image" &&
                <img className={"aspect-auto w-full"} src={post.content} alt={"image"}/>
            }
        </div>
    );
}

export default Body;