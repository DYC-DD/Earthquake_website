// 引入 React 和 react-leaflet 中的地圖相關元件
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
// 引入 Leaflet 的 CSS 樣式，確保地圖樣式正確加載
import "leaflet/dist/leaflet.css";

const EarthquakeMap = () => {
  return (
    <div className="map-container">
      <MapContainer
        center={[23.6978, 120.9605]} // 台灣的中心
        zoom={8.2} // 初始縮放層級
        zoomSnap={0.2} // 縮放層級的對齊步長
        zoomDelta={0.2} // 滾輪或鍵盤縮放的步長
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
