// import React, { useState } from "react";
// import WeatherData from "./WeatherData";

// const WeatherDataPage = ({ onAllEarthquakes }) => {
//   const [forecastTime, setForecastTime] = useState(null);

//   const handleForecastTime = (timeInfo) => {
//     if (!forecastTime) {
//       setForecastTime(timeInfo);
//     }
//   };

//   return (
//     <div className="noto-sans-sc">
//       <h2 className="data-heading">天氣預報資訊</h2>
//       {forecastTime && (
//         <div>
//           <p>
//             預報時段：{forecastTime.startTime} ~ {forecastTime.endTime}
//           </p>
//         </div>
//       )}
//       <div>
//         <WeatherData
//           onAllEarthquakes={onAllEarthquakes}
//           onForecastTime={handleForecastTime}
//         />
//       </div>
//     </div>
//   );
// };

// export default WeatherDataPage;

import React, { useState } from "react";
import WeatherData from "./WeatherData";
import WeatherDataCity from "./WeatherDataCity";

const WeatherDataPage = ({ onAllEarthquakes }) => {
  // 狀態管理
  const [forecastTime, setForecastTime] = useState(null);
  const [weatherDataByCity, setWeatherDataByCity] = useState([]); // 儲存各城市的天氣資料
  const [selectedCity, setSelectedCity] = useState("Taiwan"); // 預設選擇全域

  // 預報時間的處理函數
  const handleForecastTime = (timeInfo) => {
    if (!forecastTime) {
      setForecastTime(timeInfo);
    }
  };

  // 縣市選擇變更處理函數
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  // 縣市排序順序
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

  // 按排序順序篩選縣市
  const sortedCities = weatherDataByCity.length
    ? cityOrder.filter((city) =>
        weatherDataByCity.some((data) => data.city === city)
      )
    : cityOrder;

  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">天氣預報資訊</h2>

      {/* 縣市選擇下拉選單 */}
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

      {/* 預報時段顯示 */}
      {forecastTime && (
        <div>
          <p>
            預報時段：{forecastTime.startTime} ~ {forecastTime.endTime}
          </p>
        </div>
      )}

      {/* 根據選擇顯示對應的資料 */}
      {selectedCity === "Taiwan" ? (
        <WeatherData
          onAllEarthquakes={onAllEarthquakes}
          onForecastTime={handleForecastTime}
          onWeatherDataByCity={setWeatherDataByCity}
        />
      ) : (
        <WeatherDataCity city={selectedCity} />
      )}
    </div>
  );
};

export default WeatherDataPage;
