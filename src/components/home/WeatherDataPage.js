import React, { useState } from "react";
import WeatherData from "./WeatherData";
import WeatherDataCity from "./WeatherDataCity";

const formatDateWithWeekday = (datetime) => {
  if (!datetime) return "無資料";
  const date = new Date(datetime);
  const formattedDate = date
    .toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "/");
  const formattedTime = date.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const weekday = new Intl.DateTimeFormat("zh-TW", { weekday: "short" }).format(
    date
  );
  return `${formattedDate} (${weekday}) ${formattedTime}`;
};

const WeatherDataPage = ({ onAllEarthquakes, selectedCity }) => {
  const [forecastTime, setForecastTime] = useState(null);

  const handleForecastTime = (timeInfo) => {
    if (!forecastTime) {
      setForecastTime(timeInfo);
    }
  };

  const displayCityName = selectedCity === "Taiwan" ? "臺灣" : selectedCity;

  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">{displayCityName}天氣資訊</h2>

      {selectedCity === "Taiwan" && (
        <>
          {forecastTime && (
            <div>
              <p className="forecast-time">
                預報時段：{formatDateWithWeekday(forecastTime.startTime)} ~{" "}
                <br />
                {formatDateWithWeekday(forecastTime.endTime)}
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
