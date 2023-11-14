import Navbar from "../../utils/navbar/Navbar.jsx";
import React, { useState } from "react"
import {useFormik, Field, Formik, Form, useFormikContext} from 'formik';

import * as Yup from "yup";

import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Select,
    Option,
} from "@material-tailwind/react";


function AddPost () {
    const initialValues = {
        name: "mario",
        contentType: "Text",
        dateOfCreation: Date.now(),
        destinatari: "",
        content: "",
    };

    const onSubmit = async (values) => {
        console.log("contentType", initialValues.contentType);
        console.log("form submitted");
        console.log(values);

        try {
            let res = await fetch("/db/post", {
                method: "POST",
                body: JSON.stringify({
                    post: post,

                }),
                headers: {
                    "Content-Type": "application/json"
                },
            });

        } catch (e) {
            console.log(e.target);
        }
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .max(20, "Name must be 20 characters or less.")
            .required("Inserisci i destinatari"),
        content: Yup.string()
            .required("Insersci il contenuto"),

        // destType va messo come OGGETTO
        destinatari: Yup.string()
            //.max(10, "nome destinatario troppo lungo")
            .required("Inserisci i destinatari"),
    });


    const [isPending, setIsPending] = useState(false);

    return (
        <>
            <main className={"h-screen items-start mt-4 flex justify-center m-4"}>
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({errors, touched}) => (
            <Form
                className={"bg-white flex flex-col rounded-lg w-full font-la"}
            >
                <div className="flex text-gray-700 justify-center">
                    <h1 className="text-3xl font-latoBold">
                        Crea un nuovo Post!
                    </h1>
                </div>
                <div className="mt-6 w-full">
                    {/* POST PUBBLICO O PRIVATO */}
                    <div className=" flex justify-between items-center">
                        <label
                            className="block font-latoBold text-xl "
                        >
                            Visibilità del post
                        </label>
                        <Field
                            as={"select"}
                            className="border-2 border-gray-500 p-2 rounded-md  focus:border-teal-500 focus:ring-teal-500 w-1/3"
                            name="destType"
                        >
                            <option value="Privato">Privato</option>
                            <option value="Pubblico">Pubblico</option>
                        </Field>
                    </div>

                    {/* DESTINATARI */}
                    <div className="mt-4 flex flex-col justify-between items-start gap-2">
                        <label
                            className={"block font-latoBold text-xl"}
                        >
                            {errors.destinatari && touched.destinatari ? (
                                <div className={"text-red-600"}>{errors.destinatari}</div>
                                ) : <span>Destinatari</span>
                            }
                        </label>
                        <Field
                            className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                            type="text"
                            name="destinatari"
                            placeholder="@Pippo42"
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
                            className="border-2 border-gray-500 rounded-md w-1/3 focus:border-teal-500 focus:ring-teal-500"
                            name="contentType"
                        >
                            <option value="Text">Text</option>
                            <option value="Photo">Photo</option>
                            <option value="Geolocation">Geolocation</option>
                            <option value="Video">Video</option>
                        </Field>
                    </div>
                    <label
                        className={"block font-latoBold text-xl"}
                    >
                        {errors.content && touched.content ? (
                            <div className={"text-red-600"}>{errors.content}</div>
                            ) : <span>Contenuto</span>
                        }
                    </label>
                    <Content />
                </div>
                <button
                    className="flex align-center justify-center gap-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    type={"submit"}>
                    Submit
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>

                </button>
            </Form>
            )}
        </Formik>

            </main>
        </>
    );

}

const Content = () => {
    const {values, submitForm}= useFormikContext();
    return (
        <div className={"mt-4 mb-4"}>
            {values.contentType === "Text" &&
                <Field
                    as={"textarea"}
                    id={"content"}
                    name={"content"}

                    rows="4"
                    className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                    placeholder="Raccontaci qualcosa..."
                >
                </Field>
            }
            {values.contentType === "Photo" &&
                <Field
                    name={"content"}
                    id={"photoFile"}
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    type="file"
                />
            }
            {values.contentType === "Video" &&
                <Field
                    name={"content"}
                    id={"Video"}
                    placeholder="inserirsci l'url"
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    type="url"
                />
            }
        </div>
    );
}

export default AddPost;
