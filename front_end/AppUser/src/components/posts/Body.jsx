import MappaPost from "./maps/MappaPost.jsx";
import {useEffect, useState} from "react";

function Body({post}) {

    const URLHTTPREGEX = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g

    const parseContentText = (links) => {
        let content_noLink = '';
        links.forEach(link => {content_noLink = post.content.replace(link,'__SPLIT__').split('__SPLIT__')});
        let innerContent = [];

        for (let i = 0; i < content_noLink.length; i++){
            let newLinkComponent = [];
            if(typeof links[i] !== 'undefined') {
                newLinkComponent.push(<a key={i} className="text-blue-500" href={links[i]} target="_blank">{links[i]}</a>)
                innerContent.push(<p key={i} className="text-base">{content_noLink[i]}{newLinkComponent}</p>)
            }
        }
        return innerContent;
    }


    return (
        <div className={"flex justify-center md:max-h-[28rem]"}>
            {post.contentType === "text" &&
                <>
                    {post.content.match(URLHTTPREGEX) ? (
                        <div className = "p-2 overflow-hidden break-words">
                            {parseContentText(post.content.match(URLHTTPREGEX))}
                        </div>
                    ) : (
                        <p className="p-2 overflow-hidden break-words">{post.content}</p>
                    )}
                </>
            }
            {post.contentType === "image" &&
                <img className="aspect-auto w-full object-cover overflow-hidden" src={post.content} alt={"image"}/>
            }
            {post.contentType === "geolocation" &&
                <div className=" w-full h-96">
                    <MappaPost stringCoor={post.content} />
                </div>
            }
            {post.contentType === "video" &&
                <iframe
                    className="w-full h-full"
                    src={post.content}
                >
                </iframe>

            }
        </div>
    );
}

export default Body;