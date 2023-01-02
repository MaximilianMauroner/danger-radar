import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import React, { useEffect, useState } from "react";
import { control, LatLng } from "leaflet";
import { defaultMarker } from "../icons/map_icons";
import { MapPinIcon } from "@heroicons/react/24/solid";
import L from "leaflet";
import { mockSession } from "next-auth/client/__tests__/helpers/mocks";
import user = mockSession.user;

require("leaflet-routing-machine");


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
          setPosition(e.latlng);
          if (localStorage.getItem("userLocation")) {
            return;
          }
          map.flyTo(e.latlng, map.getZoom());
          localStorage.setItem("userLocation", JSON.stringify([e.latlng.lat, e.latlng.lng]));
        }
      }
    });

    return position === null ? null : (
      <>
        <Marker position={position} icon={defaultMarker}>
          <Popup>You are here</Popup>
        </Marker>
        <button className={"move-to-location bg-gray-900 rounded-full p-2 absolute top-1 right-1 a z-[1000]"}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  map.flyTo(position, map.getZoom());
                }}>
          <MapPinIcon className={"w-10 h-10 text-white"} />
        </button>
      </>
    );
  }
;
export default UserMarker;