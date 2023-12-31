import {Button, Modal} from "flowbite-react";
import {getUsernameFromSessionStore} from "../../../utils/usefulFunctions.js";

function DeleteAccountModal({isOpen, setIsOpen}) {
    const deleteAccount = async () => {
        console.log("eliminato")
    }

    return (
        <Modal  show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Eliminazione Account
            </Modal.Header>
            <Modal.Body>
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col w-full justify-center gap-0.5 items-center overflow-x-hidden">
                        <p className="text-center font-bold text-xl">
                            Sei sicuro di eliminare l'account
                        </p>
                        <div className="flex gap-2">
                            <span className="font-extrabold text-2xl">
                                {getUsernameFromSessionStore()}
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
                            sarà possibile ripristinare l'account
                        </span>

                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="button-delete"
                    onClick={deleteAccount}
                >
                    CONFERMO
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteAccountModal;