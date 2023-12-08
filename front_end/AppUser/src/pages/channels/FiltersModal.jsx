import { Modal, Button, Radio, Label, Checkbox } from 'flowbite-react';
import React from "react";

function FiltersModal({isOpen, setIsOpen, channelName, setChannelName, setVisibility, isOwner, setIsOwner, handleSearch}){

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
                          onChange={(e)=>setChannelName(e.target.value)}
                      />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                      <Label>
                      <Radio
                          name = "visibility"
                          value="private"
                          onChange={() => setVisibility('private')}
                      />
                          <span className="pl-2">
                            Private
                          </span>
                      </Label>
                      <Label>
                      <Radio
                          name = "visibility"
                          value="public"
                          onChange={() => setVisibility('public')}
                      />
                          <span className="pl-2">
                                Public
                          </span>
                      </Label>
                      <Label>
                      <Radio
                          name = "visibility"
                          value="none"
                          onChange={() => setVisibility('')}
                      />
                          <span className="pl-2">
                                Nessuno
                          </span>
                      </Label>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                      <input
                          type="checkbox"
                          id="creator"
                          onChange={()=>setIsOwner(!isOwner)}
                      />
                      <Label>Sono il creatore</Label>
                  </div>
              </div>
          </Modal.Body>
          <Modal.Footer>
              <Button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                  onClick={handleSearch}
              >
                  Cerca
              </Button>
          </Modal.Footer>
      </Modal>
    );

}

export default FiltersModal;