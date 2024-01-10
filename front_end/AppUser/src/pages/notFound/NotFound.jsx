import {Link} from "react-router-dom";

function NotFound() {
    let path = location.pathname;
    let directories = path.split("/");
    let lastPage = directories[(directories.length - 1)];
    console.log(lastPage)

    return (
        <div className="flex flex-col w-full justify-center items-center gap-6 mt-8 text-lg font-normal px-4">
            <h2 className="text-4xl font-extrabold text-center">ERRORE</h2>
            <p
                className="text-2xl font-semibold text-center"
                aria-label={`La pagina ${lastPage} non è stata trovata!`}
            >
                La pagina {lastPage} non è stata trovata!
            </p>
            <p
                className="text-2xl font-normal text-center"
                aria-label="Verifica di trovarti nella pagina giusta"
            >
                Verifica che l'indirizzo della pagina sia corretto
            </p>
            <Link
                className="button uppercase text-center"
                to="/"
                aria-label="Torna alla Homepage"
            >
                Torna alla Homepage
            </Link>
        </div>
    );
}

export default NotFound;