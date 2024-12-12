import React from "react";

const Header = () => {
  return (
    <header style={styles.header} className="noto-sans-sc">
      <h1 style={styles.title}>地震資訊網站</h1>
      <nav style={styles.nav}>
        <a href="#home" style={styles.link}>
          首頁
        </a>
        <a href="#about" style={styles.link}>
          關於我們
        </a>
        <a href="#contact" style={styles.link}>
          聯絡我們
        </a>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#4CAF50",
    padding: "10px 20px",
    color: "white",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "26px",
  },
  nav: {
    marginTop: "10px",
  },
  link: {
    margin: "0 10px",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Header;
