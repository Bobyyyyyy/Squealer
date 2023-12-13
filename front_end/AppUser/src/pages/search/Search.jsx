import Mappa from "../../components/posts/Mappa.jsx";
import Searchbar from "./Searchbar.jsx";
import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx";
import {Link} from "react-router-dom";

function Search ()  {

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!!name) {
            setTimeout(() => {
                let filter = JSON.stringify({
                    name: name,
                    type: type
                })
                console.log(filter)
                fetch(`/db/user/all?limit=100&offset=0&filter=${filter}`)
                    .then((res) => {
                        if (res.ok) {
                            res.json()
                                .then((res)=> {
                                    setUsers(res);
                                });
                        }
                    })
            }, 1000)
        } else {
            setUsers([]);
        }
    }, [name, type]);

    return (
        <>
        <div className="flex flex-col p-4">
            <Searchbar setName={setName} name={name} />
            <div className="flex flex-wrap w-full h-fit max-h-[580px] overflow-y-scroll mt-2 gap-4">

                {users.map((user) => {
                    return (
                        <Link className="w-full" to={`/search/${user.username}`} key={user._id} >
                            <div className="flex w-full justify-start gap-4 border-2 border-black">
                                <img src={user.profilePicture} alt={`${user.username}'s profile picture`} className="w-14 h-14"/>
                                <div className="flex flex-col overflow-x-hidden  mx-2 w-full">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-lg">{user.username}</span>
                                        <span className="font-medium text-base text-red-600">{user.typeUser}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
        </>
    );
}

export default Search;