import React from "react";

// 定義標籤文字內容的常量陣列，模擬程式開發相關的熱門技術
const TAGS = [
  "交通部中央氣象署",
  "地震測報中心",
  "JavaScript",
  "Typescript",
  "Tailwind",
  "React",
  "Next.js",
  "Gatsby",
  "UI/UX",
  "SVG",
  "animation",
  "webdev",
];

// 動畫的基準持續時間，單位為毫秒
const DURATION = 80000;

// 定義滾動區塊的行數以及每行的標籤數量
const ROWS = 3;
const TAGS_PER_ROW = 30;

// 工具函數：生成指定範圍內的隨機整數
const random = (min, max) => Math.floor(Math.random() * (min - min)) + min;

// 工具函數：將陣列隨機打亂，返回新的隨機排列
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

// 頁尾元件
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
