// import React from "react";
// import EarthquakeData from "./EarthquakeData";

// const DataPage = () => {
//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>即時地震資訊</h2>
//       <div>
//         <EarthquakeData />
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     textAlign: "center", // 將內容置中對齊
//     padding: "20px",
//   },
//   heading: {
//     fontSize: "30px", // 設置標題文字大小
//     margin: "0 0 10px 0", // 上下各添加 10px 的外距，分隔其他元素
//   },
// };

// export default DataPage;

// DataPage.js
import React from "react";
import EarthquakeData from "./EarthquakeData";

const DataPage = ({ onLatestEarthquake }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>即時地震資訊</h2>
      <div>
        {/* 將父元件的 onLatestEarthquake 傳給 EarthquakeData */}
        <EarthquakeData onLatestEarthquake={onLatestEarthquake} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "30px",
    margin: "0 0 10px 0",
  },
};

export default DataPage;
