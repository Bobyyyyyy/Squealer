import ContentPost from "./ContentPost.jsx";
import {useEffect, useRef, useState} from "react";
import {SubmitIcon} from "../../components/assets/index.jsx";
import {
    blob2base64,
    compressBlob, getEmbed,
    getQuotaByUsername,
    getUsernameFromSessionStore
} from "../../utils/usefulFunctions.js";
import {Toast} from "flowbite-react";
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
    const [quota,setQuota] = useState();
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

    function parseDestinations(dests) {
        let finalDest = [];
        let allDest = dests.replaceAll(" ", "").split(",");
        for (let dest of allDest) {
            finalDest.push({
                name: dest.substring(1),
                destType: dest.startsWith('§') ? 'channel' : dest.startsWith('@') ? 'user' : 'errore',
            })
        }
        return finalDest;
    }

    const canSendPost = () => {
        let canSend = true;
        if (!destinations && !content) {
            setError("Inserisci i destinatari e il contenuto")
            canSend = false;
        } else if (!content) {
            setError("Inserisci il contenuto")
            canSend = false;
        } else if (!destinations) {
            setError("Inserisci i destinatari")
            canSend = false;
        } else if (!(destinations.includes("§") || destinations.includes("@"))) {
            setError("Inserisci @ o § nei destinatari");
            canSend = false;
        } else if (isQuotaNegative()) {
            canSend = false;
        } else if (destinations.includes(username)) {
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

    const isQuotaNegative = () => {
        return currentQuota?.monthly < 0;
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
                            window.location.href = "/user/"
                        }, wait)
                    } else {
                        window.location.href = "/user/"
                    }
                } else {
                    let data = await res.json();
                    if (data.statusCode === 400) {
                        console.log(data.message);
                        window.alert("Non hai il prermesso di scrivere");
                    } else if (data.statusCode === 400) {
                        window.alert("Canale o utente non esiste");
                    }
                    throw res;
                }
            }
        } catch (e) {
            console.log(e)
            window.alert("canale o utente non esistente")
        }
    }

    useEffect(() => {
        getQuotaByUsername(username)
            .then((response) => {
                setQuota(response);
                setCurrentQuota(response);
            })
    }, []);

    useEffect(() => {
        if (!isQuotaNegative()) {
            setError('')
        }
    }, [content, destinations]);

    useEffect(()=> {
        console.log("num post:", numberOfPosts)
    }, [numberOfPosts])

    return (
        <main className="flex flex-col items-center justify-center m-4 pb-8">
            <h1 className="text-3xl text-center">
                Crea un nuovo Post!
            </h1>
            <div className="mt-6 w-full mb-4">
                {/* DESTINATARI */}
                <div className="flex flex-col justify-between items-start gap-2">
                    <div className={"flex justify-between w-full"}>
                        <span className="text-xl md:text-2xl">Destinatari</span>
                        <span className={"text-blue-400"}>(@utente, §canale)</span>
                    </div>
                    <input
                        type="text"
                        className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                        placeholder="@Pippo42, §calcetto"
                        onChange={e => setDestinations(e.target.value)}
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
                        setError={setError} isQuotaNegative={isQuotaNegative}
                    />
                }
                <div className="flex items-center gap-4 mt-4">
                    <input
                        type="checkbox" checked={isTimed} onChange={() => setIsTimed((prev) => !prev)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                        <label
                            htmlFor="default-checkbox"
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
            {isTimed && <TimedPost frequency={frequencyMs} setFrequencyMs={setFrequencyMs} numberOfPosts={numberOfPosts} setNumberOfPosts={setNumberOfPosts} type={type}/>}
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
    /*
        <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
                {SubmitIcon}
            </div>
            <div className="ml-3 text-sm font-normal">Set yourself free.</div>
            <Toast.Toggle />
        </Toast>
     */
}

export default AddPost;