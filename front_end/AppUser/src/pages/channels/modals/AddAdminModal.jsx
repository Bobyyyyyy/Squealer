import {Modal} from "flowbite-react";
import {CheckIcon} from "../../../components/assets/index.jsx";

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
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Promuovi followers ad admin
            </Modal.Header>
            <Modal.Body>
                {followers === undefined || followers.length === 0 ? (
                    <div>Non ci sono followers per questo canale</div>
                ):(
                    followers.map((follower) => {
                        return (
                            <div key={follower._id} className="flex justify-between py-2">
                                {follower.user}
                                <div className="flex gap-4">
                                    <span>promuovi ad admin</span>
                                    <button
                                        onClick={() => promote2admin(follower.user)}
                                    >
                                        {CheckIcon}
                                    </button>
                                </div>
                            </div>
                        );
                }))}
            </Modal.Body>
        </Modal>
    );
}

export default AddAdminModal;