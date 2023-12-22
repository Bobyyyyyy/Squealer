import {useEffect, useState} from "react";

function TimedPost({frequency, numberOfPosts, setNumberOfPosts}) {

    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [days, setDays] = useState(0);

    const parseInMs = () => {
        let totalSec = seconds + 60*(minutes + 60*(hours + 24 * days));
        return totalSec*1000;
    }

    useEffect(() => {
        frequency.current = parseInMs();

        console.log(seconds, minutes, hours, days)
        console.log(frequency.current)
    }, [seconds, minutes, hours, days]);

    return (
        <div className="flex flex-col justify-between w-full gap-2 mb-4">
            <Interval name={"Numero di post"} min={1} value={numberOfPosts} setValue={setNumberOfPosts} />
            <span className="text-xl text-center">Frequenza</span>
            <div className="flex flex-wrap w-full gap-4 justify-between items-center">
                <Interval name={"secondi"} min={0} value={seconds} setValue={setSeconds} />
                <Interval name={"minuti"} min={0} value={minutes} setValue={setMinutes} />
                <Interval name={"ore"} min={0} value={hours} setValue={setHours} />
                <Interval name={"giorni"} min={0} value={days} setValue={setDays} />
            </div>

        </div>
    );
}

function Interval({name, value, setValue, min}) {
    return (
        <div>
            <label htmlFor="number-input" className="text-lg md:text-2xl mr-2">{name} :</label>
            <input type="number" id="number-input"
                   className="appearance-none w-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                   placeholder="0"
                   //defaultValue={min}
                   value={String(value)}
                   min={min}
                   onChange={(e) => {
                        if (e.target.value >= min) {
                            setValue(e.target.value)
                        }
                   }}
            />
        </div>
    );
}

export default TimedPost;