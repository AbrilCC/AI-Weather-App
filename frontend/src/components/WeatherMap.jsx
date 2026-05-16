import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function WeatherMap({ coordinates, locationName }) {
  if (!coordinates) return null;

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lon]}
      zoom={11}
      style={{
        height: "100%",
        width: "100%"
      }}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[coordinates.lat, coordinates.lon]}>

        <Popup>{locationName}</Popup>

      </Marker>

    </MapContainer>
  );
}