import React from "react";
import EarthquakeMap from "./EarthquakeMap";

const MapPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>即時地震地圖</h2>
      <div>
        <EarthquakeMap />
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center", // 將內容置中對齊
    padding: "4px",
  },
  heading: {
    fontSize: "30px", // 設置標題文字大小
    margin: "0 0 10px 0", // 上下各添加 10px 的外距，分隔其他元素
  },
};

export default MapPage;
