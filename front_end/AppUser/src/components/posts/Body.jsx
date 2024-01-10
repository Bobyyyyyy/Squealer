import MappaPost from "./maps/MappaPost.jsx";
import React from "react";
import {Link} from "react-router-dom";

function Body({post}) {

    const URLHTTPREGEX = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g
    const ACCOUNTREGEX = /\@\w+/g

    const parseContentText = (content, linkRegex, userRegex) => {
        // Initialize arrays to store links and users
        const links = content.match(linkRegex) || [];
        const users = content.match(userRegex) || [];

        // Replace links with a placeholder
        let modifiedContent = content;
        links.forEach((link, index) => {
            modifiedContent = modifiedContent.replace(link, `__LINK_${index}__`);
        });

        // Replace users with a placeholder
        users.forEach((user, index) => {
            modifiedContent = modifiedContent.replace(user, `__USER_${index}__`);
        });

        // Split the modified content based on the placeholders
        const contentArray = modifiedContent.split(/(__LINK_\d+__|__USER_\d+__)/).map((item, index) => {
            if (item.startsWith('__LINK_')) {
                const linkIndex = parseInt(item.replace('__LINK_', ''), 10);
                return (
                    <React.Fragment key={index}>
                        <a className="text-blue-500" href={links[linkIndex]} target="_blank">
                            {links[linkIndex]}
                        </a>
                    </React.Fragment>
                );
            } else if (item.startsWith('__USER_')) {
                const userIndex = parseInt(item.replace('__USER_', ''), 10);
                return (
                    <React.Fragment key={index}>
                        <Link className="text-blue-500" to={`/search/${users[userIndex].slice(1)}`}>
                            {users[userIndex]}
                        </Link>
                    </React.Fragment>
                );
            }
            return <React.Fragment key={index}>{item}</React.Fragment>;
        });

        return <p className="text-base">{contentArray}</p>;
    };


    return (
        <div className={"flex justify-center md:max-h-[28rem]"}>
            {post.contentType === "text" &&
                <div className = "px-4 py-2 overflow-hidden break-words" aria-label={`post testuale di ${post.owner}`} >
                    {parseContentText(post.content, URLHTTPREGEX,ACCOUNTREGEX)}
                </div>
            }
            {post.contentType === "image" &&
                <img className="aspect-auto w-full object-cover overflow-hidden"
                     src={post.content}
                     alt="image"
		     aria-label={`immagine di ${post.owner}`}
                />
            }
            {post.contentType === "geolocation" &&
                <div className="w-full h-96" aria-label={`posizione inviata da ${post.owner}`}>
                    <MappaPost stringCoor={post.content} />
                </div>
            }
            {post.contentType === "video" &&
                <iframe
                    className="w-full aspect-video"
                    src={post.content}
		    aria-label={`video inviato da ${post.owner}`}
                >
                </iframe>

            }
        </div>
    );
}

export default Body;
