import {ProfilePic} from "../assets/index.jsx"

function Title({post}) {

    let allDest = post.destinationArray.map((dest) => {
        return dest.name;
    })
    console.log("title", ProfilePic);
    return (
        <>
            <div className="">
                <div className="">
                    <div className="imageAndNames" >
                        <div className="containerOfPic">
                            <img className="profilePicture" alt="foto profilo" src={ProfilePic}/>
                        </div>
                        <div className="containerOfNames">
                            <h3 className="text-primary">
                                {post.owner}
                            </h3>
                            <h2 className="text-">
                                {allDest.join(", ")}
                            </h2>
                        </div>
                    </div>
                    <div className="containerOfHours">
                        <span className="hours">{post.dateOfCreation}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Title;