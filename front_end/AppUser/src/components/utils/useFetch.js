import {useState, useEffect} from "react";

function useFetch(url){

    const [data,setData] = useState(null)
    const [error,setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (
            async function() {
                let res;
                try {
                    const response = await fetch(url, {
                        method: 'GET',
                    });
                    res = response.json();
                    setData(res);
                    console.log("useref data:",res)
                } catch (err) {
                    setError(err);
                } finally {
                    console.log("useref data finally:", res)
                    setIsLoading(false);
                }
            }
        )()
    }, [url])

    return { data, error, isLoading }

}

export {
    useFetch,
}