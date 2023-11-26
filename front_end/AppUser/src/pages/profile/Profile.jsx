import {getUsernameFromLocStor, getQuotaInLocStor, getAllPostFrontend ,getProfilePic} from "../../components/utils/usefulFunctions.js";
import {useEffect, useState} from "react";
import {ProfilePic} from "../../components/assets/index.jsx"
import Post from "../../components/posts/Post.jsx";

function Profile () {
    const [posts, setPosts] = useState([]);
    const [pic, setPic] = useState(null);

    const name = getUsernameFromLocStor();
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllPosts = async () => {
        try {
            let currentUser = getUsernameFromLocStor();
            //console.log("name user:", currentUser);

            let res = await fetch(`/db/post/all?name=${currentUser}&offset=0`);

            if (res.ok) {
                let allPosts = await res.json();
                console.log("allPosts", allPosts)
                setPosts(allPosts);
                //console.log("num of post", allPosts.length)
                setIsLoading(false)
            } else {
                console.log("errore nel fetching dei post");
            }

        } catch (e) {
            console.log(e);
        }
    };

    const prendiProfilo = async () => {
        try {
            let res = await fetch("/db/user/profilePic");
            console.log("risposta", res);
            if (res.ok) {
                let profilePic = await res.json();
                console.log("pic diocane", profilePic.profilePic);
                setPic(profilePic.profilePic)
                return profilePic;
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const changePic = async () => {
        try {
            let res = await fetch("/db/user/profilePic", {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newProfilePic: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADEElEQVRYR+2XWahOURTH3VwKUWQK6RqiDJklUjfyRogXpG4eKHLFG6WQeJGEZMiQwovZ61UyJDJlTuISIi5JKEP8fnV2fff0nckXT3b9+s7Ze+21/2edvddZX1WLfK07ZhtgGnTOmPKO8dOwCt5kua/KMmC8K1yBGvgOL+BXwjz99YJW0Ahj4W3aGnkEbMfBEjgOdfApQ3QHxg/ATNgG9ZUKeBI9vZEwvHlaF4wM/1PoV6mAD5GDjnlWLrHJNS/rFbjhnkFrOFdQQC3236A3NCXNTRPgmJtvTMGF4+ZX6RgHZTdumoCBTHoI92B29DRFtBi1ozAY9PWo3OQ0AaOYcA2ORQKKLB5sFTALRsP1/wKKRmBkFLZT/M5IiL9Zz2Z2LNdO0jkdfJ03igroxITX4FHaB19iDtxcU6O+M/zej4235X4BmJb9loS80MwsKw+swHoTJNm9jLz1TIiAR08fWxLGEx2X2odUPJfOnzFHF6L7ibH+au4PQSP0TVrc/qwIaHMWJsEwuJ3mrGRsONc3oQGmVCpgOQ42R2H0Ok/bitFS0D4x/Hkj4FfQLNYGxkPZhFKiytR9CT7DAKi4HtD3ItgJfmL9zl9OCMME+q0bFO2c3VnhyrMH2uPETbUxcupGdIMdgbvRAkP5nQNu1JawC1bCD0gtYMoJ8Pyr3uQzBDzPlTTzxx0wKSmsWT6IC6jDwA0Xig/fX0hG5US42223EhT6RTQJWSHZ3oMb82CwLxWwjs7VYOGp0h3wIOPRc1U9+BgEi2EhmBnXwFp9BwHzI1VWLob+YsbCYTivgGBvwvJV+JrnwWEFWMU+BsM+Gc7nXFyzogKcUwsmKB+2vwKWgcliDxiiIu1PBOh/L/ihqldASLUmECsgm+nTc78f1qcoyiNAP/rzyxn2lH9YrDcbFPAKDL/HLRSO7oMTUWTS0m8eAfrR3wgIp8V1v0KTFyYLRVg+h/a3BbjOc+ihAJ+6Efr8YwH+a6oJAoyCikJrx0U3+GiYSvrjlzVRhw+Q1PSjP8s2q6vQjHh1EJAy/+8O/QaNqqk0M1e3UgAAAABJRU5ErkJggg=="
                }),
            });
            console.log("risposta", res);

        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchAllPosts()
            .then((res) => {
                console.log(res);
                prendiProfilo()
                    .then((res2)=>{
                        console.log(res2);
                        changePic()
                            .then()
                    })
            })
    }, []);

    return (
        <>
            <div className={"flex flex-col h-fit"}>
                {/* HEADER */}
                <div className={"flex items-center justify-start p-4 border border-b-black"}>
                    <img className={"w-20 h-20 rounded-full"} src={pic} alt={"profile"} />
                    <div className="flex flex-col h-full justify-between ml-4">
                        <span className={"text-3xl"}>{name}</span>
                        <div className={"flex justify-between"}>
                            <p className={"text-xl"}>Post: {posts.length}</p>
                            <p className={"ml-6 text-xl"}>Seguiti: {posts.length}</p>
                        </div>
                    </div>
                </div>
                <div className={"flex justify-evenly mt-2"}>
                    <p className={"text-xl"}>Quota giornaliera: {posts.length}</p>
                    <p className={"text-xl"}>Caratteri rimasti: {posts.length}</p>
                </div>
            </div>
            {isLoading && <h1>Caricamento...</h1>}
            {posts.map((post)=> {
                //console.log("id",post._id)
                return(
                    <Post
                        key={post._id}
                        post={post}
                    />
                )})}
        </>
    );
}

export default Profile;