import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DangerMarker from "./danger_marker";
import UserMarker from "./user_marker";
import { LatLng, latLng } from "leaflet";
import CreateMarkerModal from "./create_marker_modal";
import { useState } from "react";


function Map() {
  const userLocation = JSON.parse(localStorage.getItem("userLocation") || "[51.505, -0.09]");
  const userZoom = JSON.parse(localStorage.getItem("userZoom") || "17");

;
  return (
    <>

      <MapContainer center={userLocation} zoom={userZoom} scrollWheelZoom={true} style={{
        position: "absolute",
        width: "100%",
        top: 0,
        bottom: 0,
        zIndex: 10
      }}>

        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UserMarker />
        <DangerMarker />
      </MapContainer>
    </>
  );
}

export default Map;
