import React, { useState } from "react";
import WeatherData from "./WeatherData";
import WeatherMap from "./WeatherMap";

const WeatherDataPage = ({ onAllEarthquakes }) => {
  const [forecastTime, setForecastTime] = useState(null);
  const [weatherDataByCity, setWeatherDataByCity] = useState([]);

  const handleForecastTime = (timeInfo) => {
    if (!forecastTime) setForecastTime(timeInfo);
  };

  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">天氣預報資訊</h2>
      <WeatherMap weatherDataByCity={weatherDataByCity} />
      {!weatherDataByCity.length && (
        <div>
          <WeatherData
            onAllEarthquakes={onAllEarthquakes}
            onForecastTime={handleForecastTime}
            onWeatherDataByCity={setWeatherDataByCity}
          />
        </div>
      )}
    </div>
  );
};

export default WeatherDataPage;
