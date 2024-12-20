import React, { useState, useEffect, useCallback } from "react";
import isEqual from "lodash/isEqual";

const WeatherDataDisplay = React.memo(({ weatherData, onForecastTime }) => {
  // 預定顯示的地點排序
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

  // 向上傳遞預報時段
  useEffect(() => {
    if (sortedWeatherData.length > 0) {
      for (let location of sortedWeatherData) {
        const wxElement = location.weatherElement.find(
          (el) => el.elementName === "Wx"
        );
        if (wxElement && wxElement.time.length > 0) {
          const latestWxTimeData = wxElement.time[0];
          onForecastTime({
            startTime: latestWxTimeData.startTime,
            endTime: latestWxTimeData.endTime,
          });
          break;
        }
      }
    }
  }, [sortedWeatherData, onForecastTime]);

  return (
    <div className="data-container">
      {sortedWeatherData.map((location, index) => {
        const { locationName, weatherElement } = location;
        const wxElement = weatherElement.find((el) => el.elementName === "Wx");
        const minTempElement = weatherElement.find(
          (el) => el.elementName === "MinT"
        );
        const maxTempElement = weatherElement.find(
          (el) => el.elementName === "MaxT"
        );
        const ciElement = weatherElement.find((el) => el.elementName === "CI");
        const popElement = weatherElement.find(
          (el) => el.elementName === "PoP"
        );

        if (!wxElement || wxElement.time.length === 0) {
          return null;
        }

        const wxData = wxElement.time[0].parameter;
        const minTemp = minTempElement?.time[0]?.parameter?.parameterName;
        const maxTemp = maxTempElement?.time[0]?.parameter?.parameterName;
        const ci = ciElement?.time[0]?.parameter?.parameterName;
        const pop = popElement?.time[0]?.parameter?.parameterName;
        const wxValue = wxData.parameterValue;

        // 將 wxValue 對應到圖示檔路徑
        const iconSrc = `${process.env.PUBLIC_URL}/icons/${wxValue}.svg`; // 假設 public/icons 下有相符的圖檔

        return (
          <div key={index} className="location">
            <h2>{locationName}</h2>

            {/* 使用 img 顯示對應 wxValue 的圖示 */}
            <img src={iconSrc} alt={wxData.parameterName} />

            <p>天氣現象 ：{wxData.parameterName}</p>
            <p>降雨機率 ：{pop} %</p>
            <p>體感狀況 ：{ci}</p>
            <p>
              氣溫範圍 ：{minTemp} ℃ ~ {maxTemp} ℃
            </p>
            <hr />
          </div>
        );
      })}
    </div>
  );
});

const WeatherData = ({ onForecastTime }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl =
    "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001";

  const params = new URLSearchParams({
    Authorization: "CWA-7E452C07-0B0D-41CF-9963-3BF25839B4A9",
    format: "JSON",
  });

  const fetchWeatherData = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}?${params.toString()}`);
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
    fetchWeatherData();

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
      setInterval(fetchWeatherData, 24 * 60 * 60 * 1000);
    }, timeToNextNoon);

    const midnightTimeout = setTimeout(() => {
      fetchWeatherData();
      setInterval(fetchWeatherData, 24 * 60 * 60 * 1000);
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

  return (
    <WeatherDataDisplay
      weatherData={weatherData}
      onForecastTime={onForecastTime}
    />
  );
};

export default WeatherData;
