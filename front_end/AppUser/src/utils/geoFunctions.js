let nIntervId;
let geolocationSent;

function startSendingPosition(frequencyMs, numberOfPosts, postID) {
    if (!nIntervId) {
        geolocationSent = 0;
        nIntervId = setInterval(handleSendPosition, frequencyMs, numberOfPosts, postID);
    }
}

function handleSendPosition(numberOfPosts, postID) {
    console.log("handle", geolocationSent, numberOfPosts, postID)
    if (geolocationSent < numberOfPosts) {
        geolocationSent += 1;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                console.log("lat", position.coords.latitude,"lng", position.coords.longitude);

                let res = await fetch("/db/post/position", {
                    method: "PUT",
                    body: JSON.stringify({
                        postID: postID,
                        newPosition: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                if (res.ok) {
                    console.log(res);
                }
            }, handleErrorPosition);
        } else {
            console.log("mappe non supportate")
        }
    } else {
        clearInterval(nIntervId);
        nIntervId = null;
    }
}

const handleErrorPosition = (err) => {
    console.log(`ERROR(${err.code}): ${err.message}`);
}


export {
    startSendingPosition
}