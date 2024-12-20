import React, { useState } from "react";
import WeatherData from "./WeatherData";

const WeatherDataPage = ({ onAllEarthquakes }) => {
  const [forecastTime, setForecastTime] = useState(null);

  const handleForecastTime = (timeInfo) => {
    // timeInfo = { startTime: "2024-12-20 12:00:00", endTime: "2024-12-20 18:00:00" }
    // 若已存在則不重複更新(只顯示一次)
    if (!forecastTime) {
      setForecastTime(timeInfo);
    }
  };

  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">即時天氣資訊</h2>
      {/* 顯示預報時段（只顯示一次） */}
      {forecastTime && (
        <div>
          <p>
            預報時段：{forecastTime.startTime} ~ {forecastTime.endTime}
          </p>
        </div>
      )}
      <div>
        {/* 將 handleForecastTime 傳入，讓 WeatherData 能把預報時段傳上來 */}
        <WeatherData
          onAllEarthquakes={onAllEarthquakes}
          onForecastTime={handleForecastTime}
        />
      </div>
    </div>
  );
};

export default WeatherDataPage;
