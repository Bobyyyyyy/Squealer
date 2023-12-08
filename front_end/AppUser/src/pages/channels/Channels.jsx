import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx"
import Searchbar from "../../components/Searchbar.jsx";
import {Link} from "react-router-dom";
import CreateChannelModal from "./CreateChannelModal.jsx";
import FiltersModal from "./FiltersModal.jsx";

function Channels () {

    const [channels, setChannels] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [nuovoCanale, setNuovoCanale] = useState(false)
    const [channelName, setChannelName] = useState('');
    const [visibility, setVisibility] = useState('');
    const [isOwner, setIsOwner] = useState('');
    const [queryFilter, setQueryFilter] = useState('');

    useEffect(() => {
        console.log("query",queryFilter)
        fetch(`/db/channel/?offset=0&&name=giovanni`, {
            method: 'GET'
        })
            .then((res) => {
                res.json()
                    .then((res) => {
                        setChannels(res)
                        setNuovoCanale(false);
                    })
                    .catch(()=>{
                        setChannels([])
                    })
            })
    }, [nuovoCanale, queryFilter]);

    const handleFilters = () => {
        //let type = (!!visibility) ? `&&type=${visibility}` : '';
        //let creator = (isOwner);
        //const query = name+type;
        const filter = {
            name: channelName,
            type: visibility
        }

        setQueryFilter(JSON.stringify(filter))
        //console.log(query)
        setShowFilterModal(false)
    }

    return (
        <>
            <div className="flex flex-col p-4">
                <h1 className="text-xl uppercase">Lista canali:</h1>
                <button
                    className="py-3 mt-4 bg-primary rounded text-lg font-medium"
                    onClick={()=>setShowFilterModal(true)}
                >
                    Filtra canali
                </button>
                <FiltersModal
                    isOpen={showFilterModal} setIsOpen={setShowFilterModal}
                    channelName={channelName} setChannelName={setChannelName}
                    isOwner={isOwner} setIsOwner={setIsOwner}
                    setVisibility={setVisibility} handleSearch={handleFilters}
                />
                <div className="flex flex-wrap w-full h-fit max-h-[580px] overflow-y-scroll mt-2 gap-4">
                    {channels!==null && channels.map((channel) => {
                        return (
                            <Link className="w-full" to={`/channels/${channel.name}`} key={channel._id} >
                                <div className="flex w-full justify-start gap-4 border-2 border-black" key={channel._id}>
                                    <img src={ProfilePic} alt="immagine canale" className="w-14 h-14"/>
                                    <div className="flex flex-col overflow-x-hidden mx-2">
                                        <span className="font-semibold text-lg">{channel.name}</span>
                                        <span className="font-thin text-base">{channel.description}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                    {channels.length === 0 &&
                        <div>Non ci sono canali</div>}
                </div>
                <button
                    className="py-3 mt-4 bg-primary rounded text-lg font-medium"
                    onClick={()=> setShowCreateModal(true)}
                >
                    Crea canale
                </button>
                <CreateChannelModal isOpen={showCreateModal} setIsOpen={setShowCreateModal} setNuovoCanale={setNuovoCanale} />
            </div>
        </>
    );
}

export default Channels;