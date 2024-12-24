import React, { useState } from "react";
import WeatherData from "./WeatherData";
import WeatherDataCity from "./WeatherDataCity";

const WeatherDataPage = ({ onAllEarthquakes, selectedCity }) => {
  const [forecastTime, setForecastTime] = useState(null);

  const handleForecastTime = (timeInfo) => {
    if (!forecastTime) {
      setForecastTime(timeInfo);
    }
  };

  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">天氣預報資訊</h2>

      {selectedCity === "Taiwan" && (
        <>
          {forecastTime && (
            <div>
              <p>
                預報時段：{forecastTime.startTime} ~ {forecastTime.endTime}
              </p>
            </div>
          )}
          <WeatherData
            onAllEarthquakes={onAllEarthquakes}
            onForecastTime={handleForecastTime}
          />
        </>
      )}

      {selectedCity !== "Taiwan" && <WeatherDataCity city={selectedCity} />}
    </div>
  );
};

export default WeatherDataPage;
