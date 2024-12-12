import React from "react";

const Header = () => {
  return (
    <header className="header noto-sans-sc">
      <h1 className="header-title">地震資訊網站</h1>
      <nav className="header-nav">
        <a href="#home" className="header-link">
          首頁
        </a>
        <a href="#about" className="header-link">
          關於我們
        </a>
        <a href="#contact" className="header-link">
          聯絡我們
        </a>
      </nav>
    </header>
  );
};

export default Header;
