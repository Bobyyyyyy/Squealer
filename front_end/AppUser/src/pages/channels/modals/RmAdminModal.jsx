import {Modal} from "flowbite-react";
import {DenyIcon} from "../../../components/assets/index.jsx";

function RmAdminModal({isOpen, setIsOpen, admins, channelName, hasUpdated, setHasUpdated}) {
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
        <Modal  show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Revoca admin
            </Modal.Header>
            <Modal.Body>
                {admins === undefined || admins.length === 0 ? (
                    <div>Non ci sono admin per questo canale</div>
                ):(
                    admins.map((admin) => {
                        return (
                            <div key={admin} className="flex justify-between py-2">
                                {admin}
                                <div className="flex gap-4">
                                    <span>rendi follower</span>
                                    <button
                                        onClick={() => promote2admin(admin)}
                                    >
                                        {DenyIcon}
                                    </button>
                                </div>
                            </div>
                        );
                    }))}
            </Modal.Body>
        </Modal>
    );
}

export default RmAdminModal;