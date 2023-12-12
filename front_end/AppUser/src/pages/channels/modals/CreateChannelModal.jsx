import React, { useState } from 'react';
import { Modal, Button, Radio, Label } from 'flowbite-react';
import {getUsernameFromLocStor} from "../../../components/utils/usefulFunctions.js";
function CreateChannelModal({ isOpen, setIsOpen, setNuovoCanale}) {

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
                creator: getUsernameFromLocStor(),
            }
            console.log("channel creato:", channel)
            await fetch("/db/channel",{
                method:"POST",
                body: JSON.stringify(channel),
                headers: {
                    "Content-Type":"application/json"
                }
            })

        }catch (err){
            console.log(err)  //GESTIRE ERRORE
        }
    }

    const handleSubmit = () => {
        console.log(!!name && !!description && !!visibility)
        if (!!name && !!description && !!visibility) {
            createChannel()
                .then(()=>{
                    cleanInput();
                    setIsOpen(false);
                    setNuovoCanale(true);
                })
        } else {
            setError('Inserisci tutti i campi.');
        }
    };


    return (
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>Creazione nuovo canale</Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <Label className="block mb-1">Name:</Label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <Label className="block mb-1">Description:</Label>
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
                    <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
}
export default CreateChannelModal;
