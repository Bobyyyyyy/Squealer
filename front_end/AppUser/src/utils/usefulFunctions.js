function getUsernameFromSessionStore () {
    return sessionStorage.getItem("username");
}

async function setUsernameInSessionStore() {
    localStorage.clear();
    sessionStorage.removeItem("username");
    try {
        let res = await fetch("/db/user/session");
        res = await res.json();
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
        let res = await fetch(`/db/post/user2watch?offset=${offset}&limit=${limit}&user2watch=${username}`, {
            method: 'GET'
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getPostByProfile(offset = 0, limit = POST_TO_GET){
    try {
        let res = await fetch(`/db/post/profile?offset=${offset}&limit=${limit}`, {
            method: 'GET'
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

async function getHomeAnonymousPost(offset, limit) {
    try {
        let res = await fetch(`/db/post/anonymous?offset=${offset}&limit=${limit}`,{
            method: 'GET',
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getHomePosts(offset, limit) {
    try {
        let res = await fetch(`/db/post/?offset=${offset}&limit=${limit}`, {
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
                    typeUser: res.typeUser === 'smm' ? 'vip' : res.typeUser,
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

async function getPostByKeyword(tag, offset, limit){
    try {
        const res = await fetch(`/db/post/all?keyword=${tag}&offset=${offset}&limit=${limit}`);
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.log(error)
    }
}

async function getPostByMention(mention, offset, limit){
    try {
        const res = await fetch(`/db/post/mention?mention=${mention}&offset=${offset}&limit=${limit}`);
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.log(error)
    }
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

const isUserAnonymous = () => {
    return getUsernameFromSessionStore().match(/guest-\d+/g) !== null;
}

const POST_TO_GET = 10;
const GUESTREGEX = /guest-\d+/g;

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
    getHomePosts,
    getPostByOfficialChannelName,
    getHomeAnonymousPost,
    handleLogout,
    setToastNotification,
    deleteToastNotification,
    getToastNotification,
    getNotification,
    scrollEndDetectorHandler,
    resetPosts,
    getPostByProfile,
    getPostByKeyword,
    getPostByMention,
    isUserAnonymous,
    POST_TO_GET,
    GUESTREGEX
}