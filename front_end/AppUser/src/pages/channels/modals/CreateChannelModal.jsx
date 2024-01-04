import React, { useState } from 'react';
import { Modal, Button, Radio, Label } from 'flowbite-react';
import {getUsernameFromSessionStore, setToastNotification} from "../../../utils/usefulFunctions.js";
function CreateChannelModal({ isOpen, setIsOpen}) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('');
    const [error, setError] = useState('');

    const cleanInput = () => {
        setError('');
        setName('');
        setDescription('')
        setVisibility('')
    }

    const createChannel = async () => {
        try{
            const channel = {
                name:   name.toLowerCase().split(' ').join('_'),
                description: description,
                type: visibility,
                creator: getUsernameFromSessionStore(),
            }
            let res = await fetch("/db/channel",{
                method:"POST",
                body: JSON.stringify(channel),
                headers: {
                    "Content-Type":"application/json"
                }
            })
            if (res.ok) {
                cleanInput();
                setIsOpen(false);
                setToastNotification("Canale creato con successo", "success");
                window.location.href = "/user/channels"
            } else {
                setError("Nome già utilizzato");
            }
        } catch (err){
            console.log(err);
            setToastNotification("Oh no! Qualcosa è andato storto nell'invio del canale", "failure");
            window.location.href = "/user/channels"
        }
    }

    const handleSubmit = async () => {
        if (!!name && !!description && !!visibility) {
            await createChannel();
        } else {
            setError('Inserisci tutti i campi.');
        }
    };


    return (
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>Creazione nuovo canale</Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <Label className="block mb-1">Nome canale:</Label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <Label className="block mb-1">Descrizione:</Label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <Radio
                        name = "visibility"
                        value="private"
                        onChange={() => setVisibility('private')}
                    />
                    <Label className="mr-4">
                        Private
                    </Label>
                    <Radio
                        name = "visibility"
                        value="public"
                        onChange={() => setVisibility('public')}
                    />
                    <Label>
                        Public
                    </Label>
                </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                <Modal.Footer>
                    <button
                        className="button-action"
                        onClick={handleSubmit}
                    >
                        conferma
                    </button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
}
export default CreateChannelModal;
