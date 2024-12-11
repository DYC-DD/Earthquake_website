import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const EarthquakeMap = ({ recentEarthquakes }) => {
  // 根據螢幕寬度動態設置地圖縮放層級
  const [zoomLevel, setZoomLevel] = useState(() =>
    window.innerWidth < 768 ? 7 : 8.6
  );

  // 用於記錄 Popup 位置
  const [popupPosition, setPopupPosition] = useState(null);

  // 用於記錄當前被點擊的地震事件詳細資訊 (包含規模、位置、半徑等)
  const [selectedEq, setSelectedEq] = useState(null);

  useEffect(() => {
    const updateZoomLevel = () => {
      setZoomLevel(window.innerWidth < 768 ? 7 : 8.6);
    };

    window.addEventListener("resize", updateZoomLevel);
    return () => window.removeEventListener("resize", updateZoomLevel);
  }, []);

  // 自定義圖標樣式，使用一個小紅點
  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="width: 5px; height: 5px; background-color: black; border-radius: 50%;"></div>`,
    iconSize: [5, 5],
    iconAnchor: [2.5, 2.5],
  });

  //  若非整數則採用區間線性插值法計算對應半徑。
  //  根據地震規模取得半徑（公尺）
  //  M2.0 => 半徑1公里 (1000m)
  //  M3.0 => 半徑10公里 (10000m)
  //  M4.0 => 半徑30公里 (30000m)
  //  M5.0 => 半徑100公里 (100000m)
  //  M6.0 => 半徑300公里 (300000m)
  //  M7.0 => 半徑1000公里 (1000000m)
  //  M8.0 => 半徑3000公里 (3000000m)

  const getRadiusFromMagnitude = (m) => {
    if (isNaN(m)) return 0;
    const pairs = [
      [2.0, 1000],
      [3.0, 10000],
      [4.0, 30000],
      [5.0, 100000],
      [6.0, 300000],
      [7.0, 1000000],
      [8.0, 3000000],
    ];

    if (m <= 2.0) return pairs[0][1];
    if (m >= 8.0) return pairs[pairs.length - 1][1];

    for (let i = 0; i < pairs.length - 1; i++) {
      const [x1, y1] = pairs[i];
      const [x2, y2] = pairs[i + 1];

      if (m >= x1 && m <= x2) {
        const ratio = (m - x1) / (x2 - x1);
        return y1 + ratio * (y2 - y1);
      }
    }
    return 0;
  };

  // 若無地震資料，預設中心為台灣經緯度
  const defaultCenter = [23.6978, 120.9605];

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

        {recentEarthquakes &&
          recentEarthquakes.map((eq, index) => {
            const lat = parseFloat(eq.latitude);
            const lng = parseFloat(eq.longitude);
            const magnitude = parseFloat(eq.magnitude);
            const originTime = eq.originTime || "無資料";
            const earthquakeNo = eq.earthquakeNo || "無資料";
            const webLink = eq.webLink || "無"; // 新增的網頁連結欄位

            if (isNaN(lat) || isNaN(lng)) return null;

            const circleCenter = [lat, lng];
            const radius = getRadiusFromMagnitude(magnitude);

            // 新增邏輯：根據 eq.source 判斷顏色 url1 => 綠色 url2 => 紅色
            const circleColor = eq.source === "url1" ? "green" : "red";

            return (
              <React.Fragment key={index}>
                <Circle
                  center={circleCenter}
                  radius={radius}
                  color={circleColor} // 圓邊框顏色
                  fillColor={circleColor} // 圓填充顏色
                  fillOpacity={0.1} // 圓填充透明度
                  weight={2} // 邊框粗細
                  opacity={0.1} // 邊框透明度
                  eventHandlers={{
                    // 點擊圓形後，設定選中地震資訊及 Popup 位置
                    click: () => {
                      setPopupPosition(circleCenter);
                      setSelectedEq({
                        latitude: lat,
                        longitude: lng,
                        magnitude,
                        originTime,
                        earthquakeNo,
                        radius,
                        webLink,
                      });
                    },
                  }}
                />

                <Marker position={circleCenter} icon={customIcon} opacity={0.2}>
                  <Popup>
                    <div>
                      <p>
                        <b>地震資訊</b>
                      </p>
                      <p>地震編號：{earthquakeNo}</p>
                      <p>地震發生時間：{originTime}</p>
                      <p>規模：{magnitude}</p>
                      <p>
                        經度：{circleCenter[1]} / 緯度：{circleCenter[0]}
                      </p>
                      <p>影響範圍半徑：約 {Math.round(radius / 1000)} 公里</p>
                      <a
                        href={webLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        點此查看詳細報告
                      </a>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {popupPosition && selectedEq && (
          <Popup
            position={popupPosition}
            onClose={() => setPopupPosition(null)}
          >
            <div>
              <p>
                <b>地震資訊</b>
              </p>
              <p>地震編號：{selectedEq.earthquakeNo}</p>
              <p>地震發生時間：{selectedEq.originTime}</p>
              <p>規模：{selectedEq.magnitude}</p>
              <p>
                經度：{selectedEq.longitude} / 緯度：{selectedEq.latitude}
              </p>
              <p>
                影響範圍半徑：約 {Math.round(selectedEq.radius / 1000)} 公里
              </p>
              <a
                href={selectedEq.webLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                點此查看詳細報告
              </a>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default EarthquakeMap;
