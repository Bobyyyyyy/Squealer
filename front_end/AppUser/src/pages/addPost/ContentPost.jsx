import React, {useEffect, useState} from "react";
import Mappa from "../../components/posts/maps/Mappa.jsx";
import {ArrowRightIcon} from "../../components/assets/index.jsx";

function ContentPost({type, quota, currentQuota, setCurrentQuota,
                         content, setContent, setImgAsFile, position, setPosition,
                         destinations, handleError, isQuotaNegative, realQuota}) {

    const [isLink, setIsLink] = useState(false)
    const [preview, setPreview] = useState(false);
    const [counterActive, setCounterActive] = useState(false);
    const [showCounter, setShowCounter] = useState(false);

    const [hasLink, setHasLink] = useState(false);
    const [isShorterLink, setIsShorterLink] = useState(false);
    const [textLink, setTextLink] = useState([]);

    const QUOTA_FOR_IMAGE = 125;
    const EXTRA_CHARACTERS = 50;
    const URLHTTPREGEX = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g

    const handleQuotaChange = (e, type) => {
        if (has2removeQuota()) {
            const quota2remove = (type === "text") ? e.target.value.length : QUOTA_FOR_IMAGE;
            updateQuota(quota2remove)
        }
    }

    const has2removeQuota = () => {
        return destinations.includes("§") || destinations.includes("#");
    }

    const isCurrentQuotaNegative = () => {
        return currentQuota?.monthly < 0 || isQuotaNegative();
    }

    const updateQuota = (quota2remove) => {
        let remainingDquota =  quota.characters.daily - quota2remove;
        let remainingWquota = quota.characters.weekly  - quota2remove;
        let remainingMquota = quota.characters.monthly  - quota2remove;

        realQuota.current = {
            daily: remainingDquota,
            weekly: remainingWquota,
            monthly: remainingMquota
        }

        let extraQuota2remove = 0;

        if(remainingDquota < 0) {
            remainingWquota += remainingDquota;
            extraQuota2remove += Math.abs(2*remainingDquota);
            remainingDquota = 0;
        }

        if(remainingWquota < 0) {
            remainingMquota += remainingWquota;
            extraQuota2remove += Math.abs(2*remainingWquota);
            remainingWquota = 0;
        }

        let showError = false;

        if (extraQuota2remove > EXTRA_CHARACTERS) {
            handleError("Hai finito i caratteri extra");
            showError = true;
        } else {
            handleError("");
        }
        if (remainingMquota < 0) {
            handleError("Hai finito la quota");
        } else if (!showError) {
            handleError("");
        }

        setCurrentQuota({
            daily: remainingDquota,
            weekly: remainingWquota,
            monthly: remainingMquota
        });
    }

    async function insertShorter() {
        let oldLink = textLink[0];
        let res = await fetch(`https://csclub.uwaterloo.ca/~phthakka/1pt/addURL.php?url=${oldLink}`);
        if (res.ok) {
            let newLInk = `https://1pt.co/${(await res.json()).short}`;
            let newContent = content.replace(oldLink, newLInk);
            setContent(newContent);
            if (has2removeQuota()) {
                updateQuota(newContent.length)
            }
        }
    }

    useEffect(() => {
        setTextLink([]);
        setHasLink(false);
        setIsShorterLink(false);
        setShowCounter(has2removeQuota());

        if (has2removeQuota()) {
            if (type === "geolocation") {
                updateQuota(QUOTA_FOR_IMAGE);
                setContent(position);
            } else {
                updateQuota((type !== "text" && !!content) ? QUOTA_FOR_IMAGE : content.length);
            }
            if (isQuotaNegative()) {
                handleError('Hai finito la quota');
            }
        } else {
            handleError('');
            updateQuota(0);
            if (type === "geolocation") {
                setContent(position);
            }
        }
    }, [type, position, destinations]);


    useEffect(() => {
        setCounterActive(true);
        setTimeout(() => {
            setCounterActive(false);
        }, 200)
    }, [content]);

    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xl md:text-2xl">
                    Contenuto
                </span>
                {!!currentQuota && showCounter &&
                    <div className={`text-base md:text-xl text-white bg-${isCurrentQuotaNegative() ? "red-600" : "green-600"} rounded-xl p-2 quotaCounter ${counterActive && "active"}`}
                         aria-live="assertive"
                    >
                        {currentQuota.daily}/{currentQuota.weekly}/{currentQuota.monthly}
                    </div>
                }
            </div>
            {type === "text" &&
                <>
        <textarea
            value={content}
            rows="4"
            className="border-2 border-gray-500 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
            placeholder="Raccontaci qualcosa..."
            onChange={e => {
                setContent(e.target.value);
                let linkExists = e.target.value.match(URLHTTPREGEX);
                if (linkExists !== null) {
                    setTextLink(linkExists);
                    setHasLink(true);
                } else {
                    setIsShorterLink(false);
                    setHasLink(false);
                }
                handleQuotaChange(e, "text");
            }}
            aria-label="Inserisci il tuo testo"
        />
                    {hasLink &&
                        <div className="flex w-full justify-start items-center gap-4 my-2">
                            <input
                                id="shortenLinkCheckbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                type="checkbox"
                                checked={isShorterLink}
                                onChange={async () => {
                                    setIsShorterLink((prev) => !prev);
                                    await insertShorter();
                                }}
                                aria-describedby="shortenLinkDescription"
                            />
                            <label
                                className="flex w-full items-center gap-2 text-lg md:text-2xl"
                            >
                                Link corrente <span className="w-5 h-5">{ArrowRightIcon}</span> Link abbreviato
                            </label>
                        </div>
                    }
                </>
            }
            {type === "image" &&
                <>
                    <label className="relative inline-flex items-center cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            onClick={() => {
                                setIsLink(!isLink);
                                setContent('');
                                setImgAsFile(null);
                                setPreview(false);
                            }}
                            aria-label="Scegli tra l'inserimento di un'immagine dalla galleria o tramite link"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">Galleria o Link</span>
                    </label>
                    {isLink &&
                        <input
                            type="url"
                            placeholder="link immagine"
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                            onChange={async (e)=> {
                                let imageURL = e.target.value;
                                setContent(imageURL);
                                handleQuotaChange(e, "image");
                            }}
                            aria-label="Inserisci il link dell'immagine"
                        />
                    }
                    {!isLink &&
                        <input
                            type="file"
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                            accept={"image/png, image/jpeg"}
                            onChange={async (e) => {
                                let imageURL = (URL.createObjectURL(e.target.files[0]));
                                const imageObj = e.target.files[0];
                                setImgAsFile(imageObj);
                                setContent(imageURL);
                                handleQuotaChange(e, "image");
                            }}
                            aria-label="Carica un'immagine"
                        />
                    }
                    {!!content &&
                        <>
                            <label className="relative inline-flex items-center cursor-pointer mt-2">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    onClick={() => setPreview(!preview)}
                                    aria-label="Visualizza l'anteprima dell'immagine"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium">Visualizza foto</span>
                            </label>
                            {preview && <img
                                className="h-auto w-auto mx-auto mt-2 "
                                src={content}
                                alt="preview foto inserita"
                            />}
                        </>
                    }
                </>
            }
            {type === "video" &&
                <input
                    type="url"
                    placeholder="url video"
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out hover:border-primary hover:text-neutral-700 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                    onChange={async (e) => {
                        setContent(e.target.value);
                        handleQuotaChange(e, "video");
                    }}
                    aria-label="Inserisci il link del video"
                />
            }
            {type === "geolocation" &&
                <div className="w-full h-96">
                    <Mappa setPosition={setPosition} position={position} />
                </div>
            }
        </>
    );

}

export default ContentPost;