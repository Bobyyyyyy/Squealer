import Searchbar from "./Searchbar.jsx";
import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx";
import {Link} from "react-router-dom";

function Search ()  {

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!!name) {
            setTimeout(() => {
                let filter = JSON.stringify({
                    name: name,
                    type: type
                })
                fetch(`/db/user/all?limit=100&offset=0&filter=${filter}`)
                    .then((res) => {
                        if (res.ok) {
                            res.json()
                                .then((res)=> {
                                    setUsers(res);
                                    setError(res.length === 0);
                                });
                        }
                    })
            }, 1000)
        } else {
            setUsers([]);
            setError(false);
        }
    }, [name, type]);

    return (
        <>
        <div className="flex flex-col p-4 max-h-screen">
            <Searchbar setName={setName} name={name} />
            <div className="flex flex-wrap w-full overflow-y-scroll mt-2 gap-4 pb-40">
                {users.map((user) => {
                    return (
                        <Link className="w-full" to={`/search/${user.username}`} key={user._id} >
                            <div className="flex w-full justify-start items-center gap-4">
                                <img
                                    src={user.profilePicture}
                                    alt={`${user.username}'s profile picture`}
                                    className="w-14 h-14 object-cover rounded-full"
                                />
                                <div className="flex flex-col justify-between overflow-x-hidden w-full">
                                    <span className="font-semibold text-lg truncate">{user.username}</span>
                                    <span className="font-normal text-base text-gray-600">{user.typeUser}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {error &&
                    <div>
                        nessun utente trovato
                    </div>
                }
            </div>
        </div>
        </>
    );
}

export default Search;