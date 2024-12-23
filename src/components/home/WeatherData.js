import React, { useState, useEffect, useCallback } from "react";
import isEqual from "lodash/isEqual";

const WeatherDataDisplay = React.memo(({ weatherData, onForecastTime }) => {
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

  const getCurrentTimeData = (times) => {
    const now = new Date();
    let closestFutureTime = null;
    let closestPastTime = null;

    times.forEach((time) => {
      const startTime = new Date(time.startTime);
      const endTime = new Date(time.endTime);
      if (now >= startTime && now < endTime) {
        closestFutureTime = time;
      } else if (
        startTime > now &&
        (!closestFutureTime ||
          startTime < new Date(closestFutureTime.startTime))
      ) {
        closestFutureTime = time;
      } else if (
        endTime <= now &&
        (!closestPastTime || endTime > new Date(closestPastTime.endTime))
      ) {
        closestPastTime = time;
      }
    });

    return closestFutureTime || closestPastTime;
  };

  useEffect(() => {
    if (sortedWeatherData.length > 0) {
      for (let location of sortedWeatherData) {
        const wxElement = location.weatherElement.find(
          (el) => el.elementName === "Wx"
        );
        if (wxElement && wxElement.time.length > 0) {
          const currentWxTimeData = getCurrentTimeData(wxElement.time);
          if (currentWxTimeData) {
            onForecastTime({
              startTime: currentWxTimeData.startTime,
              endTime: currentWxTimeData.endTime,
            });
            break;
          }
        }
      }
    }
  }, [sortedWeatherData, onForecastTime]);

  return (
    <div className="data-container2">
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

        const currentWxData = getCurrentTimeData(wxElement.time)?.parameter;
        const minTemp = getCurrentTimeData(minTempElement?.time)?.parameter
          ?.parameterName;
        const maxTemp = getCurrentTimeData(maxTempElement?.time)?.parameter
          ?.parameterName;
        const ci = getCurrentTimeData(ciElement?.time)?.parameter
          ?.parameterName;
        const pop = getCurrentTimeData(popElement?.time)?.parameter
          ?.parameterName;
        const wxValue = currentWxData?.parameterValue;

        const iconSrc = `${process.env.PUBLIC_URL}/icons/${wxValue}.svg`;

        return (
          <div key={index}>
            <h2>{locationName}</h2>

            <img src={iconSrc} alt={currentWxData?.parameterName} />

            <p>天氣現象 ：{currentWxData?.parameterName}</p>
            <p>降雨機率 ：{pop} %</p>
            <p>
              氣溫範圍 ：{minTemp} ℃ ~ {maxTemp} ℃
            </p>
            <p>體感狀況 ：{ci}</p>
            <hr />
          </div>
        );
      })}
    </div>
  );
});

const WeatherData = ({ onForecastTime, onWeatherDataByCity }) => {
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

      const weatherByCity = locations.map((location) => {
        const locationName = location.locationName;
        const wxElement = location.weatherElement.find(
          (el) => el.elementName === "Wx"
        );
        const currentWxData = wxElement?.time[0]?.parameter;

        return {
          city: locationName,
          wxValue: currentWxData?.parameterValue, // 天氣編號
          wxName: currentWxData?.parameterName, // 天氣名稱
        };
      });
      onWeatherDataByCity?.(weatherByCity);

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
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 3600000); // 每1小時更新一次

    return () => clearInterval(interval);
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
