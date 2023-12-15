import {useEffect, useRef, useState} from "react";
import Mappa from "../../components/posts/Mappa.jsx";

function ContentPost({type, quota, currentQuota, setCurrentQuota,
                     content, setContent, setImgAsFile, position, setPosition,
                     destinations, setError, isQuotaNegative}) {

    const [isLink, setIsLink] = useState(false)
    const [preview, setPreview] = useState(false);
    const [counterActive, setCounterActive] = useState(false);
    const [showCounter, setShowCounter] = useState(false);
    const quotaForImg = 125;

    const handleQuotaChange = (e, type) => {
        const quota2remove = (type === "text") ? e.target.value.length : quotaForImg;
        updateQuota(quota2remove)
    }

    const has2removeQuota = () => {
        return !!destinations.includes("§");
    }

    const updateQuota = (quota2remove) => {
        let remainingDquota =  quota.characters.daily - quota2remove;
        let remainingWquota = quota.characters.weekly + ((remainingDquota < 0) ? remainingDquota : 0);
        let remainingMquota = quota.characters.monthly + ((remainingWquota < 0) ? remainingWquota : 0);

        setError( remainingMquota < 0? "hai finito la quota mensile" : "");

        remainingDquota = (remainingDquota < 0) ? 0 : remainingDquota;
        remainingWquota = (remainingWquota < 0) ? 0 : remainingWquota;
        setCurrentQuota({
            daily: remainingDquota,
            weekly: remainingWquota,
            monthly: remainingMquota
        });
    }

    useEffect(() => {
        if (has2removeQuota()) {
            if (type === "geolocation") {
                updateQuota(quotaForImg);
                setContent(position);
            } else {
                updateQuota((type !== "text" && !!content) ? quotaForImg : content.length);
            }
        } else {
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


    useEffect(() => {
        setShowCounter(destinations.includes("§"))
    }, [destinations]);

    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xl md:text-2xl">
                    Contenuto
                </span>
                {!!currentQuota && showCounter &&
                    <div className={`text-base md:text-xl text-white bg-${isQuotaNegative() ? "red-600" : "green-600"} rounded-xl p-2 quotaCounter ${counterActive && "active"}`}>
                        {currentQuota.daily}/{currentQuota.weekly}/{currentQuota.monthly}
                    </div>
                }
            </div>
            {type === "text" &&
                <textarea
                    value={content}
                    rows="4"
                    className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                    placeholder="Raccontaci qualcosa..."
                    onChange={e => {
                        setContent(e.target.value);
                        handleQuotaChange(e, "text");
                    }}
                />
            }
            {type === "image" &&
                <>
                    <label className="relative inline-flex items-center cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            onClick={()=> {
                                setIsLink(!isLink);
                                setContent('');
                                setImgAsFile(null);
                                setPreview(false);
                            }}
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
                        />
                    }
                    {!isLink &&
                        <input
                            type="file"
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                            accept={"image/png, image/jpeg"}
                            onChange={async (e)=> {
                                let imageURL = (URL.createObjectURL(e.target.files[0]));
                                const imageObj = e.target.files[0];
                                setImgAsFile(imageObj);
                                setContent(imageURL);
                                handleQuotaChange(e, "image");

                            }}
                        />
                    }
                    {!!content &&
                        <>
                            <label className="relative inline-flex items-center cursor-pointer mt-2">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                onClick={()=> setPreview(!preview)}
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
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                    onChange={async (e)=> {
                        setContent(e.target.value);
                        handleQuotaChange(e, "video");
                    }}
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