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
    if (selectedCity === transitionCity) return;

    setTransitionCity("Taiwan");
    const timeout = setTimeout(() => {
      setTransitionCity(selectedCity);
    }, 500);
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
      // 選擇適當的縮放級別
      const zoom = isMobile
        ? cityZoomLevels[city]?.mobile || zoomLevel
        : cityZoomLevels[city]?.desktop || zoomLevel;
      if (city === "Taiwan") {
        map.setView(defaultCenter, zoom);
      } else if (city && cityCenters && cityCenters[city]) {
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

        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            style={(feature) => ({
              color: "#3388ff",
              weight: 2,
              opacity: 0.6,
              fillColor: "#66ccff",
              fillOpacity: 0.2,
            })}
          />
        )}

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

        <UpdateMapView city={transitionCity} />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
