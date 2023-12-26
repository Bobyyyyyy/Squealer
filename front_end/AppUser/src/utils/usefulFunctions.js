function getUsernameFromSessionStore () {
    return sessionStorage.getItem("username");
}

async function setUsernameInSessionStore() {
    localStorage.clear();
    sessionStorage.clear();
    try {
        let res = await fetch("/db/user/session");
        res = await res.json();
        sessionStorage.setItem("username", res.username);
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

function parseTime(post){
    let now = new Date().getTime()
    let timePassed = (now - new Date(post.dateOfCreation).getTime()) / 1000

    return timePassed < 60 ? `${Math.floor(timePassed)} s.` :
        timePassed < 60*60 ? `${Math.floor(timePassed/60)} m.` :
            timePassed < 60*60*24 ? `${Math.floor(timePassed/(60*60))} h.` :
                timePassed < 60*60*24*7 ? `${Math.floor(timePassed/(60*60*24))} d.` :
                    timePassed < 60*60*24*7*4 ? `${Math.floor(timePassed/(60*60*24*7))} w.` :
                        timePassed < 60*60*24*7*4*12 ? `${Math.floor(timePassed/(60*60*24*7*4))} m.` :
                            `1+ y.`
}

const MAX_HEIGHT = 1200;
const MAX_WIDTH = 1200;
const QUALITY = 0.7;

function calculateSize(img, maxWidth, maxHeight) {
    let width = img.width;
    let height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
        }
    }
    return [width, height];
}

const blob2base64 = (blob) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
});

const compressBlob = (file) => new Promise((resolve) => {
    let blobURL = URL.createObjectURL(file);
    let compressedImg = new Image();
    compressedImg.src = blobURL;
    compressedImg.onload = () => {
        const [newWidth, newHeight] = calculateSize(compressedImg, MAX_WIDTH, MAX_HEIGHT);
        const canvas = document.createElement('canvas');
        canvas.height = newHeight;
        canvas.width = newWidth;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(compressedImg, 0, 0, newWidth, newHeight);
        return ( canvas.toBlob(blob => {
            resolve(blob);
        },file.type, QUALITY));
    };
})

const getEmbed = (url) => {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);

    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return 'error';
    }
}

const checkChannelExists = async ({params}) => {
    const {nome} = params;
    const res = await fetch(`/db/channel/${nome}`)
    if (!res.ok) {
        throw Error(`Non esiste il canale ${nome}`);
    }
    return await res.json();
}

const checkUserExists = async ({params}) => {
    const {username} = params;
    const res = await fetch(`/db/user/singleuser?name=${username}`)
    if (!res.ok) {
        throw Error(`Non esiste l'utente ${username}`);
    }
    const sol = await res.json();
    const user = {
        _id: sol._id,
        characters: sol.characters,
        maxQuota: sol.maxQuota,
        profilePicture: sol.profilePicture,
        username: sol.username,
    }
    console.log("utente", sol, user);
    return user;
}



export {
    getUsernameFromSessionStore,
    setUsernameInSessionStore,
    getQuotaByUsername,
    getPostByUsername,
    getProfilePicByUsername,
    parseTime,
    blob2base64,
    compressBlob,
    getEmbed,
    checkChannelExists,
    checkUserExists,
    getUserInfoByUsername,
    getPostByChannelName
}