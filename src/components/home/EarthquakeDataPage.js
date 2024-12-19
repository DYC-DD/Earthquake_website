import React from "react";
import EarthquakeData from "./EarthquakeData";

const EarthquakeDataPage = ({ onAllEarthquakes }) => {
  return (
    <div className="noto-sans-sc">
      <h2 className="data-heading">即時地震資訊</h2>
      <div>
        <EarthquakeData onAllEarthquakes={onAllEarthquakes} />
      </div>
    </div>
  );
};

export default EarthquakeDataPage;
