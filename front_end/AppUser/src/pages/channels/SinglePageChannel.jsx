import {useParams} from "react-router-dom";

function SinglePageChannel() {
    const {nome} = useParams();
    const isOfficial = nome.toUpperCase() === nome;
    return (
        <>
            {isOfficial ? (
                //canale ufficiale
            ) : (
                //canale normale
            )}
        </>
    );
}

export default SinglePageChannel;