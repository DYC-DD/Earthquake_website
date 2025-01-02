import React, { useState } from "react";
import WeatherData from "./WeatherData";
import WeatherDataCity from "./WeatherDataCity";
import WeatherMap from "./WeatherMap";
import ReactGA from "react-ga4";

const WeatherMapPage = ({
  onAllEarthquakes,
  selectedCity,
  setSelectedCity,
}) => {
  const [forecastTime, setForecastTime] = useState(null);
  const [weatherDataByCity, setWeatherDataByCity] = useState([]);
  const [townWeatherData, setTownWeatherData] = useState([]);

  const handleForecastTime = (timeInfo) => {
    if (!forecastTime) setForecastTime(timeInfo);
  };

  const handleCityChange = (event) => {
    const selected = event.target.value;
    setSelectedCity(selected);

    // 發送 Google Analytics 事件
    ReactGA.event({
      category: "Weather",
      action: "Select City",
      label: selected,
    });
  };

  const cityOrder = [
    "基隆市",
    "臺北市",
    "新北市",
    "桃園市",
    "新竹縣",
    "新竹市",
    "苗栗縣",
    "臺中市",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義縣",
    "嘉義市",
    "臺南市",
    "高雄市",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "臺東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
  ];

  const sortedCities = weatherDataByCity.length
    ? cityOrder.filter((city) =>
        weatherDataByCity.some((data) => data.city === city)
      )
    : cityOrder;

  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">天氣預報資訊</h2>

      <WeatherMap
        weatherDataByCity={weatherDataByCity}
        selectedCity={selectedCity}
        townWeatherData={townWeatherData}
      />

      <div className="controls">
        <select onChange={handleCityChange} value={selectedCity}>
          <option value="Taiwan">臺灣</option>
          {sortedCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {!weatherDataByCity.length && selectedCity === "Taiwan" && (
        <WeatherData
          onAllEarthquakes={onAllEarthquakes}
          onForecastTime={handleForecastTime}
          onWeatherDataByCity={setWeatherDataByCity}
        />
      )}

      {selectedCity !== "Taiwan" && (
        <div style={{ display: "none" }}>
          <WeatherDataCity
            city={selectedCity}
            onTownWeatherData={setTownWeatherData}
          />
        </div>
      )}
    </div>
  );
};

export default WeatherMapPage;
