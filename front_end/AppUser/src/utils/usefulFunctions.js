const LIMIT_POST = 10;

function getUsernameFromSessionStore () {
    return sessionStorage.getItem("username");
}

async function setUsernameInSessionStore() {
    localStorage.clear();
    sessionStorage.removeItem("username");
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

async function getPostByUsername(username, offset = 0, limit = POST_TO_GET){
    try {
        let res = await fetch(`/db/post/all?name=${username}&offset=${offset}&limit=${limit}`, {
            method: 'GET',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getPostByChannelName(channelName, offset= 0, limit= POST_TO_GET){
    try {
        let res = await fetch(`/db/post/all?offset=${offset}&limit=${limit}&channel=${channelName}`,{
            method: 'GET',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getPostByOfficialChannelName(channelName, offset= 0, limit= POST_TO_GET){
    try {
        let res = await fetch(`/db/post/all?offset=${offset}&limit=${limit}&official=${channelName}`,{

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
        let res = await fetch(`/db/post/all?offset=0&limit=${LIMIT_POST}&official=${channelName}`,{
            method: 'GET',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getAllPost(offset, limit) {
    try {
        let res = await fetch(`/db/post/all?offset=${offset}&limit=${limit}`, {
            method: 'GET'
        });
        if (res.ok) {
            return await res.json();
        } else return [];
    } catch (e) {
        console.log(e);
        return null;
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

const setToastNotification = (message, type) => {
    sessionStorage.setItem("message", message);
    sessionStorage.setItem("type", type);
}

const deleteToastNotification = () => {
    sessionStorage.removeItem("message");
    sessionStorage.removeItem("type");
}

const getToastNotification = () => {
    let messageRes = sessionStorage.getItem("message");
    let typeRes = sessionStorage.getItem("type");
    if (!!messageRes && !!typeRes) {
        // sono entrambi non nulli
        return {
            message: messageRes,
            type: typeRes
        }
    } else {
        return null;
    }
}

const getNotification = async () => {
    try {
        let res = await fetch(`/db/notification?user=${getUsernameFromSessionStore()}`, {
            method:'GET'
        });
        if (res.ok) {
            res = await res.json();
            if (Object.keys(res).length !== 0) {
                return res;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

const POST_TO_GET = 10;

const scrollEndDetectorHandler = async (lastRequestLength, lastHeightDiv, updatePost) => {
    const postDiv = document.getElementById("postDiv");
    // se l'ultima richiesta ha ricevuto meno post del massimo allora sono finiti,
    // quindi non serve fare una nuova richiesta
    if (postDiv && window.innerHeight + window.scrollY >= postDiv.offsetHeight && lastRequestLength.current >= POST_TO_GET) {
        lastHeightDiv.current = window.scrollY;
        await updatePost();
    }
};

const resetPosts = (setPosts, currentOffset, lastRequestLength, lastHeightDiv) => {
    setPosts([]);
    currentOffset.current = 0;
    lastRequestLength.current = 0;
    lastHeightDiv.current = 0;
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
    handleLogout,
    setToastNotification,
    deleteToastNotification,
    getToastNotification,
    getNotification,
    scrollEndDetectorHandler,
    resetPosts,
    POST_TO_GET,
}