import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Circle,
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

  // 設定每個縣市的縮放級別
  const cityZoomLevels = {
    Taiwan: { desktop: 8.6, mobile: 7 },
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
    // 更新縮放層級
    const updateZoomLevel = () => {
      const isMobileView = window.innerWidth < 768;
      setZoomLevel(isMobileView ? 7 : 8.6);
      setIsMobile(isMobileView);
    };

    updateZoomLevel();
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
        if (!response.ok) throw new Error("Failed to fetch GeoJSON data");
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
      }
    };

    // 載入城市中心點座標資料
    const fetchCityCenters = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/data/city_center.json`
        );
        if (!response.ok) throw new Error("Failed to fetch city data");
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
    // 更新切換城市的轉場效果
    if (selectedCity === transitionCity) return;

    setTransitionCity("Taiwan");
    const timeout = setTimeout(() => {
      setTransitionCity(selectedCity);
    }, 400);
    return () => clearTimeout(timeout);
  }, [selectedCity]);

  const createIcon = (wxValue) => {
    const iconUrl = `${process.env.PUBLIC_URL}/icons/${wxValue}.svg`;
    return L.icon({
      iconUrl,
      iconSize: isMobile ? [30, 30] : [50, 50],
      iconAnchor: isMobile ? [15, 15] : [25, 25],
    });
  };

  const UpdateMapView = ({ city }) => {
    const map = useMap();
    useEffect(() => {
      const zoom = isMobile
        ? cityZoomLevels[city]?.mobile || zoomLevel
        : cityZoomLevels[city]?.desktop || zoomLevel;
      if (city === "Taiwan") {
        map.setView(defaultCenter, zoom);
      } else if (city && cityCenters && cityCenters[city]?.center) {
        const [lng, lat] = cityCenters[city].center;
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

        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            style={(feature) => {
              const cityName = feature.properties.county;
              if (transitionCity === "Taiwan") {
                return {
                  color: "#3388ff",
                  weight: 2,
                  opacity: 0.6,
                  fillColor: "#66ccff",
                  fillOpacity: 0,
                };
              } else {
                const isSelected = cityName === transitionCity;
                return {
                  color: isSelected ? "#3388ff" : "#4f4f4f",
                  weight: 2,
                  opacity: isSelected ? 0.6 : 0.9,
                  fillColor: isSelected ? "#66ccff" : "#2c3e50",
                  fillOpacity: isSelected ? 0.2 : 0.7,
                };
              }
            }}
          />
        )}

        {/* 在預設台灣時顯示 SVG 圖片 */}
        {selectedCity === "Taiwan" &&
          cityCenters &&
          Object.entries(cityCenters).map(([city, coords]) => {
            const cityWeather = weatherDataByCity.find(
              (data) => data.city === city
            );
            if (!cityWeather) return null;

            return (
              <Marker
                key={city}
                position={[coords.center[1], coords.center[0]]}
                icon={createIcon(cityWeather.wxValue)}
              />
            );
          })}

        {/* 在選中的縣市顯示鄉鎮圈 */}
        {selectedCity !== "Taiwan" &&
          cityCenters &&
          cityCenters[selectedCity]?.towns &&
          Object.entries(cityCenters[selectedCity].towns).map(
            ([townName, coords]) => (
              <Circle
                key={townName}
                center={[coords[1], coords[0]]}
                radius={500}
                pathOptions={{
                  color: "#ff7800",
                  fillColor: "#ff9100",
                  fillOpacity: 0.5,
                }}
              />
            )
          )}

        <UpdateMapView city={transitionCity} />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
