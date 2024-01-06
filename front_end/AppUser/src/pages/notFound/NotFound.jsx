import {Link} from "react-router-dom";

function NotFound() {
    let path = location.pathname;
    let directories = path.split("/");
    let lastPage = directories[(directories.length - 1)];
    console.log(lastPage)

    return (
        <div className="flex flex-col w-full justify-center items-center gap-6 mt-8 text-lg font-normal">
            <p aria-label={`La pagina ${lastPage} non è stata trovata!`}>
                La pagina {lastPage} non è stata trovata!
            </p>
            <p aria-label="Verifica di trovarti nella pagina giusta">
                Verifica di trovarti nella pagina giusta
            </p>
            <Link
                className="button uppercase"
                to="/"
                aria-label="Torna alla Homepage"
            >
                Torna alla Homepage
            </Link>
        </div>
    );
}

export default NotFound;