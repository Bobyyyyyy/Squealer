import {NotificationIcon} from "../components/assets/index.jsx";
import NotificationModal from "./NotificationModal.jsx";
import {useState} from "react";

function NotificationButton({notifications, setNotifications}) {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <>
            <button
                className="fixed bottom-14 right-8 z-10 bg-red-700 rounded-full p-3 flex w-fit h-fit m-0"
                onClick={()=> setShowNotifications((prev) => !prev)}
            	aria-label="mostra/nascondi notifiche"
	    >
                <div className="w-10 h-10">
                    {NotificationIcon}
                </div>
            </button>
            <NotificationModal isOpen={showNotifications} setIsOpen={setShowNotifications}
                notifications={notifications} setNotifications={setNotifications}
            />
        </>
    );
}

export default NotificationButton;
