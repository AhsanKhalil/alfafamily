"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PoolingMap({ onSelect }) {
  const [position, setPosition] = useState([24.8607, 67.0011]); // Karachi default

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        // Here you can call geocoding API to get address, for simplicity we'll use lat,lng
        const address = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
        setPosition([lat, lng]);
        onSelect([lat, lng], address);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      key={Date.now()} // ✅ forces remount to avoid "already initialized" error
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position}>
        <Popup>Click on map to select location</Popup>
      </Marker>
      <MapClickHandler />
    </MapContainer>
  );
}
