import React, { useState, useEffect } from "react";
import EarthquakeMap from "./EarthquakeMap";
import ReactGA from "react-ga4";

const EarthquakeMapPage = ({ allEarthquakes }) => {
  const [selectedHours, setSelectedHours] = useState(12); // 預設顯示12小時
  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);

  useEffect(() => {
    filterEarthquakes();
  }, [allEarthquakes, selectedHours]);

  // 過濾地震資料
  const filterEarthquakes = () => {
    if (allEarthquakes.length === 0) return;

    const latestTime = allEarthquakes[0]
      ? new Date(allEarthquakes[0].originTime)
      : null;

    if (!latestTime) return;

    const timeRangeAgo = new Date(
      latestTime.getTime() - selectedHours * 60 * 60 * 1000
    );

    const filtered = allEarthquakes.filter((eq) => {
      const eqTime = new Date(eq.originTime);
      return eqTime >= timeRangeAgo && eqTime <= latestTime;
    });

    setFilteredEarthquakes(filtered);
  };

  // 處理 select 更改事件並追蹤
  const handleSelectChange = (e) => {
    const hours = Number(e.target.value);
    setSelectedHours(hours);

    // 發送 Google Analytics 事件
    ReactGA.event({
      category: "Earthquake",
      action: "Select Time Range",
      label: `Selected ${hours} Hours`,
    });
  };

  return (
    <div className="noto-sans-sc">
      <h2 className="map-heading">即時地震地圖</h2>

      <EarthquakeMap recentEarthquakes={filteredEarthquakes} />

      <div className="controls">
        顯示範圍 &#40;自最新一筆資料起算&#41;：
        <select value={selectedHours} onChange={handleSelectChange}>
          <option value={12}>過去12小時</option>
          <option value={24}>過去24小時</option>
          <option value={48}>過去48小時</option>
          <option value={72}>過去72小時</option>
          <option value={96}>過去96小時</option>
          <option value={1000}>近期所有資訊</option>
        </select>
      </div>

      <div className="text-with-dot">
        <span className="green-dot"></span>
        <p>：小區域有感地震</p>
        <span className="red-dot"></span>
        <p>：顯著有感地震</p>
      </div>
    </div>
  );
};

export default EarthquakeMapPage;
