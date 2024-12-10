import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MapPage from "./components/MapPage";
import DataPage from "./components/DataPage";
import "./styles.css";

const App = () => {
  // 將最新12小時內的地震列表存於狀態中
  const [recentEarthquakes, setRecentEarthquakes] = useState([]);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <div className="map-page">
          <MapPage recentEarthquakes={recentEarthquakes} />
        </div>
        <div className="data-page">
          <DataPage onRecentEarthquakes={setRecentEarthquakes} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
