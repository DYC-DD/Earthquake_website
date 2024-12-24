import React, { useState, useEffect } from "react";

const WeatherDataCity = ({ city }) => {
  const [cityWeatherData, setCityWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API對應表：城市對應到API代碼
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
        setCityWeatherData(data.records?.Locations[0]?.Location || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCityWeatherData();
  }, [city]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="data-container2">
      <h3>{city} 天氣資訊</h3>
      {cityWeatherData.map((location, index) => (
        <div key={index}>
          <h4>{location.LocationName}</h4>
          <p>
            溫度：
            {location.WeatherElement[0]?.Time[0]?.ElementValue[0]?.Temperature}
            °C
          </p>
          {/* 可根據需求添加更多天氣資訊 */}
        </div>
      ))}
    </div>
  );
};

export default WeatherDataCity;
