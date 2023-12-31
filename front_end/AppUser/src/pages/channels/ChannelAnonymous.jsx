import React, {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx"
import {Link} from "react-router-dom";
import FiltersModal from "./modals/FiltersModal.jsx";
import {Spinner} from "flowbite-react";
import FilterModalAnonymous from "./modals/FilterModalAnonymous.jsx";

function ChannelAnonymous () {

    const [isLoading, setIsLoading] = useState(true);

    const [officialChannels, setOfficialChannels] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [hasUpdated, setHasUpdated] = useState(false);

    const handleFilters = () => {
        setShowFilterModal(false)
        setHasUpdated(true);
    }

    const getOfficialChannels = async () => {
        try {
            let res = await  fetch(`/db/official/all?offset=0&limit=10000&filter=${channelName}`, {
                method: 'GET'
            });
            if (res.ok) {
                return await res.json();
            }
            return [];
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    const fetchChannels = async () => {
        setIsLoading(true);
        let resOfficialChannels = await getOfficialChannels();
        setOfficialChannels(resOfficialChannels);
        setHasUpdated(false);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchChannels()
            .catch(console.error)
    }, [hasUpdated]);

    return (
        <>
            <div className="flex flex-col p-4">
                <h1 className="text-xl font-semibold uppercase">Lista canali :</h1>
                <button
                    className="mt-4 button-action"
                    onClick={()=>setShowFilterModal(true)}
                >
                    Filtra canali
                </button>
                <FilterModalAnonymous
                    isOpen={showFilterModal} setIsOpen={setShowFilterModal}
                    channelName={channelName} setChannelName={setChannelName}

                    handleSearch={handleFilters}
                />
                {isLoading ? (
                    <div className="flex items-center justify-center py-8 mt-4">
                        <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                    </div>
                ) : (
                    <div className="flex flex-wrap w-full h-fit max-h-[580px] overflow-y-scroll mt-2 gap-4">
                        {officialChannels!==null && officialChannels.map((channel) => {
                            return (
                                <Link className="w-full" to={`/channels/${channel.name}`} key={channel._id} >
                                    <div className="flex w-full justify-start gap-4">
                                        <img src={channel.profilePicture} alt="immagine canale" className="w-14 h-14 object-cover rounded-full"/>
                                        <div className="flex flex-col overflow-x-hidden  mx-2 w-full">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-lg">{channel.name}</span>
                                                <span className="font-medium text-base text-red-600">ufficiale</span>
                                            </div>
                                            <p className="font-thin truncate text-base">{channel.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        {officialChannels.length === 0 &&
                            <div>Non ci sono canali</div>}
                    </div>
                )}
             </div>
        </>
    );
}

export default ChannelAnonymous;