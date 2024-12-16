import React from "react";

const KnowledgePage = () => {
  return (
    <div className="content">
      <div className="knowledge-page noto-sans-sc ">
        <div className="knowledge-container">
          <h1>地震的基本概念</h1>
          <p>
            地震是地球內部能量突然釋放所造成的地面震動，這種能量的釋放通常是由地殼中的岩層斷裂或移動引起的，並在瞬間釋放大量能量，形成震波向四周傳播。
            <br />
            這些震波主要分為四種類型：P波、S波、瑞利波（Rayleigh波）和拉夫波（Love波）。
            <br />
            地震的規模用於描述地震釋放能量的大小，例如芮氏規模，而震度則衡量地面震動的強度，根據不同地區的影響程度進行評估。
          </p>
        </div>

        <div className="wave-container">
          <div className="wave-item">
            <h3>P波（主要波）</h3>
            <ul>
              <li>速度最快的地震波，是地震儀最早捕捉到的震波。</li>
              <li>
                可穿過固體與液體，其傳遞方式為壓縮與拉伸，類似彈簧被擠壓和拉伸的運動。
              </li>
              <li>P波的快速傳播特性使其成為地震預警系統的首要檢測信號。</li>
            </ul>
            <img src="https://i.imgur.com/CBkQxk2.gif" alt="P波" />
          </div>

          <div className="wave-item">
            <h3>S波（次要波）</h3>
            <ul>
              <li>傳遞速度較P波慢，但對地表的影響更大。</li>
              <li>僅能穿過固體，以剪切波的形式傳播，垂直於波的前進方向。</li>
              <li>由於振幅較大且頻率較低，S波對建築物的破壞性通常大於P波。</li>
            </ul>
            <img src="https://i.imgur.com/05kws0p.gif" alt="S波" />
          </div>

          <div className="wave-item">
            <h3>瑞利波（Rayleigh波）</h3>
            <ul>
              <li>
                瑞利波是一種表面波，以波浪形式傳播，會引起地表上下和水平的複合運動。
              </li>
              <li>
                與S波不同，瑞利波僅在地表傳遞，且運動類似水波，影響範圍局限於地表。
              </li>
              <li>
                它的破壞力集中於地表，特別是在能量集中的地區，影響更為顯著。
              </li>
            </ul>
            <img src="https://i.imgur.com/vHhYN2J.gif" alt="Rayleigh波" />
          </div>

          <div className="wave-item">
            <h3>拉夫波（Love波）</h3>
            <ul>
              <li>一種表面波，導致地面水平晃動，對建築物結構產生顯著影響。</li>
              <li>只在地表傳遞，其破壞範圍局限於震中周圍。</li>
              <li>通常造成地表的橫向位移，對基礎設施影響較大。</li>
            </ul>
            <img src="https://i.imgur.com/b1QsFzV.gif" alt="Love波" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;
