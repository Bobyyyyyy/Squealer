import {useState} from "react";

function CreateChannelForm(){
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [isPublic, setIsPublic] = useState(true);


    return (
        <div>
            <div className="w-full">
                <span className="text-lg font-medium">Inserisci nome canale:</span>
                <input
                    placeholder={"Nome canale"}
                    onChange={(e)=> setName(e.target.value)}
                    className="w-full"
                />
            </div>
        </div>
    );
}

export default CreateChannelForm;