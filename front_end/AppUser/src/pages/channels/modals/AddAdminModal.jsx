import {Modal} from "flowbite-react";
import {CheckIcon} from "../../../components/assets/index.jsx";
import {Link} from "react-router-dom";

function AddAdminModal({isOpen, setIsOpen, followers, channelName, hasUpdated, setHasUpdated}) {
    const promote2admin = (name) => {
        fetch("/db/channel/admin", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: name,
                channel: channelName,
            }),
        }).then((res) => {
            if (res.ok) {
                setHasUpdated(true);
            }
        })
    }

    return (
        <Modal show={isOpen} onClose={() => setIsOpen(false)}
               aria-label="Promuovi followers ad admin"
        >
            <Modal.Header>
                Promuovi followers ad admin
            </Modal.Header>
            <Modal.Body>
                {followers === undefined || followers.length === 0 ? (
                    <div>Non ci sono followers per questo canale</div>
                ) : (
                    followers.map((follower) => (
                        <div key={follower._id} className="flex justify-between py-2">
                            <div className="flex gap-2 items-center justify-start">
                                <Link to={`/search/${follower.user}`}>
                                    <img
                                        src={follower.profilePic}
                                        alt={`foto profilo di ${follower.user}`}
                                        className="w-6 h-6 object-cover rounded-full"
                                    />
                                </Link>
                                <Link to={`/search/${follower.user}`}>
                                    <span>
                                        {follower.user}
                                    </span>
                                </Link>
                            </div>
                            <div className="flex gap-4">
                                <span>promuovi ad admin</span>
                                <button
                                    onClick={() => promote2admin(follower.user)}
                                    aria-label={`Promuovi ${follower.user} ad admin`}
                                >
                                    {CheckIcon}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </Modal.Body>
        </Modal>
    );
}

export default AddAdminModal;