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
import EQDataPage from "./components/home/EarthquakeDataPage";
import WXMapPage from "./components/home/WeatherMapPage";
import WXDataPage from "./components/home/WeatherDataPage";
import KnowledgePage from "./components/pages/KnowledgePage";
import ContactPage from "./components/pages/ContactPage";
import "./styles.css";

const App = () => {
  const [allEarthquakes, setAllEarthquakes] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Taiwan");

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
                  <EQDataPage onAllEarthquakes={setAllEarthquakes} />
                </div>
              </div>
            }
          />

          <Route path="/knowledge" element={<KnowledgePage />} />

          <Route
            path="/Weather"
            element={
              <div className="content">
                <div className="map-page">
                  <WXMapPage
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                  />
                </div>
                <div className="data-page">
                  <WXDataPage
                    onAllEarthquakes={setAllEarthquakes}
                    selectedCity={selectedCity}
                  />
                </div>
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
