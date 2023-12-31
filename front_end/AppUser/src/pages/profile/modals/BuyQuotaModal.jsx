import {Modal} from "flowbite-react";
import {useEffect, useState} from "react";
import {EuroIcon} from "../../../components/assets/index.jsx";

function BuyQuotaModal({isOpen, setIsOpen, setHasUpdated}) {
    const costForReset = 150;
    const UPGRADE_QUOTA_PERC = 15;

    const [resetD, setResetD] = useState(false);
    const [resetW, setResetW] = useState(false);
    const [resetM, setResetM] = useState(false);
    const [increasementQuota, setIncreasementQuota] = useState(false);

    const [cost, setCost] = useState(0);

    useEffect(() => {
        let numAttivi = 0 + (resetD ? 1 : 0) + (resetW ? 1 : 0) + (resetM ? 1 : 0) + (increasementQuota ? 1 : 0);
        setCost(costForReset * numAttivi);
    }, [resetD, resetW, resetM, increasementQuota]);

    async function quotaReset (type){
        let res = await fetch('/db/user/quota', {
            method: 'PUT',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: type,
            })
        })
        return res.ok;
    }

    async function increaseMaxQuota(){
        let res = await fetch('/db/user/maxquota', {
            method: 'PUT',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                percentage: UPGRADE_QUOTA_PERC
            })
        })
        return res.ok;
    }

    const handleBuyQuota = async () => {
        resetD && await quotaReset("D");
        resetW && await quotaReset("W");
        resetM && await quotaReset("M");
        increasementQuota && await increaseMaxQuota();
        setResetD(false);
        setResetW(false);
        setResetM(false);
        setIsOpen(false);
        setHasUpdated(true);
    }

    return (
        <Modal show={isOpen} onClose={()=>setIsOpen(false)}>
            <Modal.Header>
                <span className="text-2xl">
                    Compra quota
                </span>
            </Modal.Header>
            <Modal.Body>
                <div className="flex flex-col w-full items-start justify-center gap-6">
                    <ResetQuotaType text={"Reset quota giornaliera"} reset={resetD} setReset={setResetD} />
                    <ResetQuotaType text={"Reset quota settimanale"} reset={resetW} setReset={setResetW} />
                    <ResetQuotaType text={"Reset quota mensile"} reset={resetM} setReset={setResetM} />
                    <ResetQuotaType text={"Aumento quota massima"} reset={increasementQuota} setReset={setIncreasementQuota} />
                </div>
                <div className="flex w-full justify-center mt-6">
                    <span className="text-xl text-red-600">Spesa: {cost}</span>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-around items-center w-full">
                    <button
                        className="button-action"
                        onClick={handleBuyQuota}
                    >
                        Acquista {EuroIcon}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

function ResetQuotaType({text, reset, setReset}) {
    return (
        <div className="flex items-center gap-4">
            <label
                htmlFor="default-checkbox"
                className="text-xl md:text-2xl"
            >
                {text}
            </label>
            <input
                onChange={() => setReset((prev) => !prev)}
                type="checkbox"
                checked={reset}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
        </div>
    );
}

export default BuyQuotaModal;