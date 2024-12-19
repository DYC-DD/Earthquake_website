import React from "react";
import WeatherData from "./WeatherData";

const WeatherDataPage = ({ onAllEarthquakes }) => {
  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">即時天氣資訊</h2>
      <div>
        <WeatherData onAllEarthquakes={onAllEarthquakes} />
      </div>
    </div>
  );
};

export default WeatherDataPage;
