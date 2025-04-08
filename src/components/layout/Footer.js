import React, { useEffect, useState } from "react";

const DURATION = 80000;
const ROWS = 3;
const TAGS_PER_ROW = 30;

const SHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbzAmZutkMp__VVji8GoS1tpVHCOkfvyyN9jci7Nqtqjkb3UU0lCx5Csm1e3j6cGwgSBWg/exec";

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());
const generateTags = (tags, count) => {
  const result = [];
  while (result.length < count) {
    result.push(...tags);
  }
  return result.slice(0, count);
};

const InfiniteLoopSlider = ({ children, duration, reverse = false }) => {
  return (
    <div
      className="loop-slider"
      style={{
        "--duration": `${duration}ms`,
        "--direction": reverse ? "reverse" : "normal",
      }}
    >
      <div className="inner">
        {children}
        {children}
      </div>
    </div>
  );
};

const Tag = ({ text }) => (
  <div className="tag">
    <span>#</span> {text}
  </div>
);

const Footer = () => {
  const [views, setViews] = useState(null);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(SHEETS_API_URL);
        const data = await response.json();
        setViews(data.totalViews);
      } catch (err) {
        console.error("無法取得總瀏覽數：", err);
        setViews("錯誤");
      }
    };

    fetchViews();
  }, []);

  const TAGS = [
    "交通部",
    "地震測報中心",
    views ? `Total websit visits ：${views}` : "載入中...",
    "氣象資料開放平台",
    "中央氣象署",
    "React",
    "JavaScript",
    "HTML / CSS",
    "Github Pages",
    "Leaflet.js",
    "2024",
    "DYC",
  ];

  return (
    <div className="noto-sans-sc">
      <footer className="footer">
        <div className="tag-list">
          {[...new Array(ROWS)].map((_, i) => (
            <InfiniteLoopSlider
              key={i}
              duration={random(DURATION - 5000, DURATION + 5000)}
              reverse={i % 2}
            >
              {generateTags(shuffle(TAGS), TAGS_PER_ROW).map((tag, index) => (
                <Tag text={tag} key={`${tag}-${index}`} />
              ))}
            </InfiniteLoopSlider>
          ))}
          <div className="fade" />
        </div>
      </footer>
    </div>
  );
};

export default Footer;
