import { Link, useRouteError } from "react-router-dom"

function ErrorPage() {
    const error = useRouteError()

    return (
        <div className="flex flex-col w-full h-full justify-start items-center gap-8 mt-8">
            <h2 className="text-4xl font-extrabold text-center">ERRORE</h2>
            <p className="text-2xl font-semibold text-center">{error.message}</p>
            <Link
                className="button uppercase"
                to="/"
            >
                Torna alla Homepage
            </Link>
        </div>
    )
}

export default ErrorPage;