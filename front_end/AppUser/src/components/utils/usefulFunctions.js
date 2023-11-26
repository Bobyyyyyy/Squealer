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
        console.log("quota",quota);
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

async function changeProfilePic () {
    let res = await fetch("/db/user/",{
        method:"PUT",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify( {newProfilePic: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADEElEQVRYR+2XWahOURTH3VwKUWQK6RqiDJklUjfyRogXpG4eKHLFG6WQeJGEZMiQwovZ61UyJDJlTuISIi5JKEP8fnV2fff0nckXT3b9+s7Ze+21/2edvddZX1WLfK07ZhtgGnTOmPKO8dOwCt5kua/KMmC8K1yBGvgOL+BXwjz99YJW0Ahj4W3aGnkEbMfBEjgOdfApQ3QHxg/ATNgG9ZUKeBI9vZEwvHlaF4wM/1PoV6mAD5GDjnlWLrHJNS/rFbjhnkFrOFdQQC3236A3NCXNTRPgmJtvTMGF4+ZX6RgHZTdumoCBTHoI92B29DRFtBi1ozAY9PWo3OQ0AaOYcA2ORQKKLB5sFTALRsP1/wKKRmBkFLZT/M5IiL9Zz2Z2LNdO0jkdfJ03igroxITX4FHaB19iDtxcU6O+M/zej4235X4BmJb9loS80MwsKw+swHoTJNm9jLz1TIiAR08fWxLGEx2X2odUPJfOnzFHF6L7ibH+au4PQSP0TVrc/qwIaHMWJsEwuJ3mrGRsONc3oQGmVCpgOQ42R2H0Ok/bitFS0D4x/Hkj4FfQLNYGxkPZhFKiytR9CT7DAKi4HtD3ItgJfmL9zl9OCMME+q0bFO2c3VnhyrMH2uPETbUxcupGdIMdgbvRAkP5nQNu1JawC1bCD0gtYMoJ8Pyr3uQzBDzPlTTzxx0wKSmsWT6IC6jDwA0Xig/fX0hG5US42223EhT6RTQJWSHZ3oMb82CwLxWwjs7VYOGp0h3wIOPRc1U9+BgEi2EhmBnXwFp9BwHzI1VWLob+YsbCYTivgGBvwvJV+JrnwWEFWMU+BsM+Gc7nXFyzogKcUwsmKB+2vwKWgcliDxiiIu1PBOh/L/ihqldASLUmECsgm+nTc78f1qcoyiNAP/rzyxn2lH9YrDcbFPAKDL/HLRSO7oMTUWTS0m8eAfrR3wgIp8V1v0KTFyYLRVg+h/a3BbjOc+ihAJ+6Efr8YwH+a6oJAoyCikJrx0U3+GiYSvrjlzVRhw+Q1PSjP8s2q6vQjHh1EJAy/+8O/QaNqqk0M1e3UgAAAABJRU5ErkJggg=="})
    })
    let userMod = await res.json();
    console.log("userMod", userMod);
}

async function getProfilePic () {
    let res = await fetch("/db/user/profilePic");
    console.log("risposta", res);
    let profilePic = await res.json();
    console.log("profPic usf", profilePic);
    return profilePic;
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

export {
    getUsernameFromLocStor,
    setUsernameInLocStor,
    setQuotaInLocStor,
    getQuotaInLocStor,
    getAllPostFrontend,
    getProfilePic,
    parseTime
}