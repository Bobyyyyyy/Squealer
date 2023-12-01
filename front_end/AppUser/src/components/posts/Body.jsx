import MappaPost from "./MappaPost.jsx";

function Body({post}) {
    if (post.contentType === "geolocation") {
     //   console.log(post)
    }
    return (
        <div className={"flex justify-center"}>
            {post.contentType === "text" &&
                <p className="">{post.content}</p>
            }
            {post.contentType === "image" &&
                <img className={"aspect-auto w-full"} src={post.content} alt={"image"}/>
            }
            {post.contentType === "geolocation" &&
                <div className=" w-full h-96">
                    <MappaPost stringCoor={post.content} />
                </div>
            }
        </div>
    );
}

export default Body;