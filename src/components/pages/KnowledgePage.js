import React, { useRef, useEffect } from "react";

const KnowledgePage = () => {
  const addHoverEffect = (element) => {
    const shadowRef = document.createElement("div");
    shadowRef.className = "hover-shadow";
    element.appendChild(shadowRef);

    const handleMouseMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      shadowRef.style.left = `${x}px`;
      shadowRef.style.top = `${y}px`;
    };

    const handleMouseEnter = () => shadowRef.classList.add("active");
    const handleMouseLeave = () => shadowRef.classList.remove("active");

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeChild(shadowRef);
    };
  };

  useEffect(() => {
    const hoverElements = document.querySelectorAll(".hover-effect");
    const cleanupFunctions = Array.from(hoverElements).map((element) =>
      addHoverEffect(element)
    );

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="content">
      <div className="knowledge-page noto-sans-sc ">
        <div className="knowledge-container hover-effect">
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
          <div className="wave-item hover-effect">
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

          <div className="wave-item hover-effect">
            <h3>S波（次要波）</h3>
            <ul>
              <li>傳遞速度較P波慢，但對地表的影響更大。</li>
              <li>僅能穿過固體，以剪切波的形式傳播，垂直於波的前進方向。</li>
              <li>由於振幅較大且頻率較低，S波對建築物的破壞性通常大於P波。</li>
            </ul>
            <img src="https://i.imgur.com/05kws0p.gif" alt="S波" />
          </div>

          <div className="wave-item hover-effect">
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

          <div className="wave-item hover-effect">
            <h3>拉夫波（Love波）</h3>
            <ul>
              <li>一種表面波，導致地面水平晃動，對建築物結構產生顯著影響。</li>
              <li>只在地表傳遞，其破壞範圍局限於震中周圍。</li>
              <li>通常造成地表的橫向位移，對基礎設施影響較大。</li>
            </ul>
            <img src="https://i.imgur.com/b1QsFzV.gif" alt="Love波" />
          </div>
        </div>

        <div className="knowledge-container2 hover-effect">
          <h1>地震的形成機制</h1>
          <p>
            地殼由多個板塊組成，這些板塊在地球內部熱能驅動下不斷運動，可能相撞、分離或彼此滑動，這些運動現象稱為板塊構造。
            <br />
            當板塊邊界的壓力超過岩層的承受能力時，會導致斷層破裂並釋放能量，形成地震。這些壓力可能經過數百年至數千年累積，然後在短短幾秒內釋放。
            <br />
            全球大多數地震發生在板塊邊界地區，例如太平洋火環帶，該區域是地球上地震最活躍的地帶。
            <br />
            深層地震和淺層地震的形成機制有所不同，深層地震通常與隱沒帶有關，而淺層地震多發於斷層附近。
          </p>
          <h2>台灣的板塊構造與地震特性</h2>
          <p>
            台灣位於菲律賓海板塊與歐亞大陸板塊的交界處，是全球地震活動最頻繁的區域之一。
            <br />
            菲律賓海板塊以每年約8公分的速度向西北方向擠壓歐亞板塊，這種板塊運動造成了台灣地區的地殼抬升和複雜的斷層系統。
            <br />
            台灣的主要斷層系統中，車籠埔斷層是最為人熟知的，因為它引發了1999年的921大地震，造成了重大傷亡與損失。
            <br />
            其他重要的斷層包括北部的翡翠斷層和東部的蘭陽斷層，這些斷層對周圍地區的地震活動有顯著影響。
            <br />
            台灣的地震多為淺層地震，震源深度通常小於30公里，因此震動能量能迅速傳遞至地表，對建築物和居民的影響更為直接。
          </p>
        </div>

        <div className="knowledge-container2 hover-effect">
          <h1>地震的量化及制訂</h1>
          <p>
            地震的規模和深度是描述地震強度及其影響的重要參數，透過這些數據可幫助科學家進一步評估地震造成的破壞程度和影響範圍。
            <br />
            綜合來看，地震的規模、震度和深度是評估地震威脅的重要指標，這些參數不僅決定了地震的破壞力，還能幫助災後救援與未來防震措施的制定。
          </p>
          <h2>地震規模</h2>
          <p>
            地震規模用來量化地震所釋放的能量，最常見的指標是芮氏規模（Richter
            Scale）。芮氏規模的數值以對數表示，每增加1級，地震所釋放的能量大約增加31.6倍。
            <br />
            此外，矩震級（Moment Magnitude Scale,
            Mw）是目前更現代且精確的地震規模測量標準，特別適用於較大規模的地震，能更準確地反映地震釋放的總能量。
          </p>
          <h2>震度</h2>
          <p>
            震度是用來衡量地震引起的地面震動強度的指標，主要基於人類的感受、建築物損害程度和地表反應進行分級。
            <br />
            震度反映的是局部地震影響，會受到地質條件、震源深度和震中距離的影響，因此即使地震規模相同，不同地點的震度也可能有所不同。
            <br />
            台灣採用「中央氣象署震度分級」，分為1到7級，震度越高，代表震動越強烈，破壞力也越大。
          </p>
          <h2>地震深度</h2>
          <ul>
            <li>
              淺層地震：震源深度小於70公里，這類地震的破壞力最大，能量迅速傳遞到地表，對建築物和地表影響最為顯著。
            </li>
            <li>
              中層地震：震源深度介於70到300公里之間，震動能量會在傳遞過程中衰減，因此破壞力較小，但影響範圍較廣。
            </li>
            <li>
              深層地震：震源深度大於300公里，這類地震的能量大部分被地殼吸收，對地表的影響較小，但仍可能引發局部震動。
            </li>
          </ul>
        </div>

        <div className="wave-container2">
          <div className="wave-item-left hover-effect">
            <h1>地震的預防與減災</h1>
            <p>
              地震的預防和減災措施包括地震預測技術的發展、地震預警系統的應用，以及建築抗震設計的改進。雖然科學家目前無法準確預測地震的時間和地點，但透過監測板塊活動與斷層運動可以估算高風險地區。地震預警系統利用P波的快速傳遞特性，能在破壞性S波到達之前發出警報，為人們爭取反應時間。
            </p>
            <p>
              在建築方面採用柔性結構材料和阻尼器等減震裝置的抗震建築設計，能有效降低地震對結構的影響。同時應對老舊建築進行加固，並確保適應高風險地區的需求。
            </p>
            <h2>地震躲避三步驟</h2>
            <ul>
              <li>趴下：立即趴低以降低重心，避免因震動而跌倒。</li>
              <li>
                掩護：躲在堅固的家具下方，如桌子或床架，並用手臂保護頭部。
              </li>
              <li>穩住：抓緊家具或穩固物體，保持身體穩定，等待震動結束。</li>
            </ul>
            <p>
              在選擇躲避位置時，應遠離玻璃、懸掛物和大型傾倒物，如書櫃或電器。
              <br />
              建築物內最佳的避難處包括桌子下方、牆角或承重牆旁邊，這些位置相對安全且能提供掩護。
            </p>
            <h2>地震緊急逃生包</h2>
            <ul>
              <li>食物與水：提供至少3天的糧食和飲水。</li>
              <li>急救用品：包含繃帶、消毒用品、藥品及簡易醫療工具。</li>
              <li>照明與工具：手電筒、電池、哨子及多功能工具刀。</li>
            </ul>
            <p>
              準備緊急逃生包是地震防災的重要措施，能在災後提供基本生存需求。
            </p>
            <p>
              其他可準備的物品還包括保暖衣物、隨身證件副本、現金與通訊設備，以應付各種突發狀況。此外，定期參與地震演練，熟悉避難動作與逃生路線，能有效提升應對地震的能力，減少災害帶來的損失。
            </p>
          </div>

          <div className="wave-item-right">
            <div className="wave-item-box hover-effect">
              <h1>地震的影響</h1>
              <p>
                地震的影響範圍廣泛，包括對建築物、基礎設施的破壞，以及對人類生活的深遠影響。建築物在地震波的震動下可能倒塌，尤其是未採用抗震設計的老舊建築。
                <br />
                此外高層建築在地震中可能因共振效應受到更大破壞。
              </p>
              <p>
                地震還會引發次生災害，例如海嘯、土石流與山崩。當地震發生在海底或靠近海岸時，海水可能因劇烈運動而形成毀滅性的海嘯，危害沿岸地區。地震使得地層鬆動，進一步導致土石流或山崩，特別是在降雨量大的山區。地震也可能損壞燃氣管道與電力設施，引發火災蔓延。
              </p>
              <p>
                在人類生活層面，地震會對基礎設施如道路、橋梁、供水和供電系統造成嚴重損害，進一步影響居民的日常生活。經濟損失通常難以估量，重建需要耗費大量資源。心理層面上可能因經歷重大地震而出現創傷後壓力症候群（PTSD）。
              </p>
            </div>

            <div className="wave-item-box hover-effect">
              <h1>歷史重大地震案例</h1>
              <p>
                2011年日本東北大地震、2008年中國汶川地震和2004年印尼蘇門答臘地震都是歷史上影響深遠的地震事件。這些地震不僅造成大量人員傷亡，也導致基礎設施毀壞與經濟損失，對當地社會帶來深遠影響。
              </p>
              <p>
                1999年的921大地震是台灣近代最嚴重的地震之一，規模達到7.6，造成超過2400人罹難，數萬棟建築倒塌，揭示了當時建築結構抗震能力的不足。這場災害促使政府加強建築法規，推動抗震設計與建築物補強工程，提升了建築物的耐震能力。
                <br />
                2016年的台南地震，雖規模6.4，但因老舊建築未達抗震標準，導致維冠大樓倒塌，造成多人罹難，進一步凸顯老舊建築補強與都市更新的重要性。
              </p>
              <p>
                這些地震事件不僅提醒了台灣地區地震風險的嚴重性，也促使社會各界更加重視防災工程與應變措施，降低未來地震所帶來的影響。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;
