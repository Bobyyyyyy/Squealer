import {ProfilePic} from "../assets/index.jsx"
import {parseTime} from "../utils/usefulFunctions.js";


function Title({post, profilePic}) {

    let allDest = post.destinationArray.map((dest) => {
        return dest.name;
    })

    const tempo = parseTime(post);
    console.log('sus',tempo)

    return (
        <>
            <div className="flex justify-between items-center px-4 py-2">
                <div className="flex w-full items-center" >
                    <img className="w-14 h-14 rounded-full" alt="foto profilo" src={ProfilePic} />
                    <div className="flex flex-col ml-4 gap-2">
                        <h3 className="text-primary w-fit h-fit">
                            {post.owner}
                        </h3>
                        <h2 className="w-fit h-fit">
                            {allDest.join(", ")}
                        </h2>
                    </div>
                </div>
                    <span className="min-w-fit">{tempo}</span>
            </div>
        </>
    );
}

export default Title;