import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useEffect, useState} from "react";
import {Icon} from "leaflet"
import "leaflet/dist/leaflet.css"


function Mappa({position, setPosition}) {
    //const [position, setPosition] = useState(null);
    const [error, setError] = useState(false);
    const savePosition = (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
    }

    const handleErrorPosition = (err) => {
        console.log(`ERROR(${err.code}): ${err.message}`);
        setError(true);
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(savePosition, handleErrorPosition);
        } else {
            console.log("mappe non supportate")
        }
    }, []);

    const IconMarker = new Icon({
        //iconUrl: MarkerPosition,
        iconUrl: "/img/location.png",
        iconSize: [48, 48],
    })

    return (
        <div className={"h-96 w-full"}>
            {
                error &&
                <span>Errore nel caricamento della posizione, assicurarsi che il browser supporti questo tipo di contenuto</span>
            }
            {
                position !== null &&
                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={false}
                    whenReady={(map)=> {
                        //console.log("mappa pronta", map);
                    }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={position}
                        icon={IconMarker}
                    >
                        <Popup>You are here</Popup>
                    </Marker>
                </MapContainer>
            }
        </div>
    );
}

export default Mappa;
