import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header noto-sans-sc">
      <Link to="/" className="header-title header-link">
        地震資訊網站
      </Link>
      <nav className="header-nav">
        <Link to="/" className="header-link">
          首頁
        </Link>
        <Link to="/knowledge" className="header-link">
          地震小知識
        </Link>
        <a href="#contact" className="header-link">
          聯絡我們
        </a>
      </nav>
    </header>
  );
};

export default Header;