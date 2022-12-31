import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import React, { useEffect, useState } from "react";
import { LatLng } from "leaflet";
import { defaultMarker } from "../icons/map_icons";

const UserMarker = () => {

  const passMap = useMap();
  const [position, setPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    if (passMap) {
      passMap.locate();
    }
  }, [passMap]);

  const map = useMapEvents({
    locationfound(e: any) {
      if (e.latlng != undefined) {
        if (localStorage.getItem("userLocation")) {
          return;
        }
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        localStorage.setItem("userLocation", JSON.stringify([e.latlng.lat, e.latlng.lng]));
      }
    }
  });


  return position === null ? null : (
    <Marker position={position} icon={defaultMarker}>
      <Popup>You are here</Popup>
    </Marker>
  );
};
export default UserMarker;