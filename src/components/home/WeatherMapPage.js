import React from "react";
import WeatherMap from "./WeatherMap";

const WeatherMapPage = () => {
  return (
    <div className="noto-sans-sc">
      <h2 className="map-heading">即時天氣地圖</h2>
      <WeatherMap />
      <div className="controls">
        <p>...</p>
      </div>
    </div>
  );
};

export default WeatherMapPage;
