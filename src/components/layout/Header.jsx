import React from "react";
import { Link } from "react-router-dom";
import ReactGA from "react-ga4";

const Header = () => {
  const trackNavigationClick = (label) => {
    ReactGA.event({
      category: "Navigation",
      action: "Click",
      label: label,
    });
  };

  return (
    <header className="header noto-sans-sc">
      <Link
        to="/"
        className="header-title header-link"
        onClick={() => trackNavigationClick("Homepage")}
      >
        地震資訊網站
      </Link>
      <nav className="header-nav">
        <Link
          to="/"
          className="header-link"
          onClick={() => trackNavigationClick("Earthquake Info")}
        >
          地震資訊
        </Link>
        <Link
          to="/knowledge"
          className="header-link"
          onClick={() => trackNavigationClick("Knowledge")}
        >
          地震小知識
        </Link>
        <Link
          to="/Weather"
          className="header-link"
          onClick={() => trackNavigationClick("Weather Info")}
        >
          天氣資訊
        </Link>
        <Link
          to="/Contact"
          className="header-link"
          onClick={() => trackNavigationClick("Contact Us")}
        >
          聯絡我們
        </Link>
      </nav>
    </header>
  );
};

export default Header;
