import React from "react";
import {Link} from "react-router-dom";
import {parseTime} from "../../utils/timeFunctions.js";

function Title({post}) {

    const tempo = parseTime(post);

    return (
        <>
            <div className="flex justify-between items-center gap-3 px-4 py-2 ">
                <div className="flex w-full items-center truncate gap-4">
                    <Link to={`/search/${post.owner}`} className="w-14 h-14 aspect-square"
                          aria-label={`vai alla pagina di ${post.owner}`}
                    >
                        <img className="w-full h-full rounded-full object-cover" alt="foto profilo" src={post.profilePicture}
                             aria-label={`immagine di profilo di ${post.owner}`}
                        />
                    </Link>
                    <div className="flex flex-col gap-2">
                        <Link to={`/search/${post.owner}`} className="text-primary font-semibold text-lg w-fit h-fit"
                              aria-label={`vai alla pagina di ${post.owner}`}
                        >
                            {post.owner}
                        </Link>
                        <p className="flex gap-2 w-fit h-fit" aria-label="insieme dei destinatari">
                            {post.destinationArray.map((dest) => {
                                const symbol = (dest.destType === "user" ? "@" : (dest.destType === "channel" ? "§" : (dest.destType === "keyword" ? "#" : "error")));
                                const name = symbol + dest.name;
                                const path = (symbol === "@" ? `/search/${dest.name}` : (symbol === "§" ?`/channels/${dest.name}` : (symbol === "#" ? `/search/keyword/${dest.name}`: "/")));
                                return(
                                    <Link to={path} key={dest._id} aria-label={`vai alla pagina di ${dest.name}`}>
                                        <span>{name}</span>
                                    </Link>
                                )})
                            }
                            {post.officialChannelsArray.map((dest) => {
                                return(
                                    <Link to={`/channels/${dest}`} key={dest} aria-label={`vai al canale ufficiale ${dest}`}>
                                        <span>§{dest}</span>
                                    </Link>
                                )})
                            }
                        </p>
                    </div>
                </div>
                <span className="min-w-fit">{tempo}</span>
            </div>
        </>
    );
}

export default Title;