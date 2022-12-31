import React, { useState } from "react";
import { Marker as MarkerPoint } from ".prisma/client";
import { Circle, Marker, useMap, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { trpc } from "../../utils/trpc";
import { LatLng } from "leaflet";

const maxOpacity = 0.8;

const DangerMarker = () => {
  const [pointers, setPointers] = useState<MarkerPoint[]>([]);
  const passMap = useMap();
  const [zoom, setZoom] = useState(passMap.getZoom());
  const { refetch } = trpc.marker.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      setPointers(data);
    }
  });
  const makeMarker = trpc.marker.addMarker.useMutation();
  console.log(zoom);
  const eventMap = useMapEvents({
    click(e) {
      if (zoom > 15) {
        makeMarker.mutate({ lat: e.latlng.lat, lng: e.latlng.lng, zoomLevel: zoom }, {
          onSuccess: () => {
            refetch();
          }
        });
      }
    },
    zoomend(e) {
      const zLevel = e.target.getZoom();
      setZoom(zLevel);
      localStorage.setItem("userZoom", zLevel);
    },
    dragend(e) {
      const center = e.target.getCenter();
      localStorage.setItem("userLocation", JSON.stringify([center.lat, center.lng]));
    }
  });
  return (
    <>
      {passMap && pointers.map((pointer: MarkerPoint) => (
        <>
          <Circle key={(pointer.lat + pointer.lng) * Math.random()} center={new LatLng(pointer.lat, pointer.lng)}
                  radius={Math.pow((19 - pointer.zoomLevel) + 2, 3)}
                  color={"darkred"}
                  opacity={1 / (19 - pointer.zoomLevel) * 0.5 <= maxOpacity ? 1 / (19 - pointer.zoomLevel) * 0.5 : maxOpacity}
                  fillOpacity={1 / (19 - pointer.zoomLevel) * 0.5 <= maxOpacity ? 1 / (19 - pointer.zoomLevel) * 0.5 : maxOpacity}
                  fill={true}></Circle>
        </>
      ))}
    </>
  );
};
export default DangerMarker;