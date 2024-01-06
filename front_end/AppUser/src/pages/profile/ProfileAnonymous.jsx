import React from "react";
import {LogoLittle} from "../../components/assets/index.jsx"
function ProfileAnonymous() {
    const handleLogout = async () => {
        let res = await fetch("/logout");
        window.location.href= res.url;
        localStorage.clear();
        sessionStorage.clear();
    }

    return (
        <div className="flex flex-col w-full justify-center items-center gap-8 mt-6" aria-live="polite">
            <span className="text-2xl font-semibold text-center">
                Al momento sei in modalità anonima!
            </span>
            <span className="text-xl font-normal text-center">
                Effettua il login per accedere a tutte le funzionalità di Squealer.
            </span>
            <button
                className="button uppercase font-bold"
                onClick={handleLogout}
                aria-label="Effettua l'accesso"
            >
                Accedi
            </button>
            <img
                src={LogoLittle}
                alt="Squealer's logo"
                className="w-full h-full max-w-lg max-h-lg"
                aria-hidden="true"
            />
        </div>
    );
}

export default ProfileAnonymous;