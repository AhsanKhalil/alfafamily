"use client";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Custom green pin marker
const pinIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// ✅ Component to handle map clicks and zoom movement
function LocationSelector({ onSelect }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ lat, lng });

      // ✅ Smoothly zoom in and center where clicked
      map.flyTo([lat, lng], 15, { duration: 1.5 });
    },
  });
  return null;
}

export default function PoolingMap({ onSelectLocation }) {
  const [position, setPosition] = useState([24.8607, 67.0011]); // Karachi default
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    // ✅ Prevent leaflet reinit errors
    return () => {
      const container = L.DomUtil.get("map");
      if (container) container._leaflet_id = null;
    };
  }, []);

  const handleSelect = async ({ lat, lng }) => {
    setMarker([lat, lng]);

    try {
      // ✅ Reverse geocode to readable area name
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      const address =
        data.address?.suburb ||
        data.address?.neighbourhood ||
        data.address?.town ||
        data.address?.city ||
        data.address?.county ||
        data.display_name ||
        `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

      onSelectLocation(address);
    } catch (err) {
      console.error("Error fetching address:", err);
      onSelectLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    }
  };

  return (
    <div className="h-80 w-full mb-4 rounded-lg overflow-hidden border-2 border-green-500">
      <MapContainer
        id="map"
        center={position}
        zoom={12}
        style={{ height: "100%", width: "100%", cursor: "grab" }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        doubleClickZoom={true}
        touchZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationSelector onSelect={handleSelect} />
        {marker && <Marker position={marker} icon={pinIcon}></Marker>}
      </MapContainer>
    </div>
  );
}
