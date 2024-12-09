import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MapPage from "./components/MapPage";
import DataPage from "./components/DataPage";
import "./styles.css";

const App = () => {
  const [latestEarthquake, setLatestEarthquake] = useState(null);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <div className="map-page">
          <MapPage latestEarthquake={latestEarthquake} />
        </div>
        <div className="data-page">
          <DataPage onLatestEarthquake={setLatestEarthquake} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
