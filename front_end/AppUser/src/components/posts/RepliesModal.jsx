import {Button, Modal, Spinner} from "flowbite-react";
import React, {useEffect, useState} from "react";
function RepliesModal({isOpen, setIsOpen, postID}) {
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [replies, setReplies] = useState([]);
    const [hasUpdated, setHasUpdated] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        await getReplies();
        setIsLoading(false);
        setHasUpdated(false);
    }

    useEffect(() => {
        fetchData()
            .catch(console.error);
    }, [hasUpdated]);

    const getReplies = async () => {
        let res = await fetch(`/db/reply?parentid=${postID}`, {
            method:"GET"
        })
        if (res.ok) {
            res = await res.json();
            setReplies(res);
        }
    }

    async function addComment(){
        if (!!comment) {
            let res = await fetch('/db/reply/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    content: comment,
                    parentid: postID,
                })
            })
            if(res.ok){
                console.log("commento aggiunto");
                setComment('');
                setHasUpdated(true);
            }
        }
    }

    return (
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                Risposte
            </Modal.Header>
            <Modal.Body>
                <>
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <Spinner aria-label="loading profile spinner" size="xl" color="pink" />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full items-start justify-start gap-4">
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
                                        <div className="flex flex-wrap w-full justify-start gap-2 items-center overflow-x-hidden">
                                            <p className="overflow-hidden break-words">
                                                <span className="text-lg font-semibold">
                                                    {rep.owner}
                                                </span>
                                                <span>: </span>
                                                {rep.content}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {replies.length === 0 &&
                            <div>
                                Non ci sono risposte, aggiungi un commento!
                            </div>}
                        </div>
                    )}
                </>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex w-full gap-2">
                    <textarea
                        value={comment}
                        rows="2"
                        className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                        placeholder="Raccontaci qualcosa..."
                        onChange={e => {
                            setComment(e.target.value);
                        }}
                    />
                    <Button
                        onClick={addComment}
                    >
                        Pubblica
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default RepliesModal;