import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import "./styles.css";

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="map-container">
        <HomePage />
      </div>
      <Footer />
    </div>
  );
};

export default App;
