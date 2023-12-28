import {Modal} from "flowbite-react";
import {useState} from "react";
function RepliesModal({isOpen, setIsOpen, setHasUpdated, replies, postID}) {
    const [comment, setComment] = useState('');


    async function addComment(){
        let res = await fetch('/db/reply/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                content: "ciao",
                parentid: postID,
            })
        })
        if(res.ok){
            console.log("commento aggiunto")
        }
    }

    return (
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Risposte
            </Modal.Header>
            <Modal.Body>
                <>
                    {replies.map((rep) => {
                        return (
                            <div
                                className="flex w-full items-start justify-start gap-4"
                                key={rep._id}
                            >
                                <img
                                    className="w-9 h-9 object-cover rounded-full"
                                    src={rep.profilePicture} alt={`${rep.owner}'s profile picture`}
                                />
                                <div className="flex w-full justify-start gap-2 items-center">
                                    <span className="text-lg font-semibold">{rep.owner}</span>
                                    <p>{rep.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </>
            </Modal.Body>
            <Modal.Footer>
                <textarea
                    value={comment}
                    rows="2"
                    className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                    placeholder="Raccontaci qualcosa..."
                    onChange={e => {
                        setComment(e.target.value);
                    }}
                />
            </Modal.Footer>
        </Modal>
    );
}

export default RepliesModal;