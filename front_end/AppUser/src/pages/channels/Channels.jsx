import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx"
import Searchbar from "../../components/Searchbar.jsx";
import {Link} from "react-router-dom";

function Channels () {

    const [channels, setChannels] = useState([]);

    useEffect(() => {

        fetch("/db/channel/?offset=0&limit=5", {
            method: 'GET'
        })
            .then((res) => {
                console.log("res", res);
                res.json()
                    .then((channels) => {
                        console.log(channels);
                        setChannels(channels)
                    })
            })
    }, []);

    let channelsfake = [
        {name:"mario"},{name:"giovanni"},{name:"marco"},{name:"mario"},{name:"mario"},    {name:"mario"},{name:"mario"},{name:"mario"},{name:"mario"},{name:"mario"},
        {name:"mario"},{name:"mario"},{name:"mario"},{name:"mario"},{name:"mario"},
    ];

    const creaCanale = () => {

    }

    return (
        <>
            <div className="flex flex-col p-4">
                <h1 className="text-xl uppercase">Lista canali:</h1>
                <div className="flex flex-wrap w-full h-fit max-h-[580px] overflow-y-scroll mt-2 gap-4">
                    {channelsfake.map((channel) => {
                        return (
                            <Link className="w-full" to={`/channels/${channel.name}`} >
                                <div className="flex w-full justify-start gap-4 border-2 border-black" key={channel._id}>
                                    <img src={ProfilePic} alt="immagine canale" className="w-14 h-14"/>
                                    <span>{channel.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <button
                    className="py-3 mt-4 bg-primary rounded text-lg font-medium"
                    onClick={creaCanale}
                >
                    Crea canale
                </button>
            </div>
        </>
    );
}

export default Channels;