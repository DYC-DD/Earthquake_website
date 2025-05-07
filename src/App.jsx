import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ReactGA from "react-ga4";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EQMapPage from "./components/home/EarthquakeMapPage";
import EQDataPage from "./components/home/EarthquakeDataPage";
import WXMapPage from "./components/home/WeatherMapPage";
import WXDataPage from "./components/home/WeatherDataPage";
import KnowledgePage from "./components/pages/KnowledgePage";
import ContactPage from "./components/pages/ContactPage";
import "./styles.css";

// 初始化 Google Analytics
const TRACKING_ID = "G-ME96EL8WZC";
ReactGA.initialize(TRACKING_ID);

// 自訂 Hook 用於追蹤頁面切換
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
};

// 新增組件以簡化 Hook 整合
const PageTracker = () => {
  usePageTracking();
  return null;
};

const App = () => {
  const [allEarthquakes, setAllEarthquakes] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Taiwan");

  return (
    <Router>
      <PageTracker />
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
                <div className="map-page2">
                  <WXMapPage
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                  />
                </div>
                <div className="data-page2">
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
