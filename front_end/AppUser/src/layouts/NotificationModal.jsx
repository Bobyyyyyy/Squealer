import {Modal} from "flowbite-react";
import {getUsernameFromSessionStore} from "../utils/usefulFunctions.js";
import {Link} from "react-router-dom";

function NotificationModal({isOpen, setIsOpen, notifications, setNotifications}) {

    const prettyNotification= notifications2pretty();

    function notifications2pretty() {
        const uniqueUsersByChannel = {};

        notifications.forEach(item => {
            const {sender, channel} = item;
            if (!uniqueUsersByChannel[channel]) {
                uniqueUsersByChannel[channel] = new Set();
            }
            uniqueUsersByChannel[channel].add(sender);
        });

        // Convert the object values to an array
        const resultArray = Object.entries(uniqueUsersByChannel).map(([channel, nameSet]) => ({
            channel,
            names: Array.from(nameSet)
        }));
        return resultArray;
    }

    const deleteNotifications = async () => {
        try {
            await fetch(`/db/notification`,{
                method: 'DELETE',
                body: {
                    user: getUsernameFromSessionStore()
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    const handleDeleteNotifications = async () => {
        await deleteNotifications();
        setIsOpen(false);
    }

    return (
            <Modal show={isOpen} onClose={() => setIsOpen(false)}>
                <Modal.Header>
                    Notifiche
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col w-full justify-start items-start">
                        {prettyNotification.map((notification, index) => {
                            let users = notifications.filter((not) => not.channel === notification.channel);
                            return (
                                    <div key={index} className="flex flex-col w-full my-2">
                                        <div className="flex gap-1.5">
                                            In
                                            <Link to={`/channels/${notification.channel}`} className="font-semibold text-blue-500">
                                                §{notification.channel}
                                            </Link>
                                            ci sono
                                            <span className="font-semibold">
                                                {notification.names.length} nuovi post
                                            </span>
                                        </div>
                                        <div className="flex">
                                            I creatori sono:
                                            <p className="flex ml-2 gap-2">
                                                {notification.names.map((user) => <Link to={`/search/${user}`} key={user} className="text-blue-500" >@{user}</Link>)}
                                            </p>
                                        </div>
                                    </div>
                                );
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="button-delete"
                        onClick={handleDeleteNotifications}
                    >
                        Segna come lette
                    </button>
                </Modal.Footer>
            </Modal>
        );
}

export default NotificationModal