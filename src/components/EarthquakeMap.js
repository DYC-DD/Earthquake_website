import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EarthquakeMap = () => {
  const [zoomLevel, setZoomLevel] = useState(
    () => (window.innerWidth < 768 ? 7 : 8.6) // 如果螢幕寬度小於 768px，使用縮放層級 7，否則使用 8.2
  );

  useEffect(() => {
    const updateZoomLevel = () => {
      setZoomLevel(window.innerWidth < 768 ? 7 : 8.6);
    };

    window.addEventListener("resize", updateZoomLevel);

    // 確保在組件卸載時移除事件監聽器
    return () => window.removeEventListener("resize", updateZoomLevel);
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[23.6978, 120.9605]} // 台灣的中心
        zoom={zoomLevel} // 根據狀態設置動態縮放層級
        zoomSnap={0.2} // 縮放層級可以精確到 0.2
        zoomDelta={0.2} // 縮放操作時每次增量 0.2
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
