import {Modal, Button, Radio, Label, Checkbox, ToggleSwitch} from 'flowbite-react';
import React from "react";
import {getUsernameFromSessionStore} from "../../../utils/usefulFunctions.js";

function FiltersModal({isOpen, setIsOpen, channelName, setChannelName, visibility,
                          setVisibility, owner, setOwner, admin, setAdmin,handleSearch,
                          activeOfficialChannel, setActiveOfficialChanel
    }) {

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
                  <div className="flex justify-start items-center gap-8">
                      <Label>
                      <Radio
                          name = "visibility"
                          value="private"
                          checked={visibility==='private'}
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
                          checked={visibility==='public'}
                          onChange={() => setVisibility('public')}
                      />
                          <span className="pl-2">
                                Public
                          </span>
                      </Label>
                  </div>
                  <div className="flex items-center gap-2 ">
                      <input
                          type="checkbox"
                          id="creator"
                          checked={!!owner}
                          onChange={() => setOwner((!owner)? getUsernameFromSessionStore() : '')}
                      />
                      <Label>Sono il creatore</Label>
                      <input
                          type="checkbox"
                          id="creator"
                          checked={!!admin}
                          onChange={()=>setAdmin((!admin)? getUsernameFromSessionStore() : '')}
                      />
                      <Label>Sono l'admin</Label>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                      <ToggleSwitch
                          checked={activeOfficialChannel}
                          onChange={setActiveOfficialChanel}
                          label={"Mostra canali ufficiali"}
                          color={"blue"}
                          sizing={"md"}
                      />
                  </div>
                  <button
                    className="button-warning"
                    onClick={() => {
                        setChannelName('');
                        setVisibility('');
                        setOwner('');
                        setAdmin('');
                        setActiveOfficialChanel(true);
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

export default FiltersModal;