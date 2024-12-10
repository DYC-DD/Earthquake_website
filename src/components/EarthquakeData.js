import React, { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";

const EarthquakeData = ({ onRecentEarthquakes }) => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarthquakeData = async () => {
    const baseUrl1 =
      "https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0016-001";
    const baseUrl2 =
      "https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001";

    const params = new URLSearchParams({
      Authorization: "CWA-8BD90424-B8CA-46C4-A974-633DC4E1502D",
      format: "JSON",
    });

    const url1 = `${baseUrl1}?${params.toString()}`;
    const url2 = `${baseUrl2}?${params.toString()}`;

    try {
      const [response1, response2] = await Promise.all([
        fetch(url1),
        fetch(url2),
      ]);
      if (!response1.ok || !response2.ok) {
        throw new Error(
          `請求失敗 HTTP 狀態碼：${response1.status} 和 ${response2.status}`
        );
      }

      const data1 = await response1.json();
      const data2 = await response2.json();

      const earthquakeList1 = data1.records?.Earthquake || [];
      const earthquakeList2 = data2.records?.Earthquake || [];

      const combinedList = [...earthquakeList1, ...earthquakeList2];
      // 按照時間排序，最新在最前面
      combinedList.sort((a, b) => {
        const timeA = new Date(
          a.EarthquakeInfo?.OriginTime || "1970-01-01 00:00:00"
        );
        const timeB = new Date(
          b.EarthquakeInfo?.OriginTime || "1970-01-01 00:00:00"
        );
        return timeB - timeA;
      });

      if (!isEqual(combinedList, earthquakes)) {
        setEarthquakes(combinedList);

        if (combinedList.length > 0) {
          // 最新地震事件
          const latestEq = combinedList[0];
          const latestTime = new Date(latestEq.EarthquakeInfo?.OriginTime);

          // 計算_小時前的時間點
          const hoursToFetch = 24;
          const twelveHoursAgo = new Date(
            latestTime.getTime() - hoursToFetch * 60 * 60 * 1000
          );

          // 過濾出_小時內的地震
          const recentEarthquakes = combinedList.filter((eq) => {
            const eqTime = new Date(eq.EarthquakeInfo?.OriginTime);
            return eqTime >= twelveHoursAgo && eqTime <= latestTime;
          });

          // 將_小時內的地震資料回呼給父元件
          // 每筆資料都包含 latitude, longitude, magnitude, time 等資訊方便地圖使用
          const formattedEQs = recentEarthquakes.map((eq) => {
            const epicenter = eq.EarthquakeInfo?.Epicenter || {};
            const latitude = epicenter.EpicenterLatitude;
            const longitude = epicenter.EpicenterLongitude;
            const magnitude =
              eq.EarthquakeInfo?.EarthquakeMagnitude?.MagnitudeValue;
            const originTime = eq.EarthquakeInfo?.OriginTime;
            return { latitude, longitude, magnitude, originTime };
          });

          if (onRecentEarthquakes) {
            onRecentEarthquakes(formattedEQs);
          }
        }
      }

      setError(null);
    } catch (error) {
      console.error("請求出錯：", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakeData();
    const interval = setInterval(() => {
      fetchEarthquakeData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>加載中...</div>;
  }

  if (error) {
    return <div>發生錯誤：{error.message}</div>;
  }

  return (
    <div className="data-container">
      {earthquakes.map((eq, index) => {
        const earthquakeInfo = eq.EarthquakeInfo || {};
        const originTime = earthquakeInfo.OriginTime || "無資料";
        const magnitude =
          earthquakeInfo.EarthquakeMagnitude?.MagnitudeValue || "無資料";
        const depth = earthquakeInfo.FocalDepth || "無資料";
        const epicenter = earthquakeInfo.Epicenter || {};
        const location = epicenter.Location || "無資料";
        const latitude = epicenter.EpicenterLatitude || "無資料";
        const longitude = epicenter.EpicenterLongitude || "無資料";

        return (
          <div key={index}>
            <p>地震發生時間：{originTime}</p>
            <p>地震規模：{magnitude}</p>
            <p>震源深度：{depth} 公里</p>
            <p>震央位置：{location}</p>
            <p>震央經度：{longitude}</p>
            <p>震央緯度：{latitude}</p>
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default EarthquakeData;
