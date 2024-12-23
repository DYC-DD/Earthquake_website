import React, { useState } from "react";
import WeatherData from "./WeatherData";
import WeatherMap from "./WeatherMap";

const WeatherDataPage = ({ onAllEarthquakes }) => {
  const [forecastTime, setForecastTime] = useState(null);
  const [weatherDataByCity, setWeatherDataByCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Taiwan"); // 預設選擇台灣

  const handleForecastTime = (timeInfo) => {
    if (!forecastTime) setForecastTime(timeInfo);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value); // 更新選擇的縣市
  };

  // 定義縣市排序
  const cityOrder = [
    "臺灣",
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

  // 按排序順序篩選並排序縣市
  const sortedCities = cityOrder.filter((city) =>
    weatherDataByCity.some((data) => data.city === city)
  );

  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">天氣預報資訊</h2>

      <WeatherMap
        weatherDataByCity={weatherDataByCity}
        selectedCity={selectedCity}
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
