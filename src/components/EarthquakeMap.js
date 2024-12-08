// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const EarthquakeMap = () => {
//   const [zoomLevel, setZoomLevel] = useState(
//     () => (window.innerWidth < 768 ? 7 : 8.6) // 如果螢幕寬度小於 768px，使用縮放層級 7，否則使用 8.2
//   );

//   useEffect(() => {
//     const updateZoomLevel = () => {
//       setZoomLevel(window.innerWidth < 768 ? 7 : 8.6);
//     };

//     window.addEventListener("resize", updateZoomLevel);

//     // 確保在組件卸載時移除事件監聽器
//     return () => window.removeEventListener("resize", updateZoomLevel);
//   }, []);

//   return (
//     <div className="map-container">
//       <MapContainer
//         center={[23.6978, 120.9605]} // 台灣的中心
//         zoom={zoomLevel} // 根據狀態設置動態縮放層級
//         zoomSnap={0.2} // 縮放層級可以精確到 0.2
//         zoomDelta={0.2} // 縮放操作時每次增量 0.2
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//       </MapContainer>
//     </div>
//   );
// };

// export default EarthquakeMap;

// EarthquakeMap.js

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EarthquakeMap = ({ latestEarthquake }) => {
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

  // 如果有最新地震的座標，將它轉成數字並放在 circleCenter
  let circleCenter = null;
  if (
    latestEarthquake &&
    latestEarthquake.latitude &&
    latestEarthquake.longitude
  ) {
    // 將字串轉數字
    const lat = parseFloat(latestEarthquake.latitude);
    const lng = parseFloat(latestEarthquake.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      circleCenter = [lat, lng];
    }
  }

  return (
    <div className="map-container">
      <MapContainer
        center={[23.6978, 120.9605]}
        zoom={zoomLevel}
        zoomSnap={0.2}
        zoomDelta={0.2}
        style={{ height: "100%", width: "100%" }}
      >
        {/* 顯示底圖 */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 如果有最新地震經緯度資訊，畫出圓形標註 */}
        {circleCenter && (
          <Circle
            center={circleCenter}
            radius={5000} // 依據需要調整半徑，單位為公尺
            color="red"
            fillColor="red"
            fillOpacity={0.4}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default EarthquakeMap;
