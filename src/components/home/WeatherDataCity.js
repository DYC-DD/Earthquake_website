import React, { useState, useEffect } from "react";

/**
 * WeatherDataCity Component
 * @param {string} city - 使用者所選取的城市
 */
const WeatherDataCity = ({ city }) => {
  // 定義狀態：城市天氣資料、讀取狀態、錯誤訊息
  const [cityWeatherData, setCityWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 各城市對應的 API Code
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

  // 你的授權碼（範例）
  const AK = "CWA-7E452C07-0B0D-41CF-9963-3BF25839B4A9";

  /**
   * useEffect：在 componentDidMount 或 city 變動時，向 API 取得該城市的天氣資料
   */
  useEffect(() => {
    const fetchCityWeatherData = async () => {
      try {
        setLoading(true);

        if (!cityApiMap[city]) {
          throw new Error("City API code not found");
        }

        // 目標 API
        const apiUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${cityApiMap[city]}?Authorization=${AK}&format=JSON`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        // 僅取 records.Locations[0] 這個物件
        setCityWeatherData(data.records?.Locations[0] || {});
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCityWeatherData();
  }, [city]);

  /**
   * formatDateTime：將類似 "2024-12-20T21:00:00+08:00" 之類的字串
   * 拆分成 { date, time }，方便顯示在畫面上。
   */
  const formatDateTime = (dateTime) => {
    if (!dateTime) return { date: "", time: "" };
    // 移除 "+08:00" 並用 "T" 分割
    const [date, time] = dateTime.replace("+08:00", "").split("T");
    return { date, time };
  };

  /**
   * isNowInRange：判斷現在時間是否落在 [StartTime, EndTime) 區間內
   * 或當該 element 只有單點時間 DataTime 時，也可藉由這裡做簡單判斷
   */
  const isNowInRange = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;

    // 如果沒有 endTime，則以 startTime <= now 來判斷是否為目前
    if (!endTime) {
      return start <= now;
    }

    // 判斷 now 是否落在 [start, end) 之間
    return start <= now && now < end;
  };

  /**
   * isFutureTime：判斷該時段是否為未來時間（startTime > 現在）
   */
  const isFutureTime = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    return start > now;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="data-container2">
      <h3>{city} 天氣資訊</h3>

      {cityWeatherData.Location?.map((location, index) => (
        <div key={index}>
          <h4>地點名稱：{location.LocationName}</h4>

          {/**
           * 針對每個 WeatherElement
           * 以下針對：
           *  1) 溫度
           *  2) 露點溫度 (DewPoint)
           *  3) 相對濕度 (RelativeHumidity)
           *  4) 體感溫度 (ApparentTemperature)
           *  5) 舒適度指數 (ComfortIndex, ComfortIndexDescription)
           *  6) 風速 (WindSpeed, BeaufortScale)
           *  7) 風向 (WindDirection)
           *  8) 3小時降雨機率 (StartTime~EndTime, ProbabilityOfPrecipitation)
           *  9) 天氣現象 (StartTime~EndTime, Weather, WeatherCode)
           * 10) 天氣預報綜合描述 (StartTime~EndTime, WeatherDescription)
           */}
          {location.WeatherElement.map((element) => {
            const eName = element.ElementName;
            // 我們只處理以下這些元素
            const targetElements = [
              "溫度",
              "露點溫度",
              "相對濕度",
              "體感溫度",
              "舒適度指數",
              "風速",
              "風向",
              "3小時降雨機率",
              "天氣現象",
              "天氣預報綜合描述",
            ];

            if (!targetElements.includes(eName)) {
              return null;
            }

            // 找出「目前時段」資料
            const currentTimeData = element.Time.find((time, idx, arr) => {
              const nextTime =
                arr[idx + 1]?.StartTime || arr[idx + 1]?.DataTime;
              // 如果這個時間點是用 DataTime，就沒有 StartTime/EndTime
              const start = time.StartTime || time.DataTime;
              const end = nextTime || time.EndTime;
              return isNowInRange(start, end);
            });

            // 找到未來的所有時段（StartTime > now 或 DataTime > now）
            const futureTimeData = element.Time.filter((time) => {
              const start = time.StartTime || time.DataTime;
              return isFutureTime(start);
            });

            /**
             * getCurrentValue：根據 elementName，回傳「目前時段」顯示的文字內容
             */
            const getCurrentValue = (time) => {
              if (!time) return "";

              switch (eName) {
                case "溫度":
                  return `溫度：${time.ElementValue?.[0]?.Temperature} °C`;
                case "露點溫度":
                  return `露點溫度：${time.ElementValue?.[0]?.DewPoint} °C`;
                case "相對濕度":
                  return `相對濕度：${time.ElementValue?.[0]?.RelativeHumidity} %`;
                case "體感溫度":
                  return `體感溫度：${time.ElementValue?.[0]?.ApparentTemperature} °C`;
                case "舒適度指數":
                  return (
                    `舒適度指數：${time.ElementValue?.[0]?.ComfortIndex}\n` +
                    `描述：${time.ElementValue?.[0]?.ComfortIndexDescription}`
                  );
                case "風速":
                  return (
                    `風速：${time.ElementValue?.[0]?.WindSpeed} m/s\n` +
                    `蒲福風級：${time.ElementValue?.[0]?.BeaufortScale}`
                  );
                case "風向":
                  return `風向：${time.ElementValue?.[0]?.WindDirection}`;
                case "3小時降雨機率":
                  return (
                    `降雨時間：${time.StartTime} ~ ${time.EndTime}\n` +
                    `降雨機率：${time.ElementValue?.[0]?.ProbabilityOfPrecipitation} %`
                  );
                case "天氣現象":
                  return (
                    `現象時間：${time.StartTime} ~ ${time.EndTime}\n` +
                    `天氣現象：${time.ElementValue?.[0]?.Weather}\n` +
                    `現象代碼：${time.ElementValue?.[0]?.WeatherCode}`
                  );
                case "天氣預報綜合描述":
                  return (
                    `預報時間：${time.StartTime} ~ ${time.EndTime}\n` +
                    `描述：${time.ElementValue?.[0]?.WeatherDescription}`
                  );
                default:
                  return "";
              }
            };

            /**
             * getFutureValue：回傳「未來時段」卡片上要顯示的文字內容
             * 這裡一併將日期、時間、對應的天氣數值等排版好
             */
            const getFutureValue = (time) => {
              if (!time) return { title: "", detail: "" };

              // 先將 "DataTime" 或 "StartTime" 取出來做日期格式化
              const { date: dtDate, time: dtTime } = formatDateTime(
                time.DataTime || time.StartTime
              );

              // 針對不同 eName，回傳不同的資訊
              switch (eName) {
                case "溫度":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail: `溫度：${time.ElementValue?.[0]?.Temperature} °C`,
                  };
                case "露點溫度":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail: `露點溫度：${time.ElementValue?.[0]?.DewPoint} °C`,
                  };
                case "相對濕度":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail: `相對濕度：${time.ElementValue?.[0]?.RelativeHumidity} %`,
                  };
                case "體感溫度":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail: `體感溫度：${time.ElementValue?.[0]?.ApparentTemperature} °C`,
                  };
                case "舒適度指數":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail:
                      `舒適度：${time.ElementValue?.[0]?.ComfortIndex}\n` +
                      `描述：${time.ElementValue?.[0]?.ComfortIndexDescription}`,
                  };
                case "風速":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail:
                      `風速：${time.ElementValue?.[0]?.WindSpeed} m/s\n` +
                      `蒲福風級：${time.ElementValue?.[0]?.BeaufortScale}`,
                  };
                case "風向":
                  return {
                    title: `${dtDate} ${dtTime}`,
                    detail: `風向：${time.ElementValue?.[0]?.WindDirection}`,
                  };
                case "3小時降雨機率":
                  // 這類比較明確是區間：StartTime ~ EndTime
                  const { date: sDate, time: sTime } = formatDateTime(
                    time.StartTime
                  );
                  const { date: eDate, time: eTime } = formatDateTime(
                    time.EndTime
                  );
                  return {
                    title: `${sDate} ${sTime} ~ ${eDate} ${eTime}`,
                    detail: `降雨機率：${time.ElementValue?.[0]?.ProbabilityOfPrecipitation} %`,
                  };
                case "天氣現象":
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
                      `現象代碼：${time.ElementValue?.[0]?.WeatherCode}`,
                  };
                case "天氣預報綜合描述":
                  const { date: sdDate, time: sdTime } = formatDateTime(
                    time.StartTime
                  );
                  const { date: edDate, time: edTime } = formatDateTime(
                    time.EndTime
                  );
                  return {
                    title: `${sdDate} ${sdTime} ~ ${edDate} ${edTime}`,
                    detail: `描述：${time.ElementValue?.[0]?.WeatherDescription}`,
                  };
                default:
                  return { title: "", detail: "" };
              }
            };

            // 在「目前時段」也秀出時間：對於 DataTime，就直接顯示；對於 StartTime/EndTime，則顯示區間
            const getCurrentTimeDisplay = (time) => {
              if (!time) return "";

              // 若有 DataTime，就直接用 DataTime
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
              <div key={eName} style={{ marginTop: "1rem" }}>
                {/* 顯示資料類型 */}
                <p>資料類型：{eName}</p>

                {/* 1) 目前時段資料顯示 */}
                {currentTimeData && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  >
                    {/* 在這裡顯示目前時段的「時間」 */}
                    <p>
                      <strong>目前時段：</strong>
                      {getCurrentTimeDisplay(currentTimeData)}
                    </p>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        margin: 0,
                      }}
                    >
                      {getCurrentValue(currentTimeData)}
                    </pre>
                  </div>
                )}

                {/* 2) 未來時段資料：可水平捲動 */}
                {futureTimeData.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      border: "1px solid #ccc",
                      padding: "0.5rem",
                      borderRadius: "8px",
                    }}
                  >
                    {futureTimeData.map((time, idx) => {
                      const { title, detail } = getFutureValue(time);
                      return (
                        <div
                          key={idx}
                          style={{
                            display: "inline-block",
                            minWidth: "150px",
                            padding: "0.5rem",
                            marginRight: "1rem",
                            border: "1px solid #aaa",
                            borderRadius: "4px",
                            textAlign: "left",
                            backgroundColor: "#f9f9f9",
                            whiteSpace: "pre-wrap", // 適合顯示多行文字
                          }}
                        >
                          <p
                            style={{
                              marginBottom: "0.5rem",
                              fontWeight: "bold",
                            }}
                          >
                            {title || "未來時間"}
                          </p>
                          <p style={{ margin: 0 }}>{detail}</p>
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
