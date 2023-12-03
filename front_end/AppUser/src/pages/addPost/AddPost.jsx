import {Field, Formik, Form, useFormikContext} from 'formik';
import * as Yup from "yup";
import {alert, Button} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import {getUsernameFromLocStor, compressBlob, blob2base64, getEmbed} from "../../components/utils/usefulFunctions.js"

import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import Mappa from "../../components/posts/Mappa.jsx";


let imageObj = null;
let geoPos = null;

function AddPost () {
    const [imgAslink, setImgAsLink] = useState(false);

    const initialValues = {
        contentType: "text",
        destinatari: "",
        testo: "",
        foto: "",
        video: "",
        geolocation: ""
    };

    const URL = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/

    const validationSchema = Yup.object().shape({
        destinatari: Yup.string()
            .required("Inserisci i destinatari"),
        testo: Yup.string().when("contentType",{
            is: "text",
            then: () => Yup.string().required("Inserisci contenuto")
        }),
        foto: Yup.mixed().when("contentType",{
            is: "image",
            then: () => Yup.string().required("Inserisci una foto")
        }),
        video: Yup.mixed().when("contentType",{
            is: "video",
            then: () => Yup.string()
                .required("Inserisci un video")
                //.matches(URL, "Inserisci un url valido")
        }),
    });


    function parseDestinations(destinations) {
        let finalDest = [];
        let allDest = destinations.replaceAll(" ", "").split(",");
        for (let dest of allDest) {
            finalDest.push({
                name:  dest.substring(1),
                destType: dest.startsWith('§') ? 'channel' : dest.startsWith('@') ? 'user' : 'errore',
            })
        }
        return finalDest;
    }

     async function createPost(values) {
         let content;
         switch (values.contentType) {
             case "text":
                 content = values.testo;
                 break;
             case "image":
                 if (imgAslink) {
                    content = values.foto;
                 } else {
                    content = await blob2base64(await compressBlob(imageObj));
                 }
                 console.log("imgObj",content);
                 console.log("value",values.foto);
                 break;
             case "geolocation":
                 content = JSON.stringify({
                     lat : geoPos[0],
                     lng: geoPos[1]
                 });
                 console.log("pos", content);
                 break
             case "video":
                 console.log(values.video);
                 const youtubepath = `//www.youtube.com/embed/${getEmbed(values.video)}`
                 //content = values.video;
                 console.log(youtubepath)
                 content = youtubepath;

         }

         let destinations = parseDestinations(values.destinatari);
         let currUser = getUsernameFromLocStor();
         console.log("dest", destinations)
         console.log("currUser", currUser)
         if (destinations.some((dest) => dest.name === currUser)) {
             throw new Error("NON PUOI INIVIARE MESSAGGI A TE STESSO");
         }

         return (
             {
                 contentType: values.contentType,
                 dateOfCreation: Date.now(),
                 creator: currUser,
                 destinations: destinations,
                 content: content
             }
         );
     }
    const onSubmit = async (values) => {
        console.log("form submitted" ,values);
        try {
            let post = await createPost(values);
            console.log("post", post);
            let res = await fetch("/db/post", {
                method: "POST",
                body: JSON.stringify({
                    post: post,
                    quota: {
                        daily: 300,
                        weekly: 2100,
                        monthly: 6000,
                    }
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            let response = await res.json();
            console.log("post inviato", response);
            /* DA SISTEMARE IL CONTROLLO DEL CORRETTO INVIO DEL POST */
            if (response.statusCode === 422 ) {
                window.alert("l'utente non esiste");
            } else if (response.name) {
                window.alert("errore nell'invio del post, controlla di aver inserito i destinatari corretti");
            } else {
                window.location.href = "/user/"
            }
        } catch (e) {
            console.log("errore:", e);
            setErrorDestinatari(true);
            setTimeout(() => {
                setErrorDestinatari(false);
            }, 2000)
        }
    }

    const [errorDestinatari, setErrorDestinatari] = useState(false);


    return (
        <main className={" items-start flex justify-center m-4 pb-8"}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({errors, touched, ...formikProps}) => (
                <Form
                    className={"bg-white flex flex-col justify-between rounded-lg w-full font-la"}
                >
                    <div className="flex text-gray-700 justify-center">
                        <h1 className="text-3xl font-latoBold">
                            Crea un nuovo Post!
                        </h1>
                    </div>
                    {/* CONTAINER DEI CAMPI */}
                    <div className="mt-6 w-full mb-4">
                        {/* DESTINATARI */}
                        <div className="flex flex-col justify-between items-start gap-2">
                            <label
                                className={"block font-latoBold text-xl w-full"}
                            >
                                {errors.destinatari && touched.destinatari ? (
                                    <div className={"text-red-600"}>{errors.destinatari}</div>
                                    ) : ((errorDestinatari) ? (
                                        <div className={"text-red-600"}>Non puoi inviare un messaggio a te stesso</div>
                                    ) :
                                    <div className={"flex justify-between w-full"}>
                                        <span>Destinatari</span>
                                        <span className={"text-blue-400"}>(@utente, §canale)</span>
                                    </div>
                                    )
                                }
                            </label>
                            <Field
                                className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                                type="text"
                                placeholder="@Pippo42"
                                name="destinatari"
                            />
                        </div>
                        {/* TIPO DI CONTENUTO DEL POST */}
                        <div className="mt-4 mb-4 flex justify-between items-center">
                            <label
                                className="block font-latoBold text-xl"
                            >
                                Tipologia post
                            </label>
                            <Field
                                as={"select"}
                                id={"contentType"}
                                className="border-2 border-gray-500 rounded-md w-2/5 focus:border-teal-500 focus:ring-teal-500"
                                name="contentType"
                            >
                                <option value="text">Testo</option>
                                <option value="image">Immagine</option>
                                <option value="geolocation">Posizione</option>
                                <option value="video">Video</option>
                            </Field>
                        </div>

                        {/* CONTENUTO DEL POST */}
                        <div>
                            <Content errors={errors} touched={touched} {...formikProps} setImgAsLink={setImgAsLink} />
                        </div>
                    </div>
                        <Button
                            className="flex align-center justify-center gap-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            type={"submit"}
                        >
                            Submit
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>

                        </Button>
                    </Form>
                    )}
                </Formik>
        </main>
    );

}

const Content = ({errors, touched, setImgAsLink, ...formikProps}) => {
    const {values ,submitForm} = useFormikContext();
    const [isPreview, setIsPreview] = useState(false);
    const [position, setPosition] = useState(null);
    const [isLink, setIsLink] = useState(false);


    useEffect(() => {
        geoPos = position;
    }, [position]);


    return (
        <div className={"mt-4"}>
            {/* TESTO */
                values.contentType === "text" &&
                <>
                    <label
                        className={"block font-latoBold text-xl mb-2"}
                    >
                        {errors.testo && touched.testo ? (
                            <div className={"text-red-600"}>{errors.testo}</div>
                        ) : <span>Contenuto</span>
                        }
                    </label>
                    <Field
                        as={"textarea"}
                        id={"testo"}
                        name={"testo"}

                        rows="4"
                        className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                        placeholder="Raccontaci qualcosa..."
                    >
                    </Field>
                </>
            }
            {/* IMMAGINE */
                values.contentType === "image" &&
                <>
                    <label
                        className={"block font-latoBold text-xl mb-2"}
                    >
                        {errors.foto && touched.foto ? (
                            <div className={"text-red-600"}>{errors.foto}</div>
                        ) : <span>Contenuto</span>
                        }
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            onClick={()=> setIsLink(!isLink) }
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">Link o Galleria</span>
                    </label>
                    {isLink &&
                    <input
                            type="file"
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                            id="foto"
                            accept={"image/png, image/jpeg"}
                            onChange={async (e)=> {
                                setImgAsLink(false);
                                let imageURL = (URL.createObjectURL(e.target.files[0]));
                                imageObj = e.target.files[0];
                                await formikProps.setFieldValue("foto", imageURL);
                        }}
                        />
                    }
                    {!isLink &&
                        <input
                            type="url"
                            placeholder="link immagine"
                            className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none"
                            id={"foto"}
                            onChange={async (e)=> {
                                setImgAsLink(true);
                                //let imageURL = (URL.createObjectURL(e.target.files[0]));
                                //imageObj = e.target.files[0];
                                await formikProps.setFieldValue("foto", e.target.value);
                                console.log(e.target.value)
                            }}
                        />
                    }
                    {values.foto !== "" &&
                        <>
                            <label className="relative inline-flex items-center cursor-pointer mt-2">
                            <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                                onClick={()=> setIsPreview(!isPreview) }
                            />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium">Visualizza foto</span>
                            </label>
                            {isPreview && <img
                                className={"h-auto w-auto mx-auto mt-2 "}
                                src={values.foto}
                                alt={"preview foto inserita"}
                            />}
                        </>
                    }
                </>
            }
            {/* POSIZIONE */
                values.contentType === "geolocation" &&
                <>
                    <label
                        className={"block font-latoBold text-xl mb-2"}
                    >
                        {errors.geolocation && touched.geolocation ? (
                            <div className={"text-red-600"}>{errors.geolocation}</div>
                        ) : <span>Contenuto</span>
                        }
                    </label>
                    <div className="border border-red-500 w-full h-96">
                        <Mappa setPosition={setPosition} position={position} />
                    </div>
                </>

            }
            {/* VIDEO */
                values.contentType === "video" &&
                <>
                    <label
                        className={"block font-latoBold text-xl mb-2"}
                    >
                        {errors.video && touched.video ? (
                            <div className={"text-red-600"}>{errors.video}</div>
                        ) : <span>Contenuto</span>
                        }
                    </label>
                    <Field
                        as={"input"}
                        accept={"url"}
                        id={"video"}
                        name={"video"}
                        className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                        placeholder="Url video"
                    >
                    </Field>
                </>
            }

        </div>

    );
}


export default AddPost;
