
import {smm, currentVip, QUALITY, MAX_HEIGHT, MAX_WIDTH} from './config.js'
import {useStore} from "vuex";

async function start(){
    const store = useStore();
    let res = await fetch("/db/user/session",{
        method:"GET",
    });
    smm.value = (await res.json()).username;

    res = await fetch("/db/user/sessionVip",{
        method:"GET",
    });
    currentVip.value = (await res.json()).vip;
    if (currentVip.value){
        store.commit('setQuota',await getUserQuota())
    }
}

function getPage(){
    return window.location.pathname.split('/')[2];
}

async function getPosts(query,offset){
    try{
        let res = await fetch(`/db/post/all?${query}&offset=${offset}`,{
            method:"GET",
        });
        let posts = (await res.json()).map(post => { return {...post, dateOfCreation: new Date(Date.parse(post.dateOfCreation))} });
        console.log(posts);
        return posts;
    }catch (e) {
        throw e
    }
}

async function getUserQuota() {
    try{
        let res = await fetch(`/db/user/quota?user=${currentVip.value}`,{
            method:'GET',
        })
        return (await res.json());
    }
    catch (err) {
        throw err;
    }
}

async function getUserInfo(){
    try{
        let res = await fetch(`/db/user/info?user=${currentVip.value}`,{
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
    console.log(file instanceof File);
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

export{
    start,
    getPage,
    getPosts,
    getUserQuota,
    getUserInfo,
    getLastPost,
    blob2base64,
    compressBlob,
}