import React, { useState, useEffect, useCallback } from "react";
import isEqual from "lodash/isEqual";

// 資料顯示元件 (純粹顯示天氣資料，不處理動畫)
const WeatherDataDisplay = React.memo(({ weatherData }) => {
  const orderedLocations = [
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

  const sortedWeatherData = orderedLocations
    .map((locationName) =>
      weatherData.find((location) => location.locationName === locationName)
    )
    .filter(Boolean);

  return (
    <div className="data-container">
      {sortedWeatherData.map((location, index) => {
        const { locationName, weatherElement } = location;
        return (
          <div key={index} className="location">
            <h2>{locationName}</h2>
            {weatherElement.map((element, idx) => (
              <div key={idx} className="weather-element">
                <h3>{element.elementName}</h3>
                {element.time.slice(0, 1).map((timeData, timeIdx) => (
                  <div key={timeIdx} className="time-period">
                    <p>
                      預報範圍：{timeData.startTime} ~ {timeData.endTime}
                    </p>
                    <p>
                      值：{timeData.parameter.parameterName}{" "}
                      {timeData.parameter.parameterUnit || ""}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
});

// 資料取得元件 (專注於資料抓取與更新)
const WeatherData = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    const apiUrl =
      "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-7E452C07-0B0D-41CF-9963-3BF25839B4A9&format=JSON";

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`請求失敗 HTTP 狀態碼：${response.status}`);
      }

      const data = await response.json();
      const locations = data.records?.location || [];

      if (!isEqual(locations, weatherData)) {
        setWeatherData(locations);
      }

      setError(null);
    } catch (error) {
      console.error("請求出錯：", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [weatherData]);

  useEffect(() => {
    // 首次加載數據
    fetchWeatherData();

    // 設置定時器，每天中午12點和晚上12點抓取資料
    const now = new Date();
    const nextNoon = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      12,
      0,
      0
    );
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );

    const timeToNextNoon = nextNoon.getTime() - now.getTime();
    const timeToNextMidnight = nextMidnight.getTime() - now.getTime();

    const noonTimeout = setTimeout(() => {
      fetchWeatherData();
      setInterval(fetchWeatherData, 24 * 60 * 60 * 1000); // 每24小時中午12點
    }, timeToNextNoon);

    const midnightTimeout = setTimeout(() => {
      fetchWeatherData();
      setInterval(fetchWeatherData, 24 * 60 * 60 * 1000); // 每24小時晚上12點
    }, timeToNextMidnight);

    return () => {
      clearTimeout(noonTimeout);
      clearTimeout(midnightTimeout);
    };
  }, [fetchWeatherData]);

  if (loading) {
    return <div>加載中...</div>;
  }

  if (error) {
    return <div>發生錯誤：{error.message}</div>;
  }

  // 將資料顯示與元件內部分離
  return <WeatherDataDisplay weatherData={weatherData} />;
};

export default WeatherData;
