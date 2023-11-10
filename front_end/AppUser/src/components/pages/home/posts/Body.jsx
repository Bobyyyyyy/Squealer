import './stylePost.css'
function Body(props) {
    return(
        <p className="message">{props.text}</p>
    );
}

export default Body;