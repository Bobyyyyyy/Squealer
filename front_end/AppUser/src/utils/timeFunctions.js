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
    parseTime
}