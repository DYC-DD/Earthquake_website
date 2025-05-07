import React, { useState, useEffect } from "react";

const isNightTime = () => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 18 || hours < 6;
};

const getIconPath = (weatherCode) => {
  const baseIconPath = `/icons/${weatherCode}.svg`;
  const nightIconPath = `/icons/${weatherCode}(1).svg`;

  if (isNightTime()) {
    const img = new Image();
    img.src = nightIconPath;
    if (img.complete || img.naturalWidth !== 0) {
      return nightIconPath;
    }
  }
  return baseIconPath;
};

const WeatherDataCity = ({ city, onTownWeatherData }) => {
  const [cityWeatherData, setCityWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cityApiMap = {
    基隆市: "F-D0047-049",
    臺北市: "F-D0047-061",
    新北市: "F-D0047-069",
    桃園市: "F-D0047-005",
    新竹縣: "F-D0047-009",
    新竹市: "F-D0047-053",
    苗栗縣: "F-D0047-013",
    臺中市: "F-D0047-073",
    彰化縣: "F-D0047-017",
    南投縣: "F-D0047-021",
    雲林縣: "F-D0047-025",
    嘉義縣: "F-D0047-029",
    嘉義市: "F-D0047-057",
    臺南市: "F-D0047-077",
    高雄市: "F-D0047-065",
    屏東縣: "F-D0047-033",
    宜蘭縣: "F-D0047-001",
    花蓮縣: "F-D0047-041",
    臺東縣: "F-D0047-037",
    澎湖縣: "F-D0047-045",
    金門縣: "F-D0047-085",
    連江縣: "F-D0047-081",
  };

  const AK = "CWA-76B91926-CFA1-4904-A185-D5881406DC5D";

  useEffect(() => {
    const fetchCityWeatherData = async () => {
      try {
        setLoading(true);

        if (!cityApiMap[city]) {
          throw new Error("City API code not found");
        }

        const apiUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${cityApiMap[city]}?Authorization=${AK}&format=JSON`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCityWeatherData(data.records?.Locations[0] || {});
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCityWeatherData();
  }, [city]);

  useEffect(() => {
    if (!cityWeatherData.Location) return;

    const townWeatherArray = cityWeatherData.Location.map((location) => {
      const element = location.WeatherElement?.find(
        (el) => el.ElementName === "天氣現象"
      );
      if (!element) {
        return {
          townName: location.LocationName,
          weatherCode: "",
        };
      }

      let currentTimeData = element.Time.find((time, idx, arr) => {
        const nextTime = arr[idx + 1]?.StartTime || arr[idx + 1]?.DataTime;
        const start = time.StartTime || time.DataTime;
        const end = nextTime || time.EndTime;
        return isNowInRange(start, end);
      });

      if (!currentTimeData) {
        const futureTimeData = element.Time.filter((time) => {
          const start = time.StartTime || time.DataTime;
          return isFutureTime(start);
        });
        currentTimeData = futureTimeData.length ? futureTimeData[0] : null;
      }

      if (!currentTimeData) {
        return {
          townName: location.LocationName,
          weatherCode: "",
        };
      }

      const weatherCode =
        currentTimeData.ElementValue?.[0]?.WeatherCode?.replace(/^0+/, "") ||
        "";

      return {
        townName: location.LocationName,
        weatherCode,
      };
    });

    onTownWeatherData?.(townWeatherArray);
  }, [cityWeatherData, onTownWeatherData]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
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
    const weekday = new Intl.DateTimeFormat("zh-TW", {
      weekday: "short",
    }).format(date);
    return `${formattedDate} (${weekday}) ${formattedTime}`;
  };

  const isNowInRange = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;
    if (!endTime) {
      return start <= now;
    }
    return start <= now && now < end;
  };

  const isFutureTime = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    return start > now;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const targetElements = ["天氣現象", "溫度", "風速"];

  const getCurrentTimeDisplay = (time) => {
    if (!time) return "";
    if (time.DataTime) {
      return formatDateTime(time.DataTime);
    }
    if (time.StartTime && time.EndTime) {
      return (
        <>
          {formatDateTime(time.StartTime)} ~ <br />
          {formatDateTime(time.EndTime)}
        </>
      );
    }
    return "";
  };

  const getFutureValue = (time, eName, location) => {
    if (!time) return { title: "", detail: "" };

    switch (eName) {
      case "溫度": {
        const apparentTempElement = location.WeatherElement.find(
          (el) => el.ElementName === "體感溫度"
        );
        const apparentTempValue = apparentTempElement?.Time.find(
          (tempTime) => tempTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.ApparentTemperature;
        const humidityElement = location.WeatherElement.find(
          (el) => el.ElementName === "相對濕度"
        );
        const humidityValue = humidityElement?.Time.find(
          (hTime) => hTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.RelativeHumidity;
        const comfortElement = location.WeatherElement.find(
          (el) => el.ElementName === "舒適度指數"
        );
        const comfortDescValue = comfortElement?.Time.find(
          (cTime) => cTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.ComfortIndexDescription;
        const temperatureValue = time.ElementValue?.[0]?.Temperature || "N/A";

        return {
          title: formatDateTime(time.DataTime || time.StartTime),
          detail:
            `溫度：${temperatureValue} °C` +
            (apparentTempValue ? `\n體感溫度：${apparentTempValue} °C` : "") +
            (humidityValue ? `\n相對濕度：${humidityValue} %` : "") +
            (comfortDescValue ? `\n描述：${comfortDescValue}` : ""),
        };
      }

      case "風速": {
        const windDirection = location.WeatherElement.find(
          (el) => el.ElementName === "風向"
        );
        const windDirValue = windDirection?.Time.find(
          (dirTime) => dirTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.WindDirection;
        return {
          title: formatDateTime(time.DataTime || time.StartTime),
          detail:
            `風速：${time.ElementValue?.[0]?.WindSpeed} m/s\n` +
            `蒲福風級：${time.ElementValue?.[0]?.BeaufortScale}\n` +
            `風向：${windDirValue || "N/A"}`,
        };
      }

      case "天氣現象": {
        const rainProbability = location.WeatherElement.find(
          (el) => el.ElementName === "3小時降雨機率"
        );
        const rainProbValue = rainProbability?.Time.find((rainTime) => {
          const start = new Date(rainTime.StartTime || rainTime.DataTime);
          const end = new Date(rainTime.EndTime || start);
          const futureStart = new Date(time.DataTime || time.StartTime);
          return futureStart >= start && futureStart < end;
        })?.ElementValue?.[0]?.ProbabilityOfPrecipitation;
        return {
          title: `${formatDateTime(time.StartTime)} ~ ${formatDateTime(
            time.EndTime
          )}`,
          detail:
            `天氣現象：${time.ElementValue?.[0]?.Weather}\n` +
            `降雨機率：${rainProbValue || "N/A"} %`,
        };
      }

      default:
        return { title: "", detail: "" };
    }
  };

  const getCurrentValue = (time, eName, location) => {
    if (!time) return "";

    switch (eName) {
      case "溫度": {
        const apparentTempElement = location.WeatherElement.find(
          (el) => el.ElementName === "體感溫度"
        );
        const apparentTempValue = apparentTempElement?.Time.find(
          (tempTime) => tempTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.ApparentTemperature;
        const humidityElement = location.WeatherElement.find(
          (el) => el.ElementName === "相對濕度"
        );
        const humidityValue = humidityElement?.Time.find(
          (hTime) => hTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.RelativeHumidity;
        const comfortElement = location.WeatherElement.find(
          (el) => el.ElementName === "舒適度指數"
        );
        const comfortDescValue = comfortElement?.Time.find(
          (cTime) => cTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.ComfortIndexDescription;
        const temperatureValue = time.ElementValue?.[0]?.Temperature || "N/A";

        return (
          <>
            溫度：{temperatureValue} °C
            <br />
            {apparentTempValue && (
              <>
                體感溫度：{apparentTempValue} °C
                <br />
              </>
            )}
            {humidityValue && (
              <>
                相對濕度：{humidityValue} %
                <br />
              </>
            )}
            {comfortDescValue && (
              <>
                描述：{comfortDescValue}
                <br />
              </>
            )}
          </>
        );
      }

      case "風速": {
        const windDirection = location.WeatherElement.find(
          (el) => el.ElementName === "風向"
        );
        const windDirValue = windDirection?.Time.find(
          (dirTime) => dirTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.WindDirection;
        return (
          <>
            風速：{time.ElementValue?.[0]?.WindSpeed} m/s
            <br />
            蒲福風級：{time.ElementValue?.[0]?.BeaufortScale}
            <br />
            風向：{windDirValue || "N/A"}
          </>
        );
      }

      case "天氣現象": {
        const rainProbability = location.WeatherElement.find(
          (el) => el.ElementName === "3小時降雨機率"
        );
        const rainProbValue = rainProbability?.Time.find(
          (rainTime) => rainTime.DataTime === time.DataTime
        )?.ElementValue?.[0]?.ProbabilityOfPrecipitation;
        const weatherCode = time.ElementValue?.[0]?.WeatherCode?.replace(
          /^0+/,
          ""
        );
        const iconPath = getIconPath(weatherCode);

        return (
          <>
            <img src={iconPath} alt="Weather Icon" />
            <br />
            天氣現象：{time.ElementValue?.[0]?.Weather}
            <br />
            降雨機率：{rainProbValue || "N/A"} %
          </>
        );
      }

      default:
        return "";
    }
  };

  return (
    <div className="data-container3 noto-sans-sc">
      {cityWeatherData.Location?.map((location, index) => (
        <div key={index} className="town-box">
          <h2>{location.LocationName}</h2>

          {targetElements.map((eName) => {
            const element = location.WeatherElement.find(
              (el) => el.ElementName === eName
            );
            if (!element) return null;

            const currentTimeData = element.Time.find((time, idx, arr) => {
              const nextTime =
                arr[idx + 1]?.StartTime || arr[idx + 1]?.DataTime;
              const start = time.StartTime || time.DataTime;
              const end = nextTime || time.EndTime;
              return isNowInRange(start, end);
            });

            const futureTimeData = element.Time.filter((time) => {
              const start = time.StartTime || time.DataTime;
              return isFutureTime(start);
            });

            const displayTimeData = currentTimeData || futureTimeData[0];

            return (
              <div key={eName} className="WD-group">
                {displayTimeData && (
                  <div>
                    <p>
                      目前時段：{getCurrentTimeDisplay(displayTimeData)}
                      <br />
                      {getCurrentValue(displayTimeData, eName, location)}
                    </p>
                  </div>
                )}

                {futureTimeData.length > 0 && (
                  <div className="WD-future-container">
                    {futureTimeData.map((time, idx) => {
                      const { title, detail } = getFutureValue(
                        time,
                        eName,
                        location
                      );
                      return (
                        <div className="WD-future-container2" key={idx}>
                          <p>{title || "未來時間"}</p>
                          <p>{detail}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeatherDataCity;
