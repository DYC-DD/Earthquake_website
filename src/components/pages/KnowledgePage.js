import React from "react";
// import "./KnowledgePage.css"; // 可選：新增樣式

const KnowledgePage = () => {
  return (
    <div className="knowledge-container">
      <h2 className="knowledge-heading">地震小知識</h2>
      <p>
        地震是由地殼快速釋放能量，產生震波而引起的自然現象。以下是一些與地震相關的常識：
      </p>
      <ul>
        <li>地震的強度通常以震級（如里氏規模）來表示。</li>
        <li>震源深度可影響地震的破壞程度。</li>
        <li>震央是地震發生的地點，通常以經緯度標示。</li>
        <li>地震後可能伴隨餘震，請注意安全。</li>
      </ul>
    </div>
  );
};

export default KnowledgePage;
