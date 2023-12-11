import {Modal, ToggleSwitch} from "flowbite-react";

function FollowersModal({isOpen, setIsOpen, followers, channelName, hasUpdated, setHasUpdated}) {
    const setPermission = (name) => {
        let canWrite = followers.some((follower) => {
            if (follower.user === name) {
                return follower.canWrite;
            }
        })
        fetch("/db/channel/permissions", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: name,
                channel: channelName,
                canWrite: !canWrite
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
                Gestione dei followers
            </Modal.Header>
            <Modal.Body>
                {followers.map((follower) => {

                    let canWrite = followers.some((fol) => {
                        if (follower.user === fol.user) {
                            return fol.canWrite;
                        }
                    })
                    return (
                        <div key={follower._id} className="flex justify-between py-2">
                            {follower.user}
                            <div className="flex gap-4">
                                <span> può scrivere</span>
                                <ToggleSwitch
                                    onChange={()=>setPermission(follower.user)}
                                    checked={canWrite}
                                />
                            </div>
                        </div>
                    );
                })}
            </Modal.Body>
        </Modal>
    );
}

export default FollowersModal;