import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EarthquakeMap = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[23.6978, 120.9605]} // 台灣的中心
        zoom={9} // 初始縮放層級
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export default EarthquakeMap;
