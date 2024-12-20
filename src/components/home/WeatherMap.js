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

// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// const WeatherMap = () => {
//   const [zoomLevel, setZoomLevel] = useState(() =>
//     window.innerWidth < 768 ? 7 : 8.6
//   );
//   const [geojsonData, setGeojsonData] = useState(null);
//   const [cityCenters, setCityCenters] = useState(null);
//   const [weatherData, setWeatherData] = useState([]);

//   useEffect(() => {
//     const updateZoomLevel = () => {
//       setZoomLevel(window.innerWidth < 768 ? 7 : 8.6);
//     };

//     window.addEventListener("resize", updateZoomLevel);
//     return () => window.removeEventListener("resize", updateZoomLevel);
//   }, []);

//   useEffect(() => {
//     const fetchGeojsonData = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.PUBLIC_URL}/data/Taiwan.json`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch GeoJSON data");
//         }
//         const data = await response.json();
//         setGeojsonData(data);
//       } catch (error) {
//         console.error("Error loading GeoJSON data:", error);
//       }
//     };

//     const fetchCityCenters = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.PUBLIC_URL}/data/city_center.json`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch city center data");
//         }
//         const data = await response.json();
//         setCityCenters(data);
//       } catch (error) {
//         console.error("Error loading city center data:", error);
//       }
//     };

//     const fetchWeatherData = async () => {
//       try {
//         const response = await fetch(
//           "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-7E452C07-0B0D-41CF-9963-3BF25839B4A9&format=JSON"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch weather data");
//         }
//         const data = await response.json();
//         setWeatherData(data.records?.location || []);
//       } catch (error) {
//         console.error("Error loading weather data:", error);
//       }
//     };

//     fetchGeojsonData();
//     fetchCityCenters();
//     fetchWeatherData();
//   }, []);

//   const getWxValue = (cityName) => {
//     const cityWeather = weatherData.find(
//       (location) => location.locationName === cityName
//     );
//     if (!cityWeather) return null;

//     const wxElement = cityWeather.weatherElement.find(
//       (el) => el.elementName === "Wx"
//     );
//     return wxElement?.time[0]?.parameter?.parameterValue || null;
//   };

//   const createIcon = (wxValue) => {
//     const iconUrl = `${process.env.PUBLIC_URL}/icons/${wxValue}.svg`;
//     return L.icon({
//       iconUrl,
//       iconSize: [50, 50],
//       iconAnchor: [25, 25],
//     });
//   };

//   const defaultCenter = [23.6978, 120.9605];

//   return (
//     <div className="map-container">
//       <MapContainer
//         center={defaultCenter}
//         zoom={zoomLevel}
//         zoomSnap={0.2}
//         zoomDelta={0.2}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />

//         {geojsonData && <GeoJSON data={geojsonData} />}

//         {cityCenters &&
//           Object.entries(cityCenters).map(([city, coords]) => {
//             const wxValue = getWxValue(city);
//             if (wxValue) {
//               return (
//                 <Marker
//                   key={city}
//                   position={[coords[1], coords[0]]}
//                   icon={createIcon(wxValue)}
//                 />
//               );
//             }
//             return null;
//           })}
//       </MapContainer>
//     </div>
//   );
// };

// export default WeatherMap;
