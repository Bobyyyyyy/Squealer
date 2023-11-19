import {ProfilePic} from "../../../assets/index.jsx"
import './stylePost.css'
import {all} from "express/lib/application.js";
function Title({post}) {

    let allDest = post.destinationArray.map((dest) => {
        return dest.name;
    })

    return (
        <>
            <div className="containerOfTitle">
                <div className="title">
                    <div className="imageAndNames" >
                        <div className="containerOfPic">
                            <img className="profilePicture" alt="foto profilo" src={ProfilePic}/>
                        </div>
                        <div className="containerOfNames">
                            <h3 className="profileName">
                                {post.owner}
                            </h3>
                            <h2 className="destinationName">
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