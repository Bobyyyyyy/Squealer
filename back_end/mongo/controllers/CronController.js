const nodeCron = require('node-cron')
const UMM = require('../models/userMethods')
const {scheduledFnOne,scheduledPostArr, getNextTick, cast2millis, } = require("./utils");
const PMM = require("../models/postMethods");

/**
 *
 * @param {String} type - ['D','W','M']
 * @returns {Promise<void>}
 */
const resetQuota = async (type) => {
    try{
        await UMM.resetQuota(type)

    }catch (err){
        throw err;
    }
}
/**
 *
 * @param {Types.ObjectId} postId
 * @param {Number} millis - millis to next post
 * @param {String} content  - content of Squeal. Used for parse {NUM}, ...
 * @param {String} typeC - content type. Used for store only text content.
 * @param {Number} squealNumber - number of squeal of scheduled Squeal
 * @returns {Promise<void>}
 */
const createScheduledPost = async (postId, millis, squealNumber, content, typeC) =>{


    let newTimedPost = {
        allTimes: squealNumber,
        done:1,             //first insert done before.
        id : postId,
        ...(typeC === 'text') && {content: content},
        timestamp2next: millis,
        job :  nodeCron.schedule(getNextTick(millis), async () => await PMM.addTimedPost(postId),{
            scheduled: true,
            timezone: 'Europe/Rome',
        })
    }
    scheduledPostArr.push(newTimedPost)
    return {inserted: true};
}

const createOfficialScheduledPost = async(canale, endpoint) => {
    let res = await fetch(endpoint);
    let fetchobj = await res.json();
    let creator;
    let content;
    let contentType;

    switch (canale){
        case 'NASA_APOD':{
            content = fetchobj.url;
            creator = fetchobj?.copyright ? fetchobj.copyright.trim().split(' ').join('_') : 'NASA'
            contentType = fetchobj.media_type;
            break;
        }
        case 'TOP_NEWS':{
            let news = fetchobj.articles[0];
            creator = news.author.trim().split(' ').join('');
            let response = await fetch(`https://csclub.uwaterloo.ca/~phthakka/1pt/addURL.php?url=${news.url}`);
            content = [news.title,`https://1pt.co/${(await response.json()).short}`].join(' ')
            contentType = 'text';
            break;
        }

        case 'RANDOM_CATS': {
            content = fetchobj[0].url;
            creator = 'CatEnjoyer';
            contentType = 'image';
            break;
        }

        case 'TODAY_FACTS': {
            let randomIndex = Math.floor(Math.random() * fetchobj.events.length);
            let event = fetchobj.events[randomIndex]
            content = "Lo sapevi che...." + `oggi nel ${event.year}` + " " + event.text + "\n";
            for(let i = 0; i < event.pages.length; i++) {
                content = content + event.pages[i].content_urls.desktop.page + "\n";
            }
            creator = 'Wikipedia';
            contentType = 'text';
            break;
        }
    }

    try{
        await UMM.addUser({
            name: creator,
            //TODO: GENERATA CASUALMENTE
            password: (Math.random() + 1).toString(36).substring(2),
            // Non ci può accedere nessuno, scelta implementativa.
            type:'mod'
        })
    }catch (e) {}
    finally {
        let newPost = {
            creator: creator,
            destinations:[{
                name: canale,
                destType: 'official',
            }
            ],
            contentType: contentType,
            content: content,
            dateOfCreation: Date.now(),
        }

        await PMM.addPost(newPost, null);
    }
}

const createMaxQuotaJob = async (timestamp, percentage,user) => {

    // Need ID to select right update to remove. (user can be in array many times)

    let ID = Math.max(scheduledFnOne.map(schedule => schedule.user === user ? schedule.id : 0)) + 1;

    let schedule = {
        user: user,
        id: ID,
        job: nodeCron.schedule(getNextTick(timestamp), async () => {
          await UMM.updateMaxQuota(-percentage,user, ID);
        }, {
            scheduled: true,
            timezone: 'Europe/Rome',
        })
    }
    //TODO: con dizionario implementazinoe più efficiente (chiave il nome utente).
    scheduledFnOne.push(schedule);
}

module.exports =  {
    resetQuota,
    createScheduledPost,
    createMaxQuotaJob,
    createOfficialScheduledPost
};