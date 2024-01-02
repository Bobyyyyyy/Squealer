import {CheckBoldIcon, WarningIcon} from "../assets/index.jsx";

function CustomToast({message, type}) {

    return (
        <div className={`toast-${type === "success" ? "success" : "failure"} z-10`} role="alert">
            <div className="flex justify-between items-center gap-2">
                <p className="text-base font-normal">{message}</p>
                {type === "success" ? (
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        {CheckBoldIcon}
                    </div>
                ) : (
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        {WarningIcon}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomToast;