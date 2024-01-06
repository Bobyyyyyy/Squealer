import {Modal} from "flowbite-react";
import {CheckIcon, DenyIcon} from "../../../components/assets/index.jsx";
import {Link} from "react-router-dom";

function RequestModal({isOpen, setIsOpen, requests, channelName, hasUpdated, setHasUpdated}) {

    const handleRequest = (name, accepted) => {
        fetch("/db/channel/requests", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: name,
                channel: channelName,
                accepted: accepted
            }),
        })
            .then((res) => {
                setHasUpdated(true);
            })
    }

    return (
        <Modal show={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Header aria-label="Richieste pendenti">Richieste pendenti</Modal.Header>
            <Modal.Body>
                {requests === undefined || requests.length === 0 ? (
                    <div>Non ci sono richieste pendenti</div>
                ) : (
                    <div>
                        {requests.map((follower) => {
                            return (
                                <div key={follower._id} className="flex justify-between">
                                    <div className="flex gap-2 items-center justify-start">
                                        <Link to={`/search/${follower.user}`}>
                                            <img
                                                src={follower.profilePic}
                                                alt={`foto profilo di ${follower.user}`}
                                                className="w-6 h-6 object-cover rounded-full aspect-square"
                                            />
                                        </Link>
                                        <Link to={`/search/${follower.user}`}>
                                            <span>{follower.user}</span>
                                        </Link>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleRequest(follower.user, true)}
                                            aria-label={`Accetta richiesta di ${follower.user}`}
                                        >
                                            {CheckIcon}
                                        </button>
                                        <button
                                            onClick={() => handleRequest(follower.user, false)}
                                            aria-label={`Rifiuta richiesta di ${follower.user}`}
                                        >
                                            {DenyIcon}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default RequestModal;