import React from "react";
import {Link} from "react-router-dom";
import {parseTime} from "../../utils/timeFunctions.js";

function Title({post}) {

    const tempo = parseTime(post);

    return (
        <>
            <div className="flex justify-between items-center px-4 py-2">
                <div className="flex w-full items-center" >
                    <Link to={`/search/${post.owner}`}>
                        <img className="w-14 h-14 rounded-full object-cover" alt="foto profilo" src={post.profilePicture} />
                    </Link>
                    <div className="flex flex-col ml-4 gap-2">
                        <Link to={`/search/${post.owner}`}>
                            <h3 className="text-primary font-semibold text-lg w-fit h-fit">
                                {post.owner}
                            </h3>
                        </Link>
                        <h2 className="flex gap-2 w-fit h-fit">
                            {post.destinationArray.map((dest) => {
                                const symbol = (dest.destType === "user" ? "@" : (dest.destType === "channel" ? "§" : (dest.destType === "keyword" ? "#" : "error")));
                                const name = symbol + dest.name;
                                const path = (symbol === "@" ? `/search/${dest.name}` : (symbol === "§" ?`/channels/${dest.name}` : (symbol === "#" ? `/search/keyword/${dest.name}`: "/")));
                                return(
                                    <Link to={path} key={dest._id}>
                                        <span>{name}</span>
                                    </Link>
                                )})
                            }
                            {post.officialChannelsArray.map((dest) => {
                                return(
                                    <Link to={`/channels/${dest}`} key={dest}>
                                        <span>§{dest}</span>
                                    </Link>
                                )})
                            }
                        </h2>
                    </div>
                </div>
                    <span className="min-w-fit">{tempo}</span>
            </div>
        </>
    );
}

export default Title;