import {useEffect, useRef, useState} from "react";
import {Icon} from "leaflet";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

function MappaPost({stringCoor}){
    const isArr = useRef(false);
    const coordinatesArr = useRef([]);
    const coordinates = JSON.parse(stringCoor);
    console.log("cord", coordinates);

    if (Array.isArray(coordinates)) {
        isArr.current = true;
        coordinatesArr.current = coordinates;
        console.log(coordinatesArr.current)
    }

    const IconMarker = new Icon({
        iconUrl: "/img/location.png",
        iconSize: [48, 48],
    })

    return (
        <>
        {isArr.current ? (
            <>
                <MapContainer
                    center={coordinatesArr.current[0]}
                    zoom={3}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {coordinatesArr.current.map((coor) => {
                        console.log("oi", coor)
                        return (
                            <Marker position={coor} icon={IconMarker} >
                                <Popup>
                                    You are here
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </>
            ) : (
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
        )}
        </>
    );
}
export default MappaPost;