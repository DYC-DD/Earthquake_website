import React from "react";

const Header = () => {
  return (
    <header className="header noto-sans-sc">
      <a href="/public/index.html" className="header-title header-link">
        地震資訊網站
      </a>
      <nav className="header-nav">
        <a href="/public/index.html" className="header-link">
          首頁
        </a>
        <a href="#about" className="header-link">
          地震小知識
        </a>
        <a href="#contact" className="header-link">
          聯絡我們
        </a>
      </nav>
    </header>
  );
};

export default Header;
