import {useParams} from "react-router-dom";

function SinglePageOfficialChannel() {
    const {nome} = useParams();
    console.log(nome);

    return (
        <div>ciao</div>
    );
}

export default SinglePageOfficialChannel;