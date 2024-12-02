import React from "react";
import EarthquakeMap from "./components/EarthquakeMap";
import "./styles.css";

const App = () => {
  return (
    <div className="App">
      <h1>地震資訊網站</h1>
      <EarthquakeMap />
    </div>
  );
};

export default App;
