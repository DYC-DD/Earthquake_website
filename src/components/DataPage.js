import React from "react";
import EarthquakeData from "./EarthquakeData";

const DataPage = ({ onAllEarthquakes }) => {
  return (
    <div style={styles.container} className="noto-sans-sc">
      <h2 style={styles.heading}>即時地震資訊</h2>
      <div>
        <EarthquakeData onAllEarthquakes={onAllEarthquakes} />
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
