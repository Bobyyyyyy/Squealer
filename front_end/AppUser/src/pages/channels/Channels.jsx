import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import CreateChannelModal from "./modals/CreateChannelModal.jsx";
import FiltersModal from "./modals/FiltersModal.jsx";
import {getUsernameFromSessionStore} from "../../utils/usefulFunctions.js";
import {Spinner} from "flowbite-react";

function Channels () {

    const [isLoading, setIsLoading] = useState(true);

    const [channels, setChannels] = useState([]);
    const [officialChannels, setOfficialChannels] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [visibility, setVisibility] = useState('');
    const [owner, setOwner] = useState('');
    const [admin, setAdmin] = useState('');
    const [queryFilter, setQueryFilter] = useState('');
    const [activeOfficialChannel, setActiveOfficialChannel] = useState(true);

    const handleFilters = () => {
        const filter = {
            name: channelName,
            type: visibility,
            creator: owner,
            hasAccess: admin,
            both: (!!owner && !!admin)
        }
        if (!!visibility || !!owner || !!admin) {
            setActiveOfficialChannel(false);
        }
        setQueryFilter(JSON.stringify(filter))
        setShowFilterModal(false)
    }

    const checkRole = (admins, followers, creator, requests) => {
        const name = getUsernameFromSessionStore();
        const isCreator = creator === name;
        const isAdmin = admins.some((adm) => adm === name);
        const isFollower = followers.some((follower) => follower.user === name);
        const isPending = !!requests && requests.some((req) => req.user === name);
        return isCreator ? "creator" : (isAdmin ? "admin" : (isFollower ? "follower" : (isPending) ? "pending" : ""));
    }

    const getChannels = async () => {
        try {
            let res = await  fetch(`/db/channel/?offset=0&limit=10000&filters=${queryFilter}`, {
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
        let resChannel = await getChannels();
        setChannels(resChannel);
        if (activeOfficialChannel) {
            let resOfficialChannels = await getOfficialChannels();
            setOfficialChannels(resOfficialChannels);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchChannels()
            .catch(console.error)
    }, [queryFilter]);

    return (
        <>
            <div className="flex flex-col p-4 max-h-screen pb-20">
                <h1 className="text-xl font-semibold uppercase">Lista canali :</h1>
                <button
                    className="mt-4 button-action"
                    onClick={() => setShowFilterModal(true)}
                >
                    Filtra canali
                </button>
                <FiltersModal
                    isOpen={showFilterModal}
                    setIsOpen={setShowFilterModal}
                    channelName={channelName}
                    setChannelName={setChannelName}
                    owner={owner}
                    setOwner={setOwner}
                    visibility={visibility}
                    setVisibility={setVisibility}
                    admin={admin}
                    setAdmin={setAdmin}
                    handleSearch={handleFilters}
                    activeOfficialChannel={activeOfficialChannel}
                    setActiveOfficialChanel={setActiveOfficialChannel}
                />
                {isLoading ? (
                    <div className="flex items-center justify-center py-8 mt-4">
                        <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                    </div>
                ) : (
                    <div className="flex flex-wrap w-full h-fit overflow-y-scroll mt-2 gap-4">
                        {(channels !== null ? channels : []).map((channel) => {
                            const role = checkRole(channel.admins, channel.followers, channel.creator, channel.requests);
                            return (
                                <Link className="w-full" to={`/channels/${channel.name}`} key={channel._id}>
                                    <div className="flex w-full justify-start items-center gap-3">
                                        <img
                                            src={channel.profilePicture}
                                            alt={`immagine canale ${channel.name}`}
                                            className="w-14 h-14 aspect-square rounded-full object-cover"
                                        />
                                        <div className="flex flex-col overflow-x-hidden w-full mr-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-lg">{channel.name}</span>
                                                <span className="font-medium text-base text-red-600">{channel.type}</span>
                                                <span className="font-medium text-base text-green-600">{role}</span>
                                            </div>
                                            <p className="font-thin truncate text-base">{channel.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        {activeOfficialChannel && (officialChannels !== null ? officialChannels : []).map((channel) => {
                            return (
                                <Link className="w-full" to={`/channels/${channel.name}`} key={channel._id}>
                                    <div className="flex w-full justify-start items-center gap-4">
                                        <img
                                            src={channel.profilePicture}
                                            alt={`immagine canale ${channel.name}`}
                                            className="w-14 h-14 object-cover rounded-full aspect-square"
                                        />
                                        <div className="flex flex-col overflow-x-hidden w-full mr-2">
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
                        {(channels.length === 0 && (!activeOfficialChannel || officialChannels.length === 0)) && (
                            <div>Non ci sono canali</div>
                        )}
                    </div>
                )}
                <button
                    className="mt-4 button-action"
                    onClick={() => setShowCreateModal(true)}
                >
                    Crea canale
                </button>
                <CreateChannelModal isOpen={showCreateModal} setIsOpen={setShowCreateModal} />
            </div>
        </>
    );
}

export default Channels;