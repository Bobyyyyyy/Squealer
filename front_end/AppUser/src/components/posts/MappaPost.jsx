import {useEffect} from "react";
import {Icon} from "leaflet";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

function MappaPost({stringCoor}){
    const coordinates = JSON.parse(stringCoor);
    //let coordinatesString = stringCoor.split(",");
    /*
    const coordinates = [
        parseFloat(coordinatesString[0]),
        parseFloat(coordinatesString[1])
    ];

     */

    const IconMarker = new Icon({
        //iconUrl: MarkerPosition,
        iconUrl: "/img/location.png",
        iconSize: [48, 48],
    })

    return (
        <MapContainer
            center={coordinates}
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
                position={coordinates}
                icon={IconMarker}
            >
                <Popup>You are here</Popup>
            </Marker>
        </MapContainer>
    );
}
export default MappaPost;