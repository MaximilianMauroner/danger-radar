import { MapContainer, Circle, Marker, Popup, TileLayer, useMapEvents, MapContainerProps } from "react-leaflet";
import React, { useState, useEffect, RefAttributes } from "react";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { JSXInternal } from "preact/src/jsx";

function Map() {
  const fillBlueOptions = { fillColor: "#0484D6" };
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (map) {
      setInterval(function() {
        map.invalidateSize();
      }, 100);
    }
  }, [map]);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={17} scrollWheelZoom={false}
                  style={{ height: "100vh", width: "100%" }} whenReady={(e) => setMap(e.target)}>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ShowPersonalMarker passMap={map} />
    </MapContainer>
  );
}

export default Map;
const ShowPersonalMarker = ({ passMap }: { passMap: any }) => {
  console.log(passMap);
  const [position, setPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    if (passMap) {
      passMap.locate();
    }
  }, [passMap]);

  const map = useMapEvents({
    locationfound(e: any) {
      if (e.latlng != undefined) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      }
    }
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );

};
