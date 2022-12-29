import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DangerMarker from "./danger_marker";
import UserMarker from "./user_marker";


function Map() {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={17} scrollWheelZoom={true} style={{ height: "100vh", width: "100%" }}>
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <UserMarker />
      <DangerMarker />
    </MapContainer>
  );
}

export default Map;
