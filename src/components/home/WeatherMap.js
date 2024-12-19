import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import taiwanGeojson from "./data/Taiwan.json";

const WeatherMap = () => {
  const [zoomLevel, setZoomLevel] = useState(() =>
    window.innerWidth < 768 ? 7 : 8.6
  );

  useEffect(() => {
    const updateZoomLevel = () => {
      setZoomLevel(window.innerWidth < 768 ? 7 : 8.6);
    };

    window.addEventListener("resize", updateZoomLevel);
    return () => window.removeEventListener("resize", updateZoomLevel);
  }, []);

  const defaultCenter = [23.6978, 120.9605];

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter} // 地圖中心
        zoom={zoomLevel} // 地圖縮放層級
        zoomSnap={0.2} // 調整地圖縮放靈敏度
        zoomDelta={0.2}
        style={{ height: "100%", width: "100%" }} // 地圖樣式
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <GeoJSON data={taiwanGeojson} />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
