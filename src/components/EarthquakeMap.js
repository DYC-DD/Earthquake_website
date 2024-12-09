import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const EarthquakeMap = ({ latestEarthquake }) => {
  const [zoomLevel, setZoomLevel] = useState(() =>
    window.innerWidth < 768 ? 7 : 8.6
  );
  const [popupPosition, setPopupPosition] = useState(null);

  useEffect(() => {
    const updateZoomLevel = () => {
      setZoomLevel(window.innerWidth < 768 ? 7 : 8.6);
    };

    window.addEventListener("resize", updateZoomLevel);
    return () => window.removeEventListener("resize", updateZoomLevel);
  }, []);

  // 如果有最新地震的座標，將它轉成數字並放在 circleCenter
  let circleCenter = null;
  let magnitude = null;

  if (
    latestEarthquake &&
    latestEarthquake.latitude &&
    latestEarthquake.longitude
  ) {
    const lat = parseFloat(latestEarthquake.latitude);
    const lng = parseFloat(latestEarthquake.longitude);
    magnitude = parseFloat(latestEarthquake.magnitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      circleCenter = [lat, lng]; // 圓心座標
    }
  }

  //  根據地震規模取得半徑
  //  若遇到非整數的 magnitude，採用區間線性插值法。
  //  M2.0 => 半徑1公里 (1000m)
  //  M3.0 => 半徑10公里 (10000m)
  //  M4.0 => 半徑30公里 (30000m)
  //  M5.0 => 半徑100公里 (100000m)
  //  M6.0 => 半徑300公里 (300000m)
  //  M7.0 => 半徑1000公里 (1000000m)
  //  M8.0 => 半徑3000公里 (3000000m)

  const getRadiusFromMagnitude = (m) => {
    // 若無數值，回傳 0
    if (isNaN(m)) return 0;

    // 定義已知數值對： [震度, 半徑(公尺)]
    const pairs = [
      [2.0, 1000],
      [3.0, 10000],
      [4.0, 30000],
      [5.0, 100000],
      [6.0, 300000],
      [7.0, 1000000],
      [8.0, 3000000],
    ];

    // 若小於2.0則視為2.0的值
    if (m <= 2.0) return pairs[0][1];
    // 若大於8.0則視為8.0的值
    if (m >= 8.0) return pairs[pairs.length - 1][1];

    // 線性插值計算
    for (let i = 0; i < pairs.length - 1; i++) {
      const [x1, y1] = pairs[i];
      const [x2, y2] = pairs[i + 1];

      if (m >= x1 && m <= x2) {
        const ratio = (m - x1) / (x2 - x1);
        const interpolatedRadius = y1 + ratio * (y2 - y1);
        return interpolatedRadius;
      }
    }

    return 0;
  };

  // 計算要顯示的圓形半徑
  const radius = magnitude ? getRadiusFromMagnitude(magnitude) : 0;

  // 自定義圖標樣式，使用一個小紅點
  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="width: 5px; height: 5px; background-color: red; border-radius: 50%;"></div>`,
    iconSize: [5, 5],
    iconAnchor: [2.5, 2.5],
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
            <Circle
              center={circleCenter}
              radius={radius}
              color="red" // 圓邊框顏色
              fillColor="red" // 圓填充顏色
              fillOpacity={0.3} // 圓填充透明度
              weight={2} // 邊框粗細
              opacity={0.2} // 邊框透明度
              eventHandlers={{
                click: () => setPopupPosition(circleCenter),
              }}
            />

            <Marker position={circleCenter} icon={customIcon} opacity={0.4}>
              <Popup>
                <div>
                  <p>
                    <b>地震資訊</b>
                  </p>
                  <p>經度：{circleCenter[1]}</p>
                  <p>緯度：{circleCenter[0]}</p>
                  <p>規模：{magnitude || "未知"}</p>
                  <p>顯示半徑：約 {radius / 1000} 公里</p>
                </div>
              </Popup>
            </Marker>

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
                  <p>規模：{magnitude || "未知"}</p>
                  <p>影響範圍半徑：約 {Math.round(radius / 1000)} 公里</p>
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
