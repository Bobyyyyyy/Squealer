import {Modal, ToggleSwitch} from "flowbite-react";
import {blob2base64, compressBlob} from "../../../utils/imageFunctions.js";
import React, { useState} from "react";

let imageObj = null;


function ChangeChannelPictureModal({isOpen, setIsOpen, channelName}) {
    const [imgEmpty, setImgEmpty] = useState(false);
    const [isLink, setIsLink] = useState(false)
    const [preview, setPreview] = useState(false);
    const [img, setImg] = useState(null);
    const changePic = async () => {
        try {
            if (imageObj !== null) {
                setImgEmpty(false);
                let content = (isLink) ? imageObj : await blob2base64(await compressBlob(imageObj));
                let res = await fetch("/db/channel/channelPic", {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        newProfilePic: content,
                        channelName: channelName
                    }),
                });
                if (res.ok) {
                    setIsOpen(false)
                    location.reload();
                }
            } else {
                setImgEmpty(true);
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const closeModal = () => {
        setImg(null);
        setPreview(false);
        imageObj = null;
        setIsOpen(false);
    }


    return (
        <Modal show={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Header aria-label="Cambio foto canale">
                Cambio foto canale
            </Modal.Header>
            <Modal.Body>
                <div className="flex flex-col justify-start items-center gap-4">
                    <div className="flex w-full justify-center gap-4 items-center">
                        <span className="text-sm font-medium">Galleria</span>
                        <ToggleSwitch
                            checked={isLink}
                            onChange={() => {
                                setIsLink((prev) => !prev);
                                setPreview(false);
                                setImg(null);
                            }}
                            aria-label="Seleziona da galleria o da link"
                        />
                        <span className="text-sm font-medium">Link</span>
                    </div>
                    {isLink && (
                        <input
                            type="url"
                            placeholder="link immagine"
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                            onChange={async (e) => {
                                setImg(e.target.value);
                                imageObj = e.target.value;
                                setImgEmpty(false);
                            }}
                            aria-label="Inserisci link immagine"
                        />
                    )}
                    {!isLink && (
                        <input
                            type="file"
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                            accept={"image/png, image/jpeg"}
                            onChange={async (e) => {
                                imageObj = e.target.files[0];
                                setImg(URL.createObjectURL(e.target.files[0]));
                                setImgEmpty(false);
                            }}
                            aria-label="Carica immagine dalla galleria"
                        />
                    )}
                    {!!img && (
                        <>
                            <label className="relative inline-flex items-center cursor-pointer mt-2">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    onClick={() => setPreview(!preview)}
                                />
                                <ToggleSwitch checked={preview} onChange={setPreview} aria-label="Visualizza foto anteprima" />
                                <span className="ms-3 text-sm font-medium">Visualizza foto</span>
                            </label>
                            {preview && (
                                <img
                                    className="h-auto w-auto mx-auto mt-2"
                                    src={img}
                                    alt="preview foto inserita"
                                    aria-label="Anteprima immagine"
                                />
                            )}
                        </>
                    )}
                    {imgEmpty && (
                        <div className="text-red-600" aria-label="Inserisci una foto">
                            Inserisci una foto
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex w-full justify-evenly px-4 py-2">
                    <button
                        className="bg-primary px-4 py-2  text-lg rounded"
                        onClick={changePic}
                        aria-label="Invia"
                    >
                        invia
                    </button>
                    <button
                        className="bg-primary px-4 py-2  text-lg rounded"
                        onClick={closeModal}
                        aria-label="Annulla"
                    >
                        annulla
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default ChangeChannelPictureModal;