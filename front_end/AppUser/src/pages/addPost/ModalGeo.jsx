import {Modal, Progress} from "flowbite-react";
import {useEffect, useState} from "react";

function ModalGeo({isOpen, setIsOpen, frequencyMs, numOfUpdates, startSending}) {

    const [hasFinished, setHasFinished] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (startSending) {
            if (hasFinished) {
                setIsOpen(false);
            }
            const intervalId = setInterval(() => {
                setProgress((prev) => {
                    const increment = 100/numOfUpdates;
                    if (prev >= 100) {
                        clearInterval(intervalId);
                        setHasFinished(true);
                        return 100;
                    } else {
                        return prev + increment;
                    }
                });
            }, frequencyMs);
            return () => clearInterval(intervalId);
        }
    }, [startSending]);

    return (
        <Modal show={isOpen} onClose={() => setIsOpen(false)}>
            <Modal.Header>
                Condivisione posizione
            </Modal.Header>
            <Modal.Body>
                <div className="flex flex-col w-full gap-6">
                    <Progress
                        progress={Math.ceil(progress)}
                        progressLabelPosition="inside"
                        textLabel="INVIO POSIZIONE"
                        textLabelPosition="outside"
                        size="lg"
                        labelProgress
                        labelText
                        aria-label="Progresso di invio della posizione"
                    />
                    <div className="flex flex-col flex-wrap w-full gap-4 text-md font-normal justify-center items-center">
                        <p>
                            Mentre condividi la posizione{" "}
                            <span className="font-semibold">non puoi lasciare questa pagina</span>, altrimenti la{" "}
                            <span className="font-semibold">condivisione verrà interrotta</span>
                        </p>
                        <p>
                            Una volta che la condivisione sarà terminata verrà riportata alla home
                        </p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalGeo;