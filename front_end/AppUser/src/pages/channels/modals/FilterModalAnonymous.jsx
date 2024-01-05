import {Modal, Label} from 'flowbite-react';
import React from "react";

function FilterModalAnonymous({isOpen, setIsOpen, channelName, setChannelName, handleSearch}) {

    return (
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Filtra i canali
            </Modal.Header>
            <Modal.Body>
                <div className="flex flex-col gap-4">
                    <div>
                        <Label className="block mb-1">channelName:</Label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                        />
                    </div>
                    <button
                        className="button-warning"
                        onClick={() => {
                            setChannelName('');
                        }}
                    >
                        Rimuovi filtri
                    </button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="button-action bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto md:w-auto"
                    onClick={handleSearch}
                >
                    Cerca
                </button>
            </Modal.Footer>
        </Modal>
    );

}

export default FilterModalAnonymous;