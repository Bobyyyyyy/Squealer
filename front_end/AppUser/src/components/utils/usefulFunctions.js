function getUsernameFromLocStor () {
    return localStorage.getItem("username");
}

async function setUsernameInLocStor() {
    localStorage.clear();
    try {
        let res = await fetch("/db/user/session");
        let username = await res.json();
        localStorage.setItem("username", username.username);
    } catch (e) {
        console.log("errore nel settare l'user nel local storage: ", e);
    }
}

async function setQuotaInLocStor() {
    try {
        let res = await fetch("/db/user/quota");
        console.log("quota res", res);
        let quota = await res.json();
        console.log("quota",quota);
        localStorage.setItem("quota", quota);
    } catch (e) {
        console.log("errore nel settare la quota nel local storage: ", e);
    }
}

function getQuotaInLocStor () {
    return localStorage.getItem("quota");
}

async function getPostByUsername(username){
    try {
        let res = await fetch(`/db/post/all?name=${username}&offset=0`, {
            method: 'GET',
        });
        let allPosts = await res.json();
        if (res.ok) {
            return allPosts;
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



export {
    getUsernameFromLocStor,
    setUsernameInLocStor,
    setQuotaInLocStor,
    getQuotaInLocStor,
    getPostByUsername,
    getProfilePicByUsername,
    parseTime,
    blob2base64, compressBlob,
    getEmbed,
}