import React, { useState, useEffect } from "react";

const WeatherDataCity = ({ city }) => {
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

  const AK = "CWA-7E452C07-0B0D-41CF-9963-3BF25839B4A9";
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

  const formatDateTime = (dateTime) => {
    if (!dateTime) return { date: "", time: "" };
    const [date, time] = dateTime.replace("+08:00", "").split("T");
    const timeWithoutSeconds = time.split(":").slice(0, 2).join(":");
    return { date, time: timeWithoutSeconds };
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

  return (
    <div className="data-container3 noto-sans-sc">
      {cityWeatherData.Location?.map((location, index) => (
        <div key={index}>
          <h3>地點名稱：{location.LocationName}</h3>

          {location.WeatherElement.map((element) => {
            const eName = element.ElementName;
            const targetElements = [
              "溫度",
              // "露點溫度",
              "相對濕度",
              // "體感溫度",
              "舒適度指數",
              "風速",
              "天氣現象",
              // "天氣預報綜合描述",
            ];

            if (!targetElements.includes(eName)) {
              return null;
            }

            // 找出「目前時段」資料
            const currentTimeData = element.Time.find((time, idx, arr) => {
              const nextTime =
                arr[idx + 1]?.StartTime || arr[idx + 1]?.DataTime;
              const start = time.StartTime || time.DataTime;
              const end = nextTime || time.EndTime;
              return isNowInRange(start, end);
            });

            // 找到未來的所有時段
            const futureTimeData = element.Time.filter((time) => {
              const start = time.StartTime || time.DataTime;
              return isFutureTime(start);
            });

            const getCurrentValue = (time) => {
              if (!time) return "";
              switch (eName) {
                case "溫度":
                  const apparentTemp = location.WeatherElement.find(
                    (el) => el.ElementName === "體感溫度"
                  );
                  const apparentTempValue = apparentTemp?.Time.find(
                    (tempTime) => tempTime.DataTime === time.DataTime
                  )?.ElementValue?.[0]?.ApparentTemperature;
                  return (
                    <>
                      溫度：{time.ElementValue?.[0]?.Temperature} °C
                      {apparentTempValue && (
                        <>
                          <br />
                          體感溫度：{apparentTempValue} °C
                        </>
                      )}
                    </>
                  );

                // case "露點溫度":
                //   return <>露點溫度：{time.ElementValue?.[0]?.DewPoint} °C</>;

                case "相對濕度":
                  return (
                    <>相對濕度：{time.ElementValue?.[0]?.RelativeHumidity} %</>
                  );

                // case "體感溫度":
                //   return (
                //     <>
                //       體感溫度：{time.ElementValue?.[0]?.ApparentTemperature} °C
                //     </>
                //   );

                case "舒適度指數":
                  return (
                    <>
                      {/* 舒適度指數：{time.ElementValue?.[0]?.ComfortIndex}
                      <br /> */}
                      描述：{time.ElementValue?.[0]?.ComfortIndexDescription}
                    </>
                  );

                case "風速":
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

                case "天氣現象":
                  const rainProbability = location.WeatherElement.find(
                    (el) => el.ElementName === "3小時降雨機率"
                  );
                  const rainProbValue = rainProbability?.Time.find(
                    (rainTime) => rainTime.DataTime === time.DataTime
                  )?.ElementValue?.[0]?.ProbabilityOfPrecipitation;
                  const weatherCode =
                    time.ElementValue?.[0]?.WeatherCode?.replace(/^0+/, "");
                  const iconPath = `${process.env.PUBLIC_URL}/icons/${weatherCode}.svg`;
                  return (
                    <>
                      <img src={iconPath} alt="Weather Icon" />
                      <br />
                      天氣現象：{time.ElementValue?.[0]?.Weather}
                      <br />
                      {/* 現象代碼：{time.ElementValue?.[0]?.WeatherCode}
                      <br /> */}
                      降雨機率：{rainProbValue || "N/A"} %
                    </>
                  );

                // case "天氣預報綜合描述":
                //   return (
                //     <>
                //       預報時間：{time.StartTime} ~ {time.EndTime}
                //       <br />
                //       描述：{time.ElementValue?.[0]?.WeatherDescription}
                //     </>
                //   );

                default:
                  return "";
              }
            };

            const getFutureValue = (time) => {
              if (!time) return { title: "", detail: "" };

              const { date: dtDate, time: dtTime } = formatDateTime(
                time.DataTime || time.StartTime
              );

              const eName = element.ElementName;

              switch (eName) {
                case "溫度":
                  const apparentTemp = location.WeatherElement.find(
                    (el) => el.ElementName === "體感溫度"
                  );
                  const apparentTempValue = apparentTemp?.Time.find(
                    (tempTime) => tempTime.DataTime === time.DataTime
                  )?.ElementValue?.[0]?.ApparentTemperature;
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail:
                      `溫度：${time.ElementValue?.[0]?.Temperature} °C` +
                      (apparentTempValue
                        ? `\n體感溫度：${apparentTempValue} °C`
                        : ""),
                  };

                // case "露點溫度":
                //   return {
                //     title: `${dtDate} ${dtTime}`,
                //     detail: `露點溫度：${time.ElementValue?.[0]?.DewPoint} °C`,
                //   };

                case "相對濕度":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail: `相對濕度：${time.ElementValue?.[0]?.RelativeHumidity} %`,
                  };

                // case "體感溫度":
                //   return {
                //     title: `${dtDate} ${dtTime}`,
                //     detail: `體感溫度：${time.ElementValue?.[0]?.ApparentTemperature} °C`,
                //   };

                case "舒適度指數":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail:
                      // `舒適度：${time.ElementValue?.[0]?.ComfortIndex}\n` +
                      `描述：${time.ElementValue?.[0]?.ComfortIndexDescription}`,
                  };

                case "風速":
                  const windDirection = location.WeatherElement.find(
                    (el) => el.ElementName === "風向"
                  );
                  const windDirValue = windDirection?.Time.find(
                    (dirTime) => dirTime.DataTime === time.DataTime
                  )?.ElementValue?.[0]?.WindDirection;
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail:
                      `風速：${time.ElementValue?.[0]?.WindSpeed} m/s\n` +
                      `蒲福風級：${time.ElementValue?.[0]?.BeaufortScale}\n` +
                      `風向：${windDirValue || "N/A"}`,
                  };

                case "天氣現象":
                  const rainProbability = location.WeatherElement.find(
                    (el) => el.ElementName === "3小時降雨機率"
                  );
                  const rainProbValue = rainProbability?.Time.find(
                    (rainTime) => {
                      const start = new Date(
                        rainTime.StartTime || rainTime.DataTime
                      );
                      const end = new Date(rainTime.EndTime || start);
                      const futureStart = new Date(
                        time.DataTime || time.StartTime
                      );
                      return futureStart >= start && futureStart < end;
                    }
                  )?.ElementValue?.[0]?.ProbabilityOfPrecipitation;
                  const { date: swDate, time: swTime } = formatDateTime(
                    time.StartTime
                  );
                  const { date: ewDate, time: ewTime } = formatDateTime(
                    time.EndTime
                  );
                  return {
                    title: `${swDate} ${swTime} ~ ${ewDate} ${ewTime}`,
                    detail:
                      `天氣現象：${time.ElementValue?.[0]?.Weather}\n` +
                      // `現象代碼：${time.ElementValue?.[0]?.WeatherCode}\n` +
                      `降雨機率：${rainProbValue || "N/A"} %`,
                  };

                // case "天氣預報綜合描述":
                //   const { date: sdDate, time: sdTime } = formatDateTime(
                //     time.StartTime
                //   );
                //   const { date: edDate, time: edTime } = formatDateTime(
                //     time.EndTime
                //   );
                //   return {
                //     title: `${sdDate} ${sdTime} ~ ${edDate} ${edTime}`,
                //     detail: `描述：${time.ElementValue?.[0]?.WeatherDescription}`,
                //   };
                default:
                  return { title: "", detail: "" };
              }
            };

            const getCurrentTimeDisplay = (time) => {
              if (!time) return "";

              if (time.DataTime) {
                const { date, time: t } = formatDateTime(time.DataTime);
                return `${date} ${t}`;
              } else if (time.StartTime && time.EndTime) {
                const { date: sDate, time: sTime } = formatDateTime(
                  time.StartTime
                );
                const { date: eDate, time: eTime } = formatDateTime(
                  time.EndTime
                );
                return `${sDate} ${sTime} ~ ${eDate} ${eTime}`;
              }
              return "";
            };

            return (
              <div key={eName} className="WD-group">
                {/* 1. 目前時段資料顯示 */}
                {currentTimeData && (
                  <div className="WD-type">
                    <p>
                      目前時段：
                      {getCurrentTimeDisplay(currentTimeData)}
                      <br />
                      {getCurrentValue(currentTimeData)}
                    </p>
                  </div>
                )}

                {/* 2. 未來時段資料：可水平捲動 */}
                {futureTimeData.length > 0 && (
                  <div className="WD-future-container">
                    {futureTimeData.map((time, idx) => {
                      const { title, detail } = getFutureValue(time);
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
          <hr />
          <br />
        </div>
      ))}
    </div>
  );
};

export default WeatherDataCity;
