import { Icon } from "leaflet";

export const defaultMarker = new Icon({
  iconUrl: "marker.svg",
  iconSize: [30, 46],
  iconAnchor: [13, 41],
  popupAnchor: [0, -41]
});
export const dangerMarker = new Icon({
  iconUrl: "danger-marker.svg",
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [0, -41]
});

export const userMarker = new Icon({
  iconUrl: "user.svg",
  iconSize: [30, 46],
  iconAnchor: [13, 41],
  popupAnchor: [0, -41]
});
