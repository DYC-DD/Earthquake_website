import React from "react";
import EarthquakeData from "./EarthquakeData";

const DataPage = ({ onRecentEarthquakes }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>即時地震資訊</h2>
      <div>
        <EarthquakeData onRecentEarthquakes={onRecentEarthquakes} />
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
