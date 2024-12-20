import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const WeatherMap = () => {
  const [zoomLevel, setZoomLevel] = useState(() =>
    window.innerWidth < 768 ? 7 : 8.6
  );
  const [geojsonData, setGeojsonData] = useState(null);
  const [cityCenters, setCityCenters] = useState(null);

  useEffect(() => {
    // 設定視窗大小改變時的縮放層級調整
    const updateZoomLevel = () => {
      setZoomLevel(window.innerWidth < 768 ? 7 : 8.6);
    };

    window.addEventListener("resize", updateZoomLevel);
    return () => window.removeEventListener("resize", updateZoomLevel);
  }, []);

  useEffect(() => {
    // 動態載入 GeoJSON 資料
    const fetchGeojsonData = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/data/Taiwan.json`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch GeoJSON data");
        }
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    };

    // 載入城市中心座標
    const fetchCityCenters = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/data/city_center.json`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch city center data");
        }
        const data = await response.json();
        setCityCenters(data);
      } catch (error) {
        console.error("Error loading city center data:", error);
      }
    };

    fetchGeojsonData();
    fetchCityCenters();
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

        {geojsonData && <GeoJSON data={geojsonData} />}

        {/* 畫出每個縣市中心點的圈 */}
        {cityCenters &&
          Object.entries(cityCenters).map(([city, coords]) => (
            <Circle
              key={city}
              center={[coords[1], coords[0]]} // Leaflet 的座標格式是 [緯度, 經度]
              radius={1000} // 圈的半徑，單位為公尺
              color="red"
              fillOpacity={0.3}
            />
          ))}
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
