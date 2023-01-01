import React, { useState } from "react";
import { Marker as MarkerPoint, MarkerLevel, MarkerType } from ".prisma/client";
import { Circle, Popup, useMap, useMapEvents } from "react-leaflet";
import { trpc } from "../../utils/trpc";
import { latLng, LatLng } from "leaflet";
import CreateMarkerModal from "./create_marker_modal";

const maxOpacity = 0.8;

const ShowMarkers = () => {
  const [pointers, setPointers] = useState<MarkerPoint[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLatLng, setModalLatLng] = useState<LatLng>(latLng(0, 0));
  const passMap = useMap();
  const bounds = passMap.getBounds();
  const [zoom, setZoom] = useState(passMap.getZoom());
  const { refetch } = trpc.marker.getVisibleMarkers.useQuery({
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    west: bounds.getWest(),
    east: bounds.getEast(),
    zoomLevel: zoom
  }, {
    onSuccess: (data) => {
      setPointers(data);
    }
  });
  const eventMap = useMapEvents({
    click(e) {
      if (zoom >= 15) {
        openModal(e.latlng);
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
      refetch();
    }
  });
  const openModal = (latlng: LatLng) => {
    setModalLatLng(latlng);
    setIsModalOpen(true);
  };
  const getColour = (marker: MarkerPoint) => {
    if (marker.markerType === MarkerType.DANGER) {
      if (marker.level === MarkerLevel.LOW) {
        return "lightred";
      } else if (marker.level === MarkerLevel.MEDIUM) {
        return "red";
      } else {
        return "darkred";
      }
    } else {
      if (marker.level === MarkerLevel.LOW) {
        return "lightgreen";
      } else if (marker.level === MarkerLevel.MEDIUM) {
        return "green";
      } else {
        return "darkgreen";
      }
    }
  };
  return (
    <>
      <CreateMarkerModal key={modalLatLng.lat + " " + modalLatLng.lng} modalOpen={isModalOpen}
                         markerPosition={modalLatLng}
                         refetch={refetch}
                         closeModal={() => setIsModalOpen(false)} /> {passMap && pointers.map((pointer: MarkerPoint) => (
      <Circle key={(pointer.lat + pointer.lng) * Math.random()} center={new LatLng(pointer.lat, pointer.lng)}
              radius={Math.pow((19 - pointer.zoomLevel) + 2, 3)}
              color={getColour(pointer)}
              opacity={1 / (19 - pointer.zoomLevel) * 0.5 <= maxOpacity ? 1 / (19 - pointer.zoomLevel) * 0.5 : maxOpacity}
              fillOpacity={1 / (19 - pointer.zoomLevel) * 0.5 <= maxOpacity ? 1 / (19 - pointer.zoomLevel) * 0.5 : maxOpacity}
              fill={true}>
        {pointer.message && pointer.zoomLevel == passMap.getZoom() ? <Popup>{pointer.message}</Popup> : null}
      </Circle>
    ))}
    </>
  );
};
export default ShowMarkers;