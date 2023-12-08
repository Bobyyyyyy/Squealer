import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx"
import Searchbar from "../../components/Searchbar.jsx";

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

    return (
        <>
            <div>
                {channels.map((channel) => {
                    return (
                        <div className="flex justify-start gap-4 border-2 border-black" key={channel._id}>
                            <img src={ProfilePic} alt="immagine canale" className="w-14 h-14"/>
                            <span>{channel.name}</span>
                        </div>
                    );
                })
                }
            </div>
        </>
    );
}

export default Channels;