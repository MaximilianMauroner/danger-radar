import React, { useState } from "react";
import { Marker as MarkerPoint } from ".prisma/client";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import { trpc } from "../../utils/trpc";
import { LatLng } from "leaflet";
import { dangerMarker } from "../icons/map_icons";

const DangerMarker = () => {
  const [pointers, setPointers] = useState<MarkerPoint[]>([]);
  const passMap = useMap();

  const { refetch } = trpc.marker.getAll.useQuery(undefined, {
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
  return (
    <>
      {passMap && pointers.map((pointer: MarkerPoint) => (
        <Marker key={(pointer.lat + pointer.lng) * Math.random()} position={new LatLng(pointer.lat, pointer.lng)}
                icon={dangerMarker}></Marker>
      ))}
    </>
  );
};
export default DangerMarker;