import Navbar from "../../utils/navbar/Navbar.jsx";
import { useState } from "react"

function AddPost () {
    const [typeOfPost, setTypeOfPost] = useState("Text")

    const onOptionChange = e => {
        setTypeOfPost(e.target.value)
    }

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        // You can pass formData as a fetch body directly:
        fetch('/some-api', { method: form.method, body: formData })
            .then((response) => {
                if (response.ok) {
                    console.log("sucess: ")
                } else {
                    console.log("reject: ")
                }
                console.log(response);
        }).catch((error)=>{
            console.log("err: ")
            console.log(error);
        })


        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    return (
        <>
            <h3>Create a new post!</h3>

            <form method="post" onSubmit={handleSubmit}>
                <label>
                    Text input: <input name="myInput" type="text" defaultValue="sasso"/>
                </label>

                <p>
                    <span>Choose the type of post:</span>
                    <label>
                        <input
                            type="radio"
                            name="typeOfPost"
                            value="Text"
                            defaultChecked={true}
                            id="text"
                            onChange={onOptionChange}
                        />
                        Text
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="typeOfPost"
                            value="Photo"
                            id="photo"
                            onChange={onOptionChange}
                        />
                        Photo
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="typeOfPost"
                            value="Geolocation"
                            id="geolocation"
                            onChange={onOptionChange}
                        />
                        Geolocation
                    </label>
                </p>
                <hr />
                Selected: <strong>{typeOfPost}</strong>
                <hr />
                <button type="reset" onClick={()=> (setTypeOfPost("Text"))}>Reset form</button>
                <button type="submit">Submit form</button>
            </form>
        </>
    )
}


export default AddPost;