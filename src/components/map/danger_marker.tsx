import React, { useState } from "react";
import { Marker as MarkerPoint } from ".prisma/client";
import { Circle, Marker, useMap, useMapEvents } from "react-leaflet";
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
        <Circle key={(pointer.lat + pointer.lng) * Math.random()} center={new LatLng(pointer.lat, pointer.lng)}
                radius={10}
                color={"darkred"}
                opacity={0.8}
                fillOpacity={0.25}
                fill={true}></Circle>
      ))}
    </>
  );
};
export default DangerMarker;