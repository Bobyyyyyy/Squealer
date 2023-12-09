import {Modal} from "flowbite-react";
import {CheckIcon, DenyIcon} from "../../components/assets/index.jsx";
import {useState} from "react";

function RequestModal({isOpen, setIsOpen, requests, channelName, hasUpdated, setHasUpdated}) {
    const [username, setUsername ] = useState();

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
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Richieste pendenti
            </Modal.Header>
            <Modal.Body>
                {requests === undefined || requests.length === 0 ? (
                    <div>Non ci sono richieste pendenti</div>
                ):(
                    <div>
                        {requests.map((user) => {
                            return (
                                <div key={user._id}
                                    className="flex justify-between"
                                >
                                    {user.user}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleRequest(user.user, true)}
                                        >
                                            {CheckIcon}
                                        </button>
                                        <button
                                            onClick={() => handleRequest(user.user, false)}
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
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    );
}

export default RequestModal;