import React from "react";
import EarthquakeMap from "./EarthquakeMap";

const MapPage = () => {
  return (
    <div>
      <h2 style={styles.heading}>即時地震地圖</h2>
      <div>
        <EarthquakeMap />
      </div>
    </div>
  );
};

const styles = {
  heading: {
    fontSize: "30px", // 設置標題文字大小
    margin: "0 0 10px 0", // 上下各添加 10px 的外距，分隔其他元素
  },
};

export default MapPage;
