import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const EarthquakeMap = ({ latestEarthquake }) => {
  const [zoomLevel, setZoomLevel] = useState(
    () => (window.innerWidth < 768 ? 7 : 8.6) // 根據螢幕寬度動態設置地圖縮放層級
  );

  const [popupPosition, setPopupPosition] = useState(null); // 用於記錄 Popup 位置

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
    const lat = parseFloat(latestEarthquake.latitude);
    const lng = parseFloat(latestEarthquake.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      circleCenter = [lat, lng]; // 圓心座標
    }
  }

  // 自定義圖標樣式，使用一個小紅點
  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="width: 5px; height: 5px; background-color: red; border-radius: 50%;"></div>`,
    iconSize: [5, 5], // 圖標尺寸
    iconAnchor: [2.5, 2.5], // 圖標的錨點 (中心對齊)
  });

  return (
    <div className="map-container">
      <MapContainer
        center={[23.6978, 120.9605]}
        zoom={zoomLevel}
        zoomSnap={0.2}
        zoomDelta={0.2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {circleCenter && (
          <>
            {/* 圓形標註，加入點擊事件 */}
            <Circle
              center={circleCenter} // 圓心座標
              radius={5000} // 圓半徑（單位：公尺）
              color="red" // 圓邊框顏色
              fillColor="red" // 圓填充顏色
              fillOpacity={0.4} // 圓填充透明度
              weight={2} // 邊框粗細
              opacity={0.4} // 邊框透明度
              eventHandlers={{
                click: () => setPopupPosition(circleCenter), // 設置 Popup 的位置為圓心
              }}
            />

            {/* Marker 標註 */}
            <Marker
              position={circleCenter}
              icon={customIcon}
              opacity={0.4} // 點透明度
            >
              <Popup>
                <div>
                  <p>
                    <b>地震資訊</b>
                  </p>
                  <p>經度：{circleCenter[1]}</p>
                  <p>緯度：{circleCenter[0]}</p>
                </div>
              </Popup>
            </Marker>

            {/* 點擊圓形後顯示的 Popup */}
            {popupPosition && (
              <Popup
                position={popupPosition}
                onClose={() => setPopupPosition(null)}
              >
                <div>
                  <p>
                    <b>地震資訊</b>
                  </p>
                  <p>經度：{circleCenter[1]}</p>
                  <p>緯度：{circleCenter[0]}</p>
                </div>
              </Popup>
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default EarthquakeMap;
