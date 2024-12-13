import React, { useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MapPage from "./components/home/MapPage";
import DataPage from "./components/home/DataPage";
import "./styles.css";

const App = () => {
  const [allEarthquakes, setAllEarthquakes] = useState([]);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <div className="map-page">
          <MapPage allEarthquakes={allEarthquakes} />
        </div>
        <div className="data-page">
          <DataPage onAllEarthquakes={setAllEarthquakes} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
