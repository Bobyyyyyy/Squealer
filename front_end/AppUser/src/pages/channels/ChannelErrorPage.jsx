import { Link, useRouteError } from "react-router-dom"

function ChannelErrorPage() {
    const error = useRouteError()

    return (
        <div className="flex flex-col w-full h-full justify-start items-center gap-8">
            <h2 className="text-4xl font-extrabold mt-8">ERRORE</h2>
            <p className="text-2xl font-semibold">{error.message}</p>
            <Link
                className="p-4 bg-primary rounded-md text-xl font-medium"
                to="/"
            >Back to the Homepage
            </Link>
        </div>
    )
}

export default ChannelErrorPage;