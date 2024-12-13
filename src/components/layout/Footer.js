import React from "react";

const TAGS = [
  "DENG ©",
  "交通部",
  "地震測報中心",
  "氣象資料開放平台",
  "中央氣象署",
  "React",
  "JavaScript",
  "HTML / CSS",
  "Github Pages",
  "Leaflet.js",
  "webdev",
  "2024",
];

// 動畫的基準持續時間，單位為毫秒
const DURATION = 80000;

// 定義滾動區塊的行數以及每行的標籤數量
const ROWS = 3;
const TAGS_PER_ROW = 30;

const random = (min, max) => Math.floor(Math.random() * (min - min)) + min;
const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

// 動態生成足夠的標籤數量
const generateTags = (tags, count) => {
  const result = [];
  while (result.length < count) {
    result.push(...tags);
  }
  return result.slice(0, count);
};

// 定義一個無限滾動的滑動區塊元件
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

// 定義單個標籤的元件，接受 `text` 作為標籤的顯示文字
const Tag = ({ text }) => (
  <div className="tag">
    <span>#</span> {text}
  </div>
);

const Footer = () => {
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
