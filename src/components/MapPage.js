import React from "react";
import EarthquakeMap from "./EarthquakeMap";

const MapPage = ({ recentEarthquakes }) => {
  return (
    <div>
      <h2 style={styles.heading}>即時地震地圖 (過去12小時內)</h2>
      <div>
        <EarthquakeMap recentEarthquakes={recentEarthquakes} />
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
