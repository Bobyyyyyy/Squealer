import ContentPost from "./ContentPost.jsx";
import {useEffect, useState} from "react";
import {SubmitIcon} from "../../components/assets/index.jsx";
import {getQuotaByUsername, getUsernameFromSessionStore, setToastNotification} from "../../utils/usefulFunctions.js";

import {blob2base64, compressBlob, getEmbed} from "../../utils/imageFunctions.js";
import TimedPost from "./TimedPost.jsx";
import {startSendingPosition} from "../../utils/geoFunctions.js";
import ModalGeo from "./ModalGeo.jsx";

function AddPost(){
    const username = getUsernameFromSessionStore();
    const [type, setType] = useState("text");
    const [destinations, setDestinations] = useState('');
    const [content, setContent] = useState('');
    const [imgAsFile, setImgAsFile] = useState();
    const [position, setPosition] = useState(null);

    const [quota, setQuota] = useState(null);
    const [currentQuota, setCurrentQuota] = useState();

    const [error, setError] = useState('');

    const [isTimed, setIsTimed] = useState(false);
    const [frequencyMs, setFrequencyMs] = useState(0);
    const [numberOfPosts, setNumberOfPosts] = useState(1)
    const [showModalGeo, setShowModalGeo] = useState(false);
    const [startSending, setStartSending] = useState(false);


    const infoNum = "{NUM}";
    const infoTime = "{TIME}";
    const infoDate = "{DATE}";
    const infoTimedText = (
        <div className="flex flex-col flex-wrap w-full mb-4 text-md font-normal justify-center items-center">
            <span className="text-lg">Sintassi Squeal:</span>
            <span> <span className="font-semibold">{infoNum}</span> numero corrente dello squeal</span>
            <span> <span className="font-semibold">{infoTime}</span> tempo di pubblicazione dello squeal</span>
            <span> <span className="font-semibold">{infoDate}</span> data di pubblicazione dello squeal</span>
        </div>
    );

    const handleError = (data) => {
        setError(data);
    }

    function parseDestinations(dests) {
        let finalDest = [];
        let allDest = dests.replaceAll(" ", "").split(",");
        for (let dest of allDest) {
            finalDest.push({
                name: dest.substring(1),
                destType: (dest.startsWith('§') ? 'channel' : (dest.startsWith('@') ? 'user' : (dest.startsWith('#') ? 'keyword' : "error"))),
            })
        }
        return finalDest;
    }

    const canSendPost = () => {
        let canSend = true;
        if (!!error) {
            canSend = false;
        } else if (!destinations && !content) {
            setError("Inserisci i destinatari e il contenuto")
            canSend = false;
        } else if (!content) {
            setError("Inserisci il contenuto")
            canSend = false;
        } else if (!destinations) {
            setError("Inserisci i destinatari")
            canSend = false;
        } else if (!(destinations.includes("§") || destinations.includes("@") || destinations.includes("#"))) {
            setError("Inserisci @ o § o # nei destinatari");
            canSend = false;
        } else if (isQuotaNegative()) {
            setError("Hai finito la quota");
            canSend = false;
        } else if (isMyUsername(destinations)) {
            setError("Non puoi inviare messaggi a te stesso")
            canSend = false;
        } else if (containsUppercaseChannel(destinations)) {
            setError("Non puoi inviare post ai canali ufficiali")
            canSend = false;
        }
        return canSend;
    }

    function containsUppercaseChannel(str) {
        return /§[A-Z]/.test(str);
    }

    function isMyUsername(dest) {
        let reg = new RegExp(`@${username}$`, "gm");
        return dest.match(reg);
    }

    const isQuotaNegative = () => {
        return quota.characters.daily <= 0 || quota.characters.weekly <= 0 || quota.characters.monthly <= 0;
    }

    async function createPost() {
        let content2send;
        switch (type) {
            case "text":
                content2send = content;
                break;
            case "image":
                if (!!imgAsFile) {
                    content2send = await blob2base64(await compressBlob(imgAsFile));
                } else {
                    content2send = content;
                    console.log("imgObj",content);
                }
                break;
            case "geolocation":
                content2send = JSON.stringify({
                    lat : position[0],
                    lng: position[1]
                });
                console.log("pos", content);
                break
            case "video":
                const youtubepath = `//www.youtube.com/embed/${getEmbed(content)}`
                content2send = youtubepath;

        }

        let dests = parseDestinations(destinations);

        let post = {
            contentType: type,
            dateOfCreation: Date.now(),
            creator: username,
            destinations: dests,
            content: content2send
        };

        if (isTimed) {
            post.timed = true;
            console.log(frequencyMs, typeof frequencyMs);
            post.millis = frequencyMs;
            post.squealNumber = parseInt(numberOfPosts);
        }
        return post;
    }

    const onSubmit = async () => {
        try {
            if (canSendPost()) {
                let post = await createPost();
                console.log("post creato", post, currentQuota)

                let res = await fetch("/db/post", {
                    method: "POST",
                    body: JSON.stringify({
                        post: post,
                        quota: currentQuota
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (res.ok) {
                    res = await res.json();
                    if (post.contentType === "geolocation" && post.hasOwnProperty("millis")) {
                        console.log("start sending");
                        setStartSending(true);
                        setShowModalGeo(true);
                        startSendingPosition(frequencyMs, numberOfPosts, res.post._id);
                        const wait = frequencyMs * numberOfPosts + 500;
                        console.log("wait", wait)
                        setTimeout(()=> {
                            setShowModalGeo(false);
                            setToastNotification("Post inviato correttamente", "success");
                            window.location.href = "/user/"
                        }, wait)
                    } else {
                        setToastNotification("Post inviato correttamente", "success");
                        window.location.href = "/user/"
                    }
                } else {
                    setToastNotification("Oh no, qualcosa è andato storto nell'invio del post", "failure");
                    window.location.href = "/user/"
                }
            }
        } catch (e) {
            console.log(e)
            setToastNotification("Oh no, qualcosa è andato storto nell'invio del post", "failure");
            window.location.href = "/user/"
        }
    }

    useEffect(() => {
        getQuotaByUsername(username)
            .then((response) => {
                setQuota(response);
                setCurrentQuota(response.characters);
            })
    }, []);


    return (
        <main className="flex flex-col items-center justify-center m-4 pb-8">
            <h1 className="text-3xl text-center">
                Crea un nuovo Post!
            </h1>
            <div className="mt-6 w-full mb-4">
                {/* DESTINATARI */}
                <div className="flex flex-col justify-between items-start gap-2">
                    <div className={"flex justify-between items-center w-full"}>
                        <span className="text-xl md:text-2xl">Destinatari</span>
                        <span className={"text-blue-400"}>(@utente, §canale, #keyword)</span>
                    </div>
                    <input
                        type="text"
                        className="border-2 border-gray-500 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                        placeholder="@Pippo42, §calcetto, #oggi"
                        onChange={e => setDestinations(e.target.value)}
                        aria-label="Inserisci i destinatari del post"
                    />
                </div>
                {/* TIPO DI CONTENUTO DEL POST */}
                <div className="mt-4 mb-4 flex justify-between items-center">
                    <span className="text-xl md:text-2xl">Tipologia post</span>
                    <select
                        className="border-2 border-gray-500 rounded-md w-2/5 focus:border-teal-500 focus:ring-teal-500"
                        onChange={e => {
                            setType(e.target.value)
                            setContent('');
                        }}
                        aria-label="Seleziona la tipologia del post"
                    >
                        <option value="text">Testo</option>
                        <option value="image">Immagine</option>
                        <option value="geolocation">Posizione</option>
                        <option value="video">Video</option>
                    </select>
                </div>
                {/* CONTENUTO DEL POST */}
                {!!quota &&
                    <ContentPost
                        type={type} content={content} setContent={setContent} destinations={destinations}
                        quota={quota} currentQuota={currentQuota} setCurrentQuota={setCurrentQuota}
                        setImgAsFile={setImgAsFile} position={position} setPosition={setPosition}
                        handleError={handleError} isQuotaNegative={isQuotaNegative}
                    />
                }
                <div className="flex items-center gap-4 mt-4">
                    <input
                        type="checkbox" checked={isTimed} onChange={() => setIsTimed((prev) => !prev)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        id="timedCheckbox"
                    />
                    <label
                        htmlFor="timedCheckbox"
                        className="text-xl md:text-2xl"
                    >
                        Messaggio temporizzato
                    </label>
                </div>
            </div>
            {isTimed && type === "text" && <>{infoTimedText}</>}
            {isTimed && type === "geolocation" &&
                <div className="flex flex-col flex-wrap w-full mb-4 text-md font-normal justify-center items-center">
                    <p>
                        Mentre condividi la posizione <span className="font-semibold">non puoi lasciare questa pagina</span>,
                        altrimenti la <span className="font-semibold">condivisione verrà intrerrotta</span>
                    </p>
                </div>
            }
            {isTimed && <TimedPost setFrequencyMs={setFrequencyMs} numberOfPosts={numberOfPosts} setNumberOfPosts={setNumberOfPosts} type={type} handleError={handleError} />}
            {!!error &&
                <div className="flex w-full justify-start text-xl text-red-600 mb-4">
                    {error}
                </div>}
            <button
                className="button-submit flex w-full align-center justify-center items-center gap-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                type="submit"
                onClick={async (e) => {
                    e.preventDefault();
                    await onSubmit()
                }}
            >
                Submit
                {SubmitIcon}
            </button>
            <ModalGeo
                isOpen={showModalGeo} setIsOpen={setShowModalGeo} startSending={startSending}
                frequencyMs={frequencyMs} numOfUpdates={numberOfPosts}
            />
        </main>
    );
}

export default AddPost;