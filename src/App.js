import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MapPage from "./components/MapPage";
import "./styles.css";

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="map-page">
        <MapPage />
      </div>
      <Footer />
    </div>
  );
};

export default App;
