import {Modal} from "flowbite-react";
import {useEffect, useState} from "react";
import {CloseEyeIcon, ShowEyeIcon} from "../../../components/assets/index.jsx";
import {getUsernameFromSessionStore} from "../../../utils/usefulFunctions.js";

function ChangePswModal({isOpen, setIsOpen}) {
    const [currentPsw, setCurrentPsw] = useState('');
    const [newPsw, setNewPsw] = useState('');
    const [confirmNewPsw, setConfirmNewPsw] = useState('');
    const [error, setError] = useState('');

    const canChangePsw = () => {
        let canChange = true;
        if  (!newPsw || !currentPsw || !confirmNewPsw) {
            canChange = false;
            setError("Inserisci tutti i campi");
        } else if (newPsw !== confirmNewPsw) {
            canChange = false;
            setError("La nuova password e la conferma non corrispondono");
        }
        return canChange;
    }

    const changePsw = async () => {
        console.log("cambiata")
        if (canChangePsw()) {
            try {
                let res = await fetch("/db/user/changePsd", {
                    method: 'PUT',
                    body: JSON.stringify({
                        username: getUsernameFromSessionStore(),
                        currentPsw: currentPsw,
                        newPsw: newPsw
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (res.ok) {
                    setError('');
                    setNewPsw('');
                    setCurrentPsw('');
                    setConfirmNewPsw('');
                    setIsOpen(false);
                } else {
                    setError("La password corrente non è corretta");
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    useEffect(() => {
        setError('');
    }, [currentPsw, newPsw, confirmNewPsw]);

    return (
        <Modal show={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Header>
                Cambio Password
            </Modal.Header>
            <Modal.Body>
                <div className="flex flex-col w-full gap-4">
                    <PasswordInput setPsw={setCurrentPsw} pswLabel={"Password corrente"} />
                    <PasswordInput setPsw={setNewPsw} pswLabel={"Nuova password"} />
                    <PasswordInput setPsw={setConfirmNewPsw} pswLabel={"Conferma password"} />
                    <span className="text-red-600 text-lg font-normal">
                        {error}
                    </span>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="button-action"
                    onClick={changePsw}
                >
                    conferma
                </button>
            </Modal.Footer>
        </Modal>
    );
}

function PasswordInput({pswLabel, setPsw}) {
    const [showPsw, setShowPsw] = useState(false);

    return (
        <div className="flex flex-col justify-between items-start gap-2">
            <span className="text-xl md:text-2xl">{pswLabel}</span>
            <div className="flex w-full justify-between gap-2">
                <input
                    type={showPsw ? "text" : "password"}
                    className="border-2 border-gray-500 rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                    placeholder={pswLabel}
                    onChange={e => setPsw(e.target.value)}
                />
                <button
                    onClick={() => setShowPsw((prev)=>!prev)}
                >
                    {showPsw ? (
                        <>
                            {CloseEyeIcon}
                        </>
                    ) : (
                        <>
                            {ShowEyeIcon}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ChangePswModal;