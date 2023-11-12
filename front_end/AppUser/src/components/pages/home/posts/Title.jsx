import {ProfilePic} from "../../../assets/index.jsx"
import './stylePost.css'
function Title(props) {
    return (
        <>
            <div className="containerOfTitle">
                <div className="title">
                    <div className="imageAndNames" >
                        <div className="containerOfPic">
                            <img className="profilePicture" alt="foto profilo" src={ProfilePic}/>
                        </div>
                        <div className="containerOfNames">
                            <h3 className="profileName">{props.user.name}</h3>
                            <h2 className="destinationName">{props.user.age} anni</h2>
                        </div>
                    </div>
                    <div className="containerOfHours">
                        <span className="hours">10 h fa</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Title;