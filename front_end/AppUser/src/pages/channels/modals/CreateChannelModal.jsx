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
        <Modal show={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Header aria-label="Creazione nuovo canale">
                Creazione nuovo canale
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="channelName">
                        Nome canale:
                    </label>
                    <input
                        type="text"
                        id="channelName"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-label="Inserisci il nome del canale"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1" htmlFor="channelDescription">
                        Descrizione:
                    </label>
                    <input
                        type="text"
                        id="channelDescription"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        aria-label="Inserisci la descrizione del canale"
                    />
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <Radio
                        name="visibility"
                        value="private"
                        checked={visibility === 'private'}
                        onChange={() => setVisibility('private')}
                        aria-label="Imposta il canale come privato"
                    />
                    <label className="mr-4">Private</label>
                    <Radio
                        name="visibility"
                        value="public"
                        checked={visibility === 'public'}
                        onChange={() => setVisibility('public')}
                        aria-label="Imposta il canale come pubblico"
                    />
                    <label>Public</label>
                </div>
                {error && (
                    <p className="text-red-500 mb-4" aria-label="Errore nella creazione del canale">
                        {error}
                    </p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="button-action"
                    onClick={handleSubmit}
                    aria-label="Conferma la creazione del canale"
                >
                    conferma
                </button>
            </Modal.Footer>
        </Modal>

    );
}
export default CreateChannelModal;
