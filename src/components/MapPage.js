import React, { useState, useEffect } from "react";
import EarthquakeMap from "./EarthquakeMap";

const MapPage = ({ allEarthquakes }) => {
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

  return (
    <div>
      <h2 style={styles.heading}>即時地震地圖</h2>
      <EarthquakeMap recentEarthquakes={filteredEarthquakes} />
      <div className="controls">
        {/* 下拉選單選擇時間範圍 */}
        顯示範圍：
        <select
          value={selectedHours}
          onChange={(e) => setSelectedHours(Number(e.target.value))}
        >
          <option value={12}>過去12小時</option>
          <option value={24}>過去24小時</option>
          <option value={36}>過去36小時</option>
          <option value={48}>過去48小時</option>
          <option value={60}>過去60小時</option>
          <option value={72}>過去72小時</option>
          <option value={84}>過去84小時</option>
          <option value={96}>過去96小時</option>
          <option value={1000}>過去30比資訊</option>
        </select>
      </div>
    </div>
  );
};

const styles = {
  heading: {
    fontSize: "30px",
    margin: "0 0 10px 0",
  },
};

export default MapPage;
