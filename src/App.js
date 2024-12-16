import React, { useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MapPage from "./components/home/MapPage";
import DataPage from "./components/home/DataPage";
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
                  <MapPage allEarthquakes={allEarthquakes} />
                </div>
                <div className="data-page">
                  <DataPage onAllEarthquakes={setAllEarthquakes} />
                </div>
              </div>
            }
          />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/Contact" element={<ContactPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
