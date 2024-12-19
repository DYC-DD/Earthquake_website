import React, { useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EQMapPage from "./components/home/EarthquakeMapPage";
import DataPage from "./components/home/DataPage";
import WXMapPage from "./components/home/WeatherMapPage";
import KnowledgePage from "./components/pages/KnowledgePage";
import ContactPage from "./components/pages/ContactPage";
import "./styles.css";

const App = () => {
  const [allEarthquakes, setAllEarthquakes] = useState([]);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route
            path="/"
            element={
              <div className="content">
                <div className="map-page">
                  <EQMapPage allEarthquakes={allEarthquakes} />
                </div>
                <div className="data-page">
                  <DataPage onAllEarthquakes={setAllEarthquakes} />
                </div>
              </div>
            }
          />

          <Route path="/knowledge" element={<KnowledgePage />} />

          <Route
            path="/WeatherMapPage"
            element={
              <div className="content">
                <div className="map-page">
                  <WXMapPage />
                </div>
                <div className="data-page"></div>
              </div>
            }
          />

          <Route path="/Contact" element={<ContactPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
