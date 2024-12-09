import React from "react";
import EarthquakeMap from "./EarthquakeMap";

const MapPage = ({ latestEarthquake }) => {
  return (
    <div>
      <h2 style={styles.heading}>即時地震地圖</h2>
      <div>
        <EarthquakeMap latestEarthquake={latestEarthquake} />
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
