function getUsernameFromSessionStore () {
    return sessionStorage.getItem("username");
}

async function setUsernameInSessionStore() {
    localStorage.clear();
    sessionStorage.clear();
    try {
        let res = await fetch("/db/user/session");
        res = await res.json();
        console.log("username", res);
        sessionStorage.setItem("username", res.username);
        return res;
    } catch (e) {
        console.log("errore nel settare l'user nel local storage: ", e);
    }
}

async function getQuotaByUsername(username) {
    try {
        let res = await fetch(`/db/user/quota?user=${username}`, {
            method: 'GET'
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getPostByUsername(username){
    try {
        let res = await fetch(`/db/post/all?name=${username}&offset=0&limit=100`, {
            method: 'GET',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getPostByChannelName(channelName){
    try {
        let res = await fetch(`/db/post/all?offset=0&limit=10&channel=${channelName}`,{
            method: 'GET',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getPostByOfficialChannelName(channelName){
    try {
        let res = await fetch(`/db/post/all?offset=0&limit=10&official=${channelName}`,{
            method: 'GET',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getAllOfficialChannelPost() {
    try {
        let res = await fetch(`/db/post/all?offset=0&limit=10&official=${channelName}`,{
            method: 'GET',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getAllPost(offset) {
    try {
        let res = await fetch(`/db/post/all?offset=${offset}&limit=10`, {
            method: 'GET'
        });

        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}


async function getProfilePicByUsername (username) {
    try {
        let res = await fetch(`/db/user/profilePic?name=${username}`);
        if (res.ok) {
            let profilePic = await res.json();
            return profilePic.profilePic;
        }
    }
    catch (e) {
        console.log(e)
    }
}

async function getChannelPicByChannelName (channelName) {
    try {
        let res = await fetch(`/db/channel/channelPic?channelName=${channelName}`);
        if (res.ok) {
            return await res.json();
        }
    }
    catch (e) {
        console.log(e)
    }
}

async function getUserInfoByUsername (username) {
    try {
        let res = await fetch(`/db/user/singleuser?name=${username}`)
            if (res.ok) {
                res = await res.json();
                return {
                    profilePicture: res.profilePicture,
                    typeUser: res.typeUser,
                    _id: res._id,
                    characters: res.characters,
                    maxQuota: res.maxQuota
                };
            }
    } catch (e) {
        console.log(e)
    }
}


const checkChannelExists = async ({params}) => {
    const {nome} = params;

    if (nome.toUpperCase() === nome) {
        // e' un canale ufficiale
        const res = await fetch(`/db/official/?name=${nome}`);
        console.log("res off", res)
        if (!res.ok) {
            throw Error(`Non esiste il canale ${nome}`);
        } else {
            let channel = await res.json();
            if (channel.statusCode === 400) {
                throw Error(`Non esiste il canale ${nome}`);
            }
            return channel;
        }
    } else {
        const res = await fetch(`/db/channel/${nome}`);
        if (!res.ok) {
            throw Error(`Non esiste il canale ${nome}`);
        }
        return await res.json();
    }
}

const checkUserExists = async ({params}) => {
    const {username} = params;
    const res = await fetch(`/db/user/singleuser?name=${username}`)
    if (!res.ok) {
        throw Error(`Non esiste l'utente ${username}`);
    }
    const sol = await res.json();
    return {
        _id: sol._id,
        characters: sol.characters,
        maxQuota: sol.maxQuota,
        profilePicture: sol.profilePicture,
        username: sol.username,
        typeUser: sol.typeUser
    };
}

const handleLogout = async () => {
    let res = await fetch("/logout");
    window.location.href= res.url;
    localStorage.clear();
    sessionStorage.clear();
}


export {
    getUsernameFromSessionStore,
    setUsernameInSessionStore,
    getQuotaByUsername,
    getPostByUsername,
    getProfilePicByUsername,
    getChannelPicByChannelName,
    checkChannelExists,
    checkUserExists,
    getUserInfoByUsername,
    getPostByChannelName,
    getAllPost,
    getPostByOfficialChannelName,
    getAllOfficialChannelPost,
    handleLogout
}