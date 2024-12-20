import React, { useState } from "react";
import WeatherData from "./WeatherData";

const WeatherDataPage = ({ onAllEarthquakes }) => {
  const [forecastTime, setForecastTime] = useState(null);

  const handleForecastTime = (timeInfo) => {
    if (!forecastTime) {
      setForecastTime(timeInfo);
    }
  };

  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">天氣預報資訊</h2>
      {forecastTime && (
        <div>
          <p>
            預報時段：{forecastTime.startTime} ~ {forecastTime.endTime}
          </p>
        </div>
      )}
      <div>
        <WeatherData
          onAllEarthquakes={onAllEarthquakes}
          onForecastTime={handleForecastTime}
        />
      </div>
    </div>
  );
};

export default WeatherDataPage;
