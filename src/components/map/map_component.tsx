import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import UserMarker from "./user_marker";
import ShowMarkers from "./show_markers";


function Map() {
  const userLocation = JSON.parse(localStorage.getItem("userLocation") || "[51.505, -0.09]");
  const userZoom = JSON.parse(localStorage.getItem("userZoom") || "17");
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
        <ShowMarkers />
      </MapContainer>
    </>
  );
}

export default Map;
