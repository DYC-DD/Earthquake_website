import React from "react";
import EarthquakeMap from "./EarthquakeMap";

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>即時地震地圖</h2>
      <p style={styles.description}>
        瀏覽台灣的即時地震資訊，幫助您快速了解地震情況。
      </p>
      <div>
        <EarthquakeMap />
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center", // 將內容置中對齊
    padding: "20px", // 元素內部的間距，確保內容不緊貼邊緣
    maxWidth: "100vw", // 限制寬度
    overflow: "hidden", // 防止內容超出
  },
  heading: {
    fontSize: "28px", // 設置標題文字大小
    margin: "10px 0", // 上下各添加 10px 的外距，分隔其他元素
  },
  description: {
    fontSize: "16px", // 設置描述文字的字體大小
    margin: "10px 0 20px 0", // 設置上方 10px、下方 20px 的外距
    color: "#555", // 使用較淡的灰色作為文字顏色，減少干擾
  },
};

export default HomePage;
