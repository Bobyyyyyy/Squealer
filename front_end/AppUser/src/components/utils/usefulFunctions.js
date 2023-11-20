function getUsernameFromLocStor () {
    return localStorage.getItem("username");
}

async function setUsernameInLocStor() {
    localStorage.clear();
    try {
        let res = await fetch("/db/user/session");
        let username = await res.json();
        console.log("curr user", username);
        localStorage.setItem("username", username.username);
    } catch (e) {
        console.log("errore nel settare l'user nel local storage: ", e);
    }
}

async function setQuotaInLocStor() {
    localStorage.clear();
    try {
        let res = await fetch("/db/user/quota");
        let quota = await res.json();
        console.log("quota sas",quota);
        localStorage.setItem("quota", quota);
    } catch (e) {
        console.log("errore nel settare la quota nel local storage: ", e);
    }
}

function getQuotaInLocStor () {
    return localStorage.getItem("quota");
}

async function getAllPostFrontend(){
    let response = await fetch(`/db/post/all?name=${getUsernameFromLocStor()}&offset=0`, {
        method: 'GET',
    });
    console.log(response);
    return await response.json();
}

export {
    getUsernameFromLocStor,
    setUsernameInLocStor,
    setQuotaInLocStor,
    getQuotaInLocStor,
    getAllPostFrontend
}