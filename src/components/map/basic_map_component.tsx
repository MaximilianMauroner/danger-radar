import { MapContainer, Circle, Marker, Popup, TileLayer, useMapEvents, MapContainerProps } from "react-leaflet";
import React, { useState, useEffect, RefAttributes } from "react";
import { Icon, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { trpc } from "../../utils/trpc";
import { Marker as MarkerPoint } from "@prisma/client";

const defaultMarker = new Icon({
  iconUrl: "marker.svg",
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [0, -41]
});

function Map() {
  const [leaflet, setLeaflet] = useState<any>(null);
  useEffect(() => {
    if (leaflet) {
      // setInterval(function() {
      //   leaflet.invalidateSize();
      // }, 100);
    }
  }, [leaflet]);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={17} scrollWheelZoom={true}
                  style={{ height: "100vh", width: "100%" }} whenReady={(e: any) => setLeaflet(e.target)}>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ShowPersonalMarker passMap={leaflet} />
      <DisplayDangerMarkers passMap={leaflet} />
    </MapContainer>
  );
}

export default Map;
const ShowPersonalMarker = ({ passMap }: { passMap: any }) => {
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
    <Marker position={position} icon={defaultMarker}>
      <Popup>You are here</Popup>
    </Marker>
  );
};
const DisplayDangerMarkers = ({ passMap }: { passMap: any }) => {
  const [pointers, setPointers] = useState<MarkerPoint[]>([]);

  const { data, isLoading, refetch, isRefetching } = trpc.marker.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      setPointers(data);
    }
  });
  const makeMarker = trpc.marker.addMarker.useMutation();

  const t = useMapEvents({
    click(e: any) {
      makeMarker.mutate({ lat: e.latlng.lat, lng: e.latlng.lng }, {
        onSuccess: () => {
          refetch();
        }
      });
    },
    zoomlevelschange(e: any) {
      console.log(e);
    },
    dragend(e: any) {
      console.log(e.target);
    }
  });
  console.log(pointers);
  return (
    <>
      {passMap && pointers.map((pointer: MarkerPoint) => (
        <Marker key={(pointer.lat + pointer.lng) * Math.random()} position={new LatLng(pointer.lat, pointer.lng)}
                icon={defaultMarker}></Marker>
      ))}
    </>
  );
};