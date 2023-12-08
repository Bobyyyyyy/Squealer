import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx"
import Searchbar from "../../components/Searchbar.jsx";
import {Link} from "react-router-dom";
import CreateChannelForm from "./CreateChannelForm.jsx";
import CreateChannelModal from "./CreateChannelModal.jsx";

function Channels () {

    const [channels, setChannels] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        fetch("/db/channel/?offset=0&limit=5", {
            method: 'GET'
        })
            .then((res) => {
                console.log("res", res);
                res.json()
                    .then((res) => {
                        console.log("canali", res);
                        setChannels(res)
                    })
                    .catch(()=>{
                        setChannels([])
                    })
            })
    }, []);

    const [creaCanale, setCreaCanale] = useState(false);
    const changeCreaCanale = () => {
        setShowModal(true)
        setCreaCanale(!creaCanale)
    }

    return (
        <>
            <div className="flex flex-col p-4">
                <h1 className="text-xl uppercase">Lista canali:</h1>
                <div className="flex flex-wrap w-full h-fit max-h-[580px] overflow-y-scroll mt-2 gap-4">
                    {channels!==null && channels.map((channel) => {
                        return (
                            <Link className="w-full" to={`/channels/${channel.name}`} key={channel._id} >
                                <div className="flex w-full justify-start gap-4 border-2 border-black" key={channel._id}>
                                    <img src={ProfilePic} alt="immagine canale" className="w-14 h-14"/>
                                    <span>{channel.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                    {channels.length === 0 &&
                        <div>Non ci sono canali</div>}
                </div>
                <button
                    className="py-3 mt-4 bg-primary rounded text-lg font-medium"
                    onClick={changeCreaCanale}
                >
                    Crea canale
                </button>
                {/*creaCanale && <CreateChannelForm />*/}
                <CreateChannelModal isOpen={showModal} setIsOpen={setShowModal} />
            </div>
        </>
    );
}

export default Channels;