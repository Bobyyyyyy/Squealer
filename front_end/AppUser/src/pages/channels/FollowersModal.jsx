import {Modal} from "flowbite-react";

function FollowersModal({isOpen, setIsOpen, followers, channelName, hasUpdated, setHasUpdated}) {
    const setPermission = (name) => {
        fetch("/db/channel/permissions", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: name,
                channel: channelName,
                canWrite: false
            }),
        })
    }
    console.log(followers)
    return (
        <Modal  show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Gestione dei followers
            </Modal.Header>
            <Modal.Body>
                {followers.map((follower) => {
                    return (
                        <div key={follower._id}>
                            {follower.user}
                            <button onClick={()=>setPermission(follower.user)}>
                                cliccami
                            </button>
                        </div>
                    );
                })}
            </Modal.Body>
        </Modal>
    );
}

export default FollowersModal;