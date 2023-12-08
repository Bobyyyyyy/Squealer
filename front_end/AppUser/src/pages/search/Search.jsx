import Mappa from "../../components/posts/Mappa.jsx";
import Searchbar from "../../components/Searchbar.jsx";

function Search ()  {
    return (
        <>
        <div>
            <Searchbar />
            <div className={"flex justify-between items-center mx-4"}>

                <button
                    className="w-fit p-2 bg-primary"
                >
                    utenti
                </button>
                <button
                    className="w-fit p-2 bg-primary"
                >
                    canali
                </button>
                <button
                    className="w-fit p-2 bg-primary"
                >
                    trend
                </button>
            </div>
        </div>
        </>
    );
}

export default Search;