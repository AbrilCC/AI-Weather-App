import { useEffect } from "react";
/*
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";*/
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f172a" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c1a2e" }] },
    { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
    { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#334155" }] }
];

export default function WeatherMap({ coordinates, location_name }) {

  const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!coordinates || coordinates.lat === undefined || coordinates.lon === undefined) return null;
  if (!isLoaded) return <p>Loading map...</p>;

  const position = { lat: coordinates.lat, lng: coordinates.lon };

  return (
    <GoogleMap
      center={position}
      zoom={11}
      mapContainerStyle={{ height: "500px", width: "100%", borderRadius: "32px" }}
        options={{
            styles: darkMapStyle,
            disableDefaultUI: false,
            zoomControl: true
        }}>
      
      <Marker position={position} />
    
    </GoogleMap>
  );
}