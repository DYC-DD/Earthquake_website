import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WeatherMap = ({ weatherDataByCity }) => {
  const [zoomLevel, setZoomLevel] = useState(() =>
    window.innerWidth < 768 ? 7 : 8.6
  );
  const [geojsonData, setGeojsonData] = useState(null);
  const [cityCenters, setCityCenters] = useState(null);

  useEffect(() => {
    // 調整地圖縮放層級
    const updateZoomLevel = () => {
      setZoomLevel(window.innerWidth < 768 ? 7 : 8.6);
    };

    window.addEventListener("resize", updateZoomLevel);
    return () => window.removeEventListener("resize", updateZoomLevel);
  }, []);

  useEffect(() => {
    // 載入 GeoJSON 資料
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

    // 載入縣市中心座標
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

  // 創建 Leaflet 圖示
  const createIcon = (wxValue) => {
    const iconUrl = `${process.env.PUBLIC_URL}/icons/${wxValue}.svg`;
    return L.icon({
      iconUrl, // 天氣圖示 URL
      iconSize: [50, 50], // 圖示大小
      iconAnchor: [25, 25], // 圖示錨點
    });
  };

  const defaultCenter = [23.6978, 120.9605];

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter} // 地圖中心點
        zoom={zoomLevel} // 地圖縮放層級
        zoomSnap={0.2} // 縮放靈敏度
        zoomDelta={0.2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {geojsonData && <GeoJSON data={geojsonData} />}

        {cityCenters &&
          Object.entries(cityCenters).map(([city, coords]) => {
            const cityWeather = weatherDataByCity.find(
              (data) => data.city === city
            );
            if (!cityWeather) return null; // 如果找不到對應的天氣資料，跳過該城市

            return (
              <Marker
                key={city}
                position={[coords[1], coords[0]]}
                icon={createIcon(cityWeather.wxValue)}
              />
            );
          })}
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
