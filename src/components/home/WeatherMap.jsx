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
import { Helmet } from "react-helmet-async";

const WeatherMap = ({ weatherDataByCity, selectedCity, townWeatherData }) => {
  const [zoomLevel, setZoomLevel] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [cityCenters, setCityCenters] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [transitionCity, setTransitionCity] = useState("Taiwan");
  const defaultCenter = [23.6978, 120.9605];

  // 設定每個縣市的縮放級別
  const cityZoomLevels = {
    Taiwan: { desktop: 8.6, mobile: 7 },
    基隆市: { desktop: 12.5, mobile: 12.5 },
    臺北市: { desktop: 12.4, mobile: 11.7 },
    新北市: { desktop: 11.1, mobile: 11 },
    桃園市: { desktop: 11.8, mobile: 10.9 },
    新竹縣: { desktop: 12, mobile: 10.9 },
    新竹市: { desktop: 12.5, mobile: 12.4 },
    苗栗縣: { desktop: 11.6, mobile: 10.5 },
    臺中市: { desktop: 11.7, mobile: 10.6 },
    彰化縣: { desktop: 11.6, mobile: 10.8 },
    南投縣: { desktop: 11.1, mobile: 10.1 },
    雲林縣: { desktop: 11.5, mobile: 10.4 },
    嘉義縣: { desktop: 11.4, mobile: 10.2 },
    嘉義市: { desktop: 12.5, mobile: 12.3 },
    臺南市: { desktop: 11.3, mobile: 10.4 },
    高雄市: { desktop: 11.2, mobile: 10.8 },
    屏東縣: { desktop: 11.2, mobile: 10.2 },
    宜蘭縣: { desktop: 11.5, mobile: 10.6 },
    花蓮縣: { desktop: 10.6, mobile: 10 },
    臺東縣: { desktop: 10.4, mobile: 10 },
    澎湖縣: { desktop: 11.4, mobile: 10.2 },
    金門縣: { desktop: 12.1, mobile: 11 },
    連江縣: { desktop: 11.6, mobile: 10.4 },
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
        const response = await fetch("/data/Taiwan.json");
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
        const response = await fetch("/data/city_center.json");
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

  // 鄉鎮使用的 Icon
  const createTownIcon = (weatherCode) => {
    const iconSize = isMobile ? 30 : 50;
    const iconAnchor = iconSize / 2;
    const iconUrl = getIconPath(weatherCode);

    return L.divIcon({
      html: `
        <div style="position: relative;  width: ${iconSize}px; height: ${iconSize}px;">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${iconSize}px;;
            height: ${iconSize}px;;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background-color:rgb(0, 0, 0, 0.6);
            // border: 1px solid rgb(255, 0, 0, 0.8);
          "></div>
  
          <img
            src="${iconUrl}"
            alt="Weather Icon"
            style="
              position: absolute;
              top: 50%; 
              left: 50%;
              transform: translate(-50%, -50%);
              width:  ${iconSize - 6}px;
              height:  ${iconSize - 6}px;
            "
          />
        </div>
      `,
      className: "",
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconAnchor, iconAnchor],

      // 如果背景刪掉需要此行
      // iconUrl,
      // iconSize: isMobile ? [30, 30] : [50, 50],
      // iconAnchor: isMobile ? [15, 15] : [25, 25],
    });
  };

  useEffect(() => {
    setTransitionCity(selectedCity);
  }, [selectedCity]);

  const isNightTime = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 18 || hours < 6;
  };

  const getIconPath = (weatherCode) => {
    const baseIconPath = `/icons/${weatherCode}.svg`;
    const nightIconPath = `/icons/${weatherCode}(1).svg`;

    if (isNightTime()) {
      const img = new Image();
      img.src = nightIconPath;
      if (img.complete || img.naturalWidth !== 0) {
        return nightIconPath;
      }
    }
    return baseIconPath;
  };

  const createIcon = (wxValue) => {
    const iconSize = isMobile ? 30 : 50;
    const iconAnchor = iconSize / 2;
    const iconUrl = getIconPath(wxValue);
    return L.divIcon({
      html: `
        <div style="position: relative;  width: ${iconSize}px; height: ${iconSize}px;">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${iconSize}px;;
            height: ${iconSize}px;;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background-color:rgb(0, 0, 0, 0.6);
            // border: 1px solid rgb(255, 0, 0, 0.8);
          "></div>
  
          <img
            src="${iconUrl}"
            alt="Weather Icon"
            style="
              position: absolute;
              top: 50%; 
              left: 50%;
              transform: translate(-50%, -50%);
              width:  ${iconSize - 6}px;
              height:  ${iconSize - 6}px;
            "
          />
        </div>
      `,
      className: "",
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconAnchor, iconAnchor],

      // 如果背景刪掉需要此行
      // iconUrl,
      // iconSize: isMobile ? [30, 30] : [50, 50],
      // iconAnchor: isMobile ? [15, 15] : [25, 25],
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
      <Helmet>
        <title>各縣市鄉鎮天氣預報</title>
        <link rel="icon" href="/images/partly_sunny_rain.png" />
      </Helmet>

      <MapContainer
        center={defaultCenter}
        zoom={zoomLevel}
        zoomSnap={0.1}
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
                  color: "blue",
                  weight: 2,
                  opacity: 0.1,
                  fillColor: "#66ccff",
                  fillOpacity: 0,
                };
              } else {
                const isSelected = cityName === transitionCity;
                return {
                  color: isSelected ? "#6C6C6C" : "#4f4f4f",
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

        {selectedCity !== "Taiwan" &&
          cityCenters &&
          cityCenters[selectedCity]?.towns &&
          townWeatherData &&
          townWeatherData.map(({ townName, weatherCode }) => {
            const coords = cityCenters[selectedCity].towns[townName];
            if (!coords) return null;

            return (
              <Marker
                key={townName}
                position={[coords[1], coords[0]]}
                icon={createTownIcon(weatherCode)}
              />
            );
          })}

        <UpdateMapView city={transitionCity} />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
