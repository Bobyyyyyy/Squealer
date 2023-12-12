import ContentPost from "./ContentPost.jsx";
import {useEffect, useRef, useState} from "react";
import {Button} from "@material-tailwind/react";
import {SubmitIcon} from "../../components/assets/index.jsx";
import {
    blob2base64,
    compressBlob, getEmbed,
    getQuotaByUsername,
    getUsernameFromLocStor
} from "../../components/utils/usefulFunctions.js";

function AddPost2(){
    const username = getUsernameFromLocStor();
    const [type, setType] = useState("text");
    const [destinations, setDestinations] = useState('');
    const [content, setContent] = useState('');
    const [imgAsFile, setImgAsFile] = useState();
    const [position, setPosition] = useState(null);
    const [quota,setQuota] = useState();
    const [currentQuota, setCurrentQuota] = useState();
    const [error, setError] = useState('');

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
        console.log(destinations, content);
        let x = true;
        if (!destinations && !content) {
            setError("Inserisci i destinatari e il contenuto")
            x = false;
        } else if (!content) {
            setError("Inserisci il contenuto")
            x = false;
        } else if (!destinations) {
            setError("Inserisci i destinatari")
            x = false;
        }
        return x;
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
        if (dests.some((dest) => dest.name === username)) {
            throw new Error("NON PUOI INIVIARE MESSAGGI A TE STESSO");
        }

        return (
            {
                contentType: type,
                dateOfCreation: Date.now(),
                creator: username,
                destinations: dests,
                content: content2send
            }
        );
    }

    const onSubmit = async () => {
        try {
            if (canSendPost()) {
                let post = await createPost();
                let res = await fetch("/db/post", {
                    method: "POST",
                    body: JSON.stringify({
                        post: post,
                        quota: {
                            daily: currentQuota.daily,
                            weekly: currentQuota.weekly,
                            monthly: currentQuota.monthly,
                        }
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                res = res.json();
                if (res.statusCode === 400 ) {
                    console.log(res.message);
                    window.alert("l'utente non esiste");
                } else if (res.name) {
                    window.alert("errore nell'invio del post, controlla di aver inserito i destinatari corretti");
                } else {
                    //window.location.href = "/user/"
                }
            }
        } catch (e) {
            console.log("ERRORE:", e);

        }
    }

    useEffect(() => {
        getQuotaByUsername(username)
            .then((res) => {
                setQuota(res);
                setCurrentQuota(res);
            })
    }, []);

    useEffect(() => {
        setError('')
    }, [content, destinations]);

    return (
        <main className="flex flex-col items-center justify-center m-4 pb-8">
            <h1 className="text-3xl text-center">
                Crea un nuovo Post!
            </h1>
            {/* CONTAINER DEI CAMPI */}
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
                        type={type} content={content} setContent={setContent}
                        quota={quota} currentQuota={currentQuota} setCurrentQuota={setCurrentQuota}
                        setImgAsFile={setImgAsFile} position={position} setPosition={setPosition}
                    />
                }
            </div>
            {!!error && <div className="flex w-full justify-start text-xl text-red-600 mb-4">
                {error}
            </div>}
            <Button
                className="flex w-full align-center justify-center items-center gap-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                type="submit"
                onClick={onSubmit}
            >
                Submit
                {SubmitIcon}
            </Button>
        </main>
    );
}

export default AddPost2;