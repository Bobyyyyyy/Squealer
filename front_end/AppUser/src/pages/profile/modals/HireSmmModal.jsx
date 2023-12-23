import {useEffect, useState} from "react";
import {Button, Modal, ToggleSwitch} from "flowbite-react";
import {getUsernameFromSessionStore} from "../../../utils/usefulFunctions.js";

function HireSmmModal({isOpen, setIsOpen, setHasUpdated}) {
    const [smm, setSmm] = useState([]);

    const getSmm = async () => {
        let res = await fetch("/db/user/allSmm?limit=100&offset=0", {
            method: 'GET'
        })
        if (res.ok) {
            res = await res.json();
            console.log(res);
            setSmm(res);
        }
    }

    const hireSmm = async (smmUsername) => {
        try {
            let res = await fetch(`/db/user/hireSmm`, {
                method: 'PUT',
                body: JSON.stringify({
                    vipUsername: getUsernameFromSessionStore(),
                    smmUsername: smmUsername
                }),
                headers: {
                    "Content-Type":"application/json"
                }})
            if (res.ok) {
                res = await res.json();
                console.log(res)
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getSmm()
    }, []);

    return (
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Gestione SMM
            </Modal.Header>
            <Modal.Body>
                {smm.map((smm) => {
                    let numVipHandled = smm.vipHandled.length;
                    return (
                        <div key={smm._id} className="flex w-full flex-col justify-center items-start gap-2 py-2 my-2">
                            <div className="flex w-full justify-center items-center gap-4">
                                <img
                                    className="w-12 h-12 rounded-full"
                                    src={smm.profilePicture} alt={`${smm.user}'s profile picture`}
                                />
                                <span className="text-xl">
                                    {smm.username}
                                </span>
                            </div>
                            <div className="flex w-full justify-around items-center">
                                <div className="flex gap-4">
                                    <span className="text-lg">gestisce {numVipHandled} vips</span>
                                </div>
                                <Button onClick={() => hireSmm(smm.username)}>
                                    assumi
                                </Button>
                            </div>
                        </div>
                    );
                })}
                {smm.length === 0 &&
                <div>
                    Non ci sono SMM disponibili al momento!
                </div>}
            </Modal.Body>
        </Modal>
    );
}

export default HireSmmModal;