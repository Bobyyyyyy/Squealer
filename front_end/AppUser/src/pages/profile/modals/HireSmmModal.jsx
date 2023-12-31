import React, {useEffect, useState} from "react";
import {Button, Modal, Spinner, ToggleSwitch} from "flowbite-react";
import {getUsernameFromSessionStore} from "../../../utils/usefulFunctions.js";

function HireSmmModal({isOpen, setIsOpen, setHasUpdated, smm, hasSMM}) {

    const hireSmm = async (smmUsername, isHiring) => {
        try {
            let res = await fetch(`/db/user/hireSmm`, {
                method: 'PUT',
                body: JSON.stringify({
                    vipUsername: getUsernameFromSessionStore(),
                    smmUsername: smmUsername,
                    isHiring: isHiring
                }),
                headers: {
                    "Content-Type":"application/json"
                }})
            if (res.ok) {
                setHasUpdated(true);
                return await res.json();
            }
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Gestione SMM
            </Modal.Header>
            <Modal.Body>
                <>
                    {hasSMM ? (
                        <div className="flex w-full flex-col justify-center items-start gap-2 py-2 my-2">
                            <div className="flex w-full justify-center items-center gap-4">
                                <img
                                    className="w-12 h-12 rounded-full"
                                    src={smm[0].profilePicture} alt={`${smm[0].user}'s profile picture`}
                                />
                                <span className="text-xl">
                                    {smm[0].username}
                                </span>
                            </div>
                            <div className="flex w-full justify-around items-center">
                                <div className="flex gap-4">
                                    <span className="text-lg">gestisce {smm[0].vipHandled.length} vips</span>
                                </div>
                                <button
                                    className="button-warning"
                                    onClick={() => hireSmm(smm[0].username, false)}>
                                    licenzia
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {smm.map((smmUser) => {
                                return (
                                    <div key={smmUser._id} className="flex w-full flex-col justify-center items-start gap-2 py-2 my-2">
                                        <div className="flex w-full justify-center items-center gap-4">
                                            <img
                                                className="w-12 h-12 rounded-full"
                                                src={smmUser.profilePicture} alt={`${smmUser.username}'s profile picture`}
                                            />
                                            <span className="text-xl">
                                                {smmUser.username}
                                            </span>
                                        </div>
                                        <div className="flex w-full justify-around items-center">
                                            <div className="flex gap-4">
                                                <span className="text-lg">gestisce {smmUser.vipHandled.length} vips</span>
                                            </div>
                                            <button
                                                className="button"
                                                onClick={() => hireSmm(smmUser.username, true)}>
                                                assumi
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {smm.length === 0 &&
                            <div>
                                Non ci sono SMM disponibili al momento!
                            </div>}
                        </>
                    )}
                </>
            </Modal.Body>
        </Modal>
    );
}

export default HireSmmModal;