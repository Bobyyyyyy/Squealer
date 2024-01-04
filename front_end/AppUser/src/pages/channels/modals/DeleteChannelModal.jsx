import {Modal} from "flowbite-react";
import {getUsernameFromSessionStore, setToastNotification} from "../../../utils/usefulFunctions.js";

function DeleteChannelModal({isOpen, setIsOpen, channelName}) {
    const DeleteChannel = async () => {
        console.log(channelName, typeof channelName)
        try {
            await fetch(`/db/channel/${channelName}`,{
                method: 'DELETE',
            });
            setIsOpen(false);
            setToastNotification("Canale eliminato con successo", "success");
            window.location.href = "/user/";
        } catch (e) {
            console.log(e);
            setToastNotification("Oh no! Qualcosa è andato storto nell'eliminazione del canale", "failure");
            window.location.href = "/user/channels";
        }
    }

    return (
        <Modal  show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Eliminazione Canale
            </Modal.Header>
            <Modal.Body>
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col w-full justify-center gap-0.5 items-center overflow-x-hidden">
                        <p className="text-center font-bold text-xl">
                            Sei sicuro di eliminare il canale
                        </p>
                        <div className="flex gap-2">
                            <span className="font-extrabold text-2xl">
                                {channelName}
                            </span>
                            <span className="font-extrabold text-2xl">
                                ?
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-1 text-center text-lg">
                        <span>
                            Una volta fatto
                        </span>
                        <span className="uppercase font-bold">
                            non
                        </span>
                        <span>
                            sarà possibile ripristinare il canale
                        </span>

                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="button-delete"
                    onClick={DeleteChannel}
                >
                    CONFERMO
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteChannelModal;