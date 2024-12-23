import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WeatherMap = ({ weatherDataByCity, selectedCity }) => {
  const [zoomLevel, setZoomLevel] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [cityCenters, setCityCenters] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [transitionCity, setTransitionCity] = useState("Taiwan");
  const defaultCenter = [23.6978, 120.9605];

  // 修改 cityZoomLevels，為每個縣市定義桌面和手機的縮放級別
  const cityZoomLevels = {
    Taiwan: { desktop: 8.6, mobile: 7.4 },
    基隆市: { desktop: 12, mobile: 10 },
    臺北市: { desktop: 12, mobile: 10 },
    新北市: { desktop: 12, mobile: 10 },
    桃園市: { desktop: 12, mobile: 10 },
    新竹縣: { desktop: 12, mobile: 10 },
    新竹市: { desktop: 12, mobile: 10 },
    苗栗縣: { desktop: 12, mobile: 10 },
    臺中市: { desktop: 12, mobile: 10 },
    彰化縣: { desktop: 12, mobile: 10 },
    南投縣: { desktop: 12, mobile: 10 },
    雲林縣: { desktop: 12, mobile: 10 },
    嘉義縣: { desktop: 12, mobile: 10 },
    嘉義市: { desktop: 12, mobile: 10 },
    臺南市: { desktop: 12, mobile: 10 },
    高雄市: { desktop: 12, mobile: 10 },
    屏東縣: { desktop: 12, mobile: 10 },
    宜蘭縣: { desktop: 12, mobile: 10 },
    花蓮縣: { desktop: 12, mobile: 10 },
    臺東縣: { desktop: 12, mobile: 10 },
    澎湖縣: { desktop: 12, mobile: 10 },
    金門縣: { desktop: 12, mobile: 10 },
    連江縣: { desktop: 12, mobile: 10 },
  };

  useEffect(() => {
    // 設定初始縮放層級
    const updateZoomLevel = () => {
      const isMobileView = window.innerWidth < 768;
      setZoomLevel(isMobileView ? 7.4 : 8.6);
      setIsMobile(isMobileView);
    };

    updateZoomLevel();
    window.addEventListener("resize", updateZoomLevel);
    return () => window.removeEventListener("resize", updateZoomLevel);
  }, []);

  useEffect(() => {
    // 取得台灣行政區域的 GeoJSON
    const fetchGeojsonData = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/data/Taiwan.json`
        );
        if (!response.ok) throw new Error("Failed to fetch GeoJSON data");
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    };

    // 取得各縣市的中心點座標
    const fetchCityCenters = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/data/city_center.json`
        );
        if (!response.ok) throw new Error("Failed to fetch city center data");
        const data = await response.json();
        setCityCenters(data);
      } catch (error) {
        console.error("Error loading city center data:", error);
      }
    };

    fetchGeojsonData();
    fetchCityCenters();
  }, []);

  useEffect(() => {
    // 在切換 selectedCity 時，先短暫回到 "Taiwan" 以產生轉場效果，再切換到目標城市
    if (selectedCity === transitionCity) return;

    setTransitionCity("Taiwan");
    const timeout = setTimeout(() => {
      setTransitionCity(selectedCity);
    }, 500);
    return () => clearTimeout(timeout);
  }, [selectedCity]);

  /**
   * 根據天氣狀況 wxValue 產生對應的 Icon
   * @param {string} wxValue - 天氣代碼，例如晴、多雲、陰雨...
   */
  const createIcon = (wxValue) => {
    const iconUrl = `${process.env.PUBLIC_URL}/icons/${wxValue}.svg`;
    return L.icon({
      iconUrl,
      iconSize: isMobile ? [30, 30] : [50, 50],
      iconAnchor: isMobile ? [15, 15] : [25, 25],
    });
  };

  /**
   * 動態更新地圖視角的子元件
   * @param {string} city - 要切換的城市名稱
   * @returns {null} - 不回傳任何 UI，僅執行 side effect
   */
  const UpdateMapView = ({ city }) => {
    const map = useMap();
    useEffect(() => {
      // 選擇適當的縮放級別
      const zoom = isMobile
        ? cityZoomLevels[city]?.mobile || zoomLevel
        : cityZoomLevels[city]?.desktop || zoomLevel;
      if (city === "Taiwan") {
        // 顯示整個台灣
        map.setView(defaultCenter, zoom);
      } else if (city && cityCenters && cityCenters[city]) {
        // 顯示目標縣市
        const [lng, lat] = cityCenters[city];
        map.setView([lat, lng], zoom);
      }
    }, [city, cityCenters, map, isMobile, zoomLevel]);
    return null;
  };

  if (zoomLevel === null) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={zoomLevel}
        zoomSnap={0.2}
        zoomDelta={0.2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/**
         * 這裡的 style 屬性可以根據 feature.properties 來套用不同的樣式
         * 假設 GeoJSON 每個多邊形都有一個屬性 feature.properties.COUNTYNAME
         * 和我們的 transitionCity(或 selectedCity) 做比對。
         */}
        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            /**
             * 依照是否為選取城市，改變顏色：
             * - 如果 transitionCity === "Taiwan"，代表尚未切換到個別城市，維持原本顏色。
             * - 如果 feature.properties.COUNTYNAME === transitionCity，保持原本亮色。
             * - 其他縣市使用深色覆蓋。
             */
            style={(feature) => {
              // 取得該區域的縣市名稱
              const cityName = feature.properties.county;

              // 如果目前是顯示整個台灣，使用一般樣式
              if (transitionCity === "Taiwan") {
                return {
                  color: "#3388ff",
                  weight: 2,
                  opacity: 0.6,
                  fillColor: "#66ccff",
                  fillOpacity: 0.2,
                };
              } else {
                // 如果是選到的縣市就顯示亮色，否則覆蓋深色
                const isSelected = cityName === transitionCity;
                return {
                  color: isSelected ? "#3388ff" : "#4f4f4f", // 外框顏色
                  weight: 2, // 外框粗細
                  opacity: isSelected ? 0.6 : 0.9, // 外框透明度
                  fillColor: isSelected ? "#66ccff" : "#2c3e50", // 內部填色
                  fillOpacity: isSelected ? 0.2 : 0.7, // 內部透明度
                };
              }
            }}
          />
        )}

        {/**
         * 在地圖上放上各個城市的天氣圖示
         */}
        {cityCenters &&
          Object.entries(cityCenters).map(([city, coords]) => {
            const cityWeather = weatherDataByCity.find(
              (data) => data.city === city
            );
            if (!cityWeather) return null;

            return (
              <Marker
                key={city}
                position={[coords[1], coords[0]]}
                icon={createIcon(cityWeather.wxValue)}
              />
            );
          })}

        {/* 動態更新地圖視野到選取的城市 */}
        <UpdateMapView city={transitionCity} />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
