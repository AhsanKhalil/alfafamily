"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Custom marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ lat, lng });
    },
  });
  return null;
}

export default function PoolingMap({ onSelectLocation }) {
  const [position, setPosition] = useState([24.8607, 67.0011]); // Default Karachi
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    // ✅ Cleanup to prevent "already initialized" error
    return () => {
      const container = L.DomUtil.get("map");
      if (container) container._leaflet_id = null;
    };
  }, []);

  const handleSelect = async ({ lat, lng }) => {
    setMarker([lat, lng]);

    try {
      // ✅ Reverse geocoding using OpenStreetMap
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      // ✅ Extract meaningful area name
      const address =
        data.address?.suburb ||
        data.address?.neighbourhood ||
        data.address?.town ||
        data.address?.city ||
        data.address?.county ||
        data.display_name ||
        `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

      // ✅ Return only area name to parent
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
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationSelector onSelect={handleSelect} />
        {marker && <Marker position={marker}></Marker>}
      </MapContainer>
    </div>
  );
}
