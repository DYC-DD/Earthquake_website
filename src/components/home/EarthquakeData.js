import React, { useState, useEffect, useCallback } from "react";
import isEqual from "lodash/isEqual";
import ReactGA from "react-ga4";

// 資料顯示元件 (純粹顯示地震資料，不處理動畫)
const EarthquakeDataDisplay = React.memo(({ earthquakes }) => {
  const formatLocation = (location) => {
    if (!location) return "無資料";
    return location.replace("(位於", "<br/>(位於");
  };

  // 點擊 WebLink 事件處理
  const handleWebLinkClick = (earthquakeNo, webLink) => {
    ReactGA.event({
      category: "Earthquake",
      action: "Click WebLink (Data)",
      label: `EarthquakeNo: ${earthquakeNo}`,
      value: webLink,
    });
  };

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
        const earthquakeNo = eq.EarthquakeNo || "無資料";
        const webLink = eq.Web || "無資料";

        return (
          <div key={index}>
            <p>地震編號：{earthquakeNo}</p>
            <p>地震發生時間：{originTime}</p>
            <p>地震規模：{magnitude}</p>
            <p>震源深度：{depth} 公里</p>
            <p
              dangerouslySetInnerHTML={{
                __html: `震央位置：${formatLocation(location)}`,
              }}
            ></p>
            {eq.Web ? (
              <a
                href={eq.Web}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWebLinkClick(earthquakeNo, eq.Web)}
              >
                點此查看詳細報告
              </a>
            ) : (
              webLink
            )}
            <hr />
          </div>
        );
      })}
    </div>
  );
});

// 資料取得元件 (純粹專注於資料抓取與更新)
const EarthquakeData = ({ onAllEarthquakes }) => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarthquakeData = useCallback(async () => {
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

      const taggedList1 = earthquakeList1.map((eq) => ({
        ...eq,
        source: "url1",
      }));
      const taggedList2 = earthquakeList2.map((eq) => ({
        ...eq,
        source: "url2",
      }));

      const combinedList = [...taggedList1, ...taggedList2];
      // 按時間降序排序，最新在最前面
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

        // 將所有取得的地震資料轉換為標準化結構，並全部傳回給 App
        const formattedEQs = combinedList.map((eq) => {
          const epicenter = eq.EarthquakeInfo?.Epicenter || {};
          const latitude = epicenter.EpicenterLatitude;
          const longitude = epicenter.EpicenterLongitude;
          const magnitude =
            eq.EarthquakeInfo?.EarthquakeMagnitude?.MagnitudeValue;
          const originTime = eq.EarthquakeInfo?.OriginTime;
          const earthquakeNo = eq.EarthquakeNo;
          const webLink = eq.Web;

          return {
            latitude,
            longitude,
            magnitude,
            originTime,
            earthquakeNo,
            webLink,
            source: eq.source,
          };
        });

        if (onAllEarthquakes) {
          onAllEarthquakes(formattedEQs);
        }
      }

      setError(null);
    } catch (error) {
      console.error("請求出錯：", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [earthquakes, onAllEarthquakes]);

  useEffect(() => {
    // 首次加載數據
    fetchEarthquakeData();
    // 定時更新
    const interval = setInterval(() => {
      fetchEarthquakeData();
    }, 5000); // 每_毫秒更新(5秒)

    return () => clearInterval(interval);
  }, [fetchEarthquakeData]);

  if (loading) {
    return <div>加載中...</div>;
  }

  if (error) {
    return <div>發生錯誤：{error.message}</div>;
  }

  // 將資料顯示與元件內部分離，以減少動畫區塊受到影響
  return <EarthquakeDataDisplay earthquakes={earthquakes} />;
};

export default EarthquakeData;
