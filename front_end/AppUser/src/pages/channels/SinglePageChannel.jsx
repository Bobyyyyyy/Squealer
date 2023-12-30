import {useParams} from "react-router-dom";
import SinglePageNormalChannel from "./SinglePageNormalChannel.jsx";
import SinglePageOfficialChannel from "./SinglePageOfficialChannel.jsx";

function SinglePageChannel() {
    const {nome} = useParams();
    const isOfficial = nome.toUpperCase() === nome;
    return (
        <>
            {isOfficial ? (
                <SinglePageOfficialChannel nome={nome} />
            ) : (
                <SinglePageNormalChannel nome={nome} />
            )}
        </>
    );
}

export default SinglePageChannel;