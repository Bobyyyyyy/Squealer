
import {QUALITY, MAX_HEIGHT, MAX_WIDTH, URLHTTPREGEX, cast2millis} from './config.js'

function getPage(){
    return window.location.pathname.split('/')[2];
}

async function getPosts(query,offset){
    try{
        let res = await fetch(`/db/post/all?${query}&offset=${offset}`,{
            method:"GET",
        });
        return (await res.json()).map(post => { return {...post, dateOfCreation: new Date(Date.parse(post.dateOfCreation))} });
    }catch (e) {
        throw e
    }
}

async function getUserQuota(vip) {
    try{
        let res = await fetch(`/db/user/quota?user=${vip}`,{
            method:'GET',
        })
        return (await res.json());
    }
    catch (err) {
        throw err;
    }
}

async function getUserInfo(vip){
    try{
        let res = await fetch(`/db/user/info?user=${vip}`,{
            method:'GET',
        })
        return (await res.json());
    }
    catch (err) {
        throw err;
    }
}

async function getLastPost(vipName){
    try{
        let res = await fetch(`/db/user/lastPost?user=${vipName}`,{
            method:'GET',
        })
        return  await res.json();
    }
    catch (err) {
        throw err;
    }
}

//voglio che mi ritorni per ogni una lista di date.
async function getPostsDate(vipname,onlyThisMonth){
    try{
        let res = await fetch(`/db/post/allDates?user=${vipname}&onlyMonth=${onlyThisMonth}`,{
            method:"GET",
        })
        return await res.json();

    }
    catch (err){
        console.log(err);
    }
}

/* IMG TO BASE64 Compressed */
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
        canvas.toBlob(blob => {
            resolve(blob);
        },file.type, QUALITY)
    }
})

/**
 *
 * @param {Array<{name:String,destType:String}>} destinations
 * @param {Array<String>} tags - #
 * @return {String} - '@francesco, §popi_ma_buoni,'
 */
const parseDestinationsViewPost = (destinations, tags) => {
    let arr = [];
    destinations.forEach(dest => {
        arr.push(dest.destType === 'channel' ? `§${dest.name}` : `@${dest.name}`)
    })
    if(tags) arr = arr.concat(tags.map(tag => `#${tag}`))
    return arr.join(', ');
}

function getLast30Days() {
    let arr2ret = [];
    for (let i = 1; i < 31; i++) {
        let day = (new Date(new Date().setDate(new Date().getDate() - (30 - i))));
        arr2ret.push( day.toString().split(' ').slice(1,3).join(' ') )
    }
    return arr2ret;
}

function getLength(reactions){
    Object.keys(reactions).forEach(typeReac => {
        Object.keys(reactions[typeReac]).forEach(date => {
            reactions[typeReac][date] = reactions[typeReac][date].length;
        })
    })
    return reactions
}

function parseReactionDate(reactions){
    Object.keys(reactions).forEach((typeReac) => {
        let reac30days = getLast30Days().reduce((accumulator, value) => {
            return {...accumulator, [value]: []};
        }, {});
        reactions[typeReac].forEach(reac => {
            let monthDay = new Date(reac.date).toString().split(' ').slice(1,3).join(' ');
            reac30days[monthDay].push(reac);
        })
        reactions[typeReac] = reac30days;
    })
    return reactions;
}

function parseReactionType(reactions){
    let reactionType = {
        'heart': [],
        'thumbs-up': [],
        'thumbs-down': [],
        'heartbreak': []
    }
    reactions.forEach(reac => {
        reactionType[reac.rtype].push(reac);
    })
    return reactionType;
}

const parseContentText = (content, tag) => {
    let links = content.match(URLHTTPREGEX);

    if(links){
        let content_noLink = '';
        links.forEach(link => {content_noLink = content.replace(link,'__SPLIT__').split('__SPLIT__')});

        let html = '<div class="w-100">';
        //str_no_links.length > links.length SEMPRE
        for (let i = 0; i < content_noLink.length; i++){
            html += `<${tag} class="text-md-start"> ${content_noLink[i]}`
            if(typeof links[i] !== 'undefined')
                html += `<a href=${links[i]} target=”_blank”>${links[i]}</a>`
            html += `</${tag}>`
        }
        html+= '</div>';
        return html;
    }
    else return `<${tag}>${content}</${tag}>`;
}

async function logout(){
    //TODO : DA GET A PUT --> modifica sessione
    let res = await fetch("/logout");
    window.location.href= res.url;
}

/**
 * @param {Number} times - squeal number = beep numbers
 * @param {Number} interval - x > 0
 * @param {String} frequency - 'seconds', 'minutes' or 'hours
 */
function setupBeep(times, interval, frequency){
    let tmpTime = (interval) * cast2millis[frequency]
    let snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

    for (let i = 1; i <= times; i++) {
        setTimeout(() => snd.play(),i * tmpTime);
    }
}

/**
 *
 * @param {Array} frequency - e.g. [6,seconds], [5,days], ...
 * @returns {number} - timestamp - e.g. 100000 ms
 */
const parse2timestamp = (frequency) => {
    return (cast2millis[frequency[1]] * parseInt(frequency[0]));
}

function parseTime(dateCreation){
    let now = new Date().getTime()

    let timePassed = (now - new Date(dateCreation).getTime()) / 1000

    return timePassed < 60 ? `${Math.floor(timePassed)} s.` :
        timePassed < 60*60 ? `${Math.floor(timePassed/60)} m.` :
            timePassed < 60*60*24 ? `${Math.floor(timePassed/(60*60))} h.` :
                timePassed < 60*60*24*7 ? `${Math.floor(timePassed/(60*60*24))} d.` :
                    timePassed < 60*60*24*7*4 ? `${Math.floor(timePassed/(60*60*24*7))} w.` :
                        timePassed < 60*60*24*7*4*12 ? `${Math.floor(timePassed/(60*60*24*7*4))} m.` :
                            `1+ y.`
}

export{
    getPage,
    getPosts,
    getUserQuota,
    getUserInfo,
    getLastPost,
    blob2base64,
    compressBlob,
    getPostsDate,
    parseDestinationsViewPost,
    parseReactionDate,
    parseReactionType,
    getLength,
    getLast30Days,
    parseContentText,
    logout,
    setupBeep,
    parse2timestamp,
    parseTime
}