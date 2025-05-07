import React, { useEffect, useRef } from "react";

const FuzzyText = ({
  children,
  fontSize = "clamp(5rem, 10vw, 10rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  vertical = false, // 新增：控制是否垂直排列文字
}) => {
  // 使用 useRef 取得 canvas 元素參考
  const canvasRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 初始化函式，負責字體載入、尺寸計算與動畫繪製
    const init = async () => {
      // 等待所有字體載入完成
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isCancelled) return;

      // 取得 canvas 2D 繪圖上下文
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 計算使用的字體家族，若設定為 inherit 則取得元素本身樣式
      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
          : fontFamily;

      // 設定字體大小字串，並計算實際數值 (方便後續使用)
      const fontSizeStr =
        typeof fontSize === "number" ? `${fontSize}px` : fontSize;
      let numericFontSize;
      if (typeof fontSize === "number") {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement("span");
        temp.style.fontSize = fontSize;
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        numericFontSize = parseFloat(computedSize);
        document.body.removeChild(temp);
      }

      // 取得要繪製的文字內容
      // 若 vertical 為 true，則將文字拆成陣列 (每個字為一個元素)
      const text = React.Children.toArray(children).join("");
      const lines = vertical ? text.split("") : [text];

      // 建立離螢幕的 canvas 用於測量文字尺寸與繪製原始畫面
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";

      // 計算每一行的尺寸資訊，並找出最大寬度與總高度
      let maxLineWidth = 0;
      const lineMetrics = lines.map((line) => {
        // 透過 measureText 取得文字尺寸資料
        const metrics = offCtx.measureText(line);
        const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
        const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
        const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
        const actualDescent =
          metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;
        const lineWidth = Math.ceil(actualLeft + actualRight);
        const lineHeight = Math.ceil(actualAscent + actualDescent);
        if (lineWidth > maxLineWidth) maxLineWidth = lineWidth;
        return {
          actualLeft,
          actualAscent,
          lineHeight,
          lineWidth,
          actualRight,
          actualDescent,
        };
      });

      // 設定離螢幕 canvas 的寬度與高度
      const extraWidthBuffer = 10;
      const textBoundingWidth = maxLineWidth;
      // 總高度為所有行高度的總和
      const totalTextHeight = lineMetrics.reduce(
        (sum, metric) => sum + metric.lineHeight,
        0
      );
      const offscreenWidth = textBoundingWidth + extraWidthBuffer;
      offscreen.width = offscreenWidth;
      offscreen.height = totalTextHeight;

      // 在離螢幕 canvas 上逐行繪製文字
      let currentY = 0;
      lines.forEach((line, index) => {
        const metrics = lineMetrics[index];
        // 計算 x offset：利用額外的寬度緩衝區，並補償左側空白
        const xOffset = extraWidthBuffer / 2 - metrics.actualLeft;
        // 計算 y offset：當前行的起始位置加上上升量
        const yOffset = currentY + metrics.actualAscent;
        offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
        offCtx.textBaseline = "alphabetic";
        offCtx.fillStyle = color;
        offCtx.fillText(line, xOffset, yOffset);
        // 累加行高，更新下一行的 y 軸起始位置
        currentY += metrics.lineHeight;
      });

      // 設定主 canvas 的邊距與尺寸
      const horizontalMargin = 50;
      const verticalMargin = 0;
      canvas.width = offscreenWidth + horizontalMargin * 2;
      canvas.height = totalTextHeight + verticalMargin * 2;
      // 將繪圖上下文平移以考慮邊距
      ctx.translate(horizontalMargin, verticalMargin);

      // 設定互動區域（用於滑鼠事件）
      const interactiveLeft = horizontalMargin + extraWidthBuffer / 2;
      const interactiveTop = verticalMargin;
      const interactiveRight = interactiveLeft + textBoundingWidth;
      const interactiveBottom = interactiveTop + totalTextHeight;

      let isHovering = false;
      const fuzzRange = 30;

      // 動畫函式：逐行模糊效果
      const run = () => {
        if (isCancelled) return;
        ctx.clearRect(
          -fuzzRange,
          -fuzzRange,
          offscreenWidth + 2 * fuzzRange,
          totalTextHeight + 2 * fuzzRange
        );
        const intensity = isHovering ? hoverIntensity : baseIntensity;
        // 每一個像素列應用隨機偏移量，達到模糊效果
        for (let j = 0; j < totalTextHeight; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          ctx.drawImage(
            offscreen,
            0,
            j,
            offscreenWidth,
            1,
            dx,
            j,
            offscreenWidth,
            1
          );
        }
        animationFrameId = window.requestAnimationFrame(run);
      };

      run();

      // 判斷滑鼠是否在互動區域內
      const isInsideTextArea = (x, y) => {
        return (
          x >= interactiveLeft &&
          x <= interactiveRight &&
          y >= interactiveTop &&
          y <= interactiveBottom
        );
      };

      // 處理滑鼠移動事件
      const handleMouseMove = (e) => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      // 處理滑鼠離開事件
      const handleMouseLeave = () => {
        isHovering = false;
      };

      // 處理觸控移動事件
      const handleTouchMove = (e) => {
        if (!enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        isHovering = isInsideTextArea(x, y);
      };

      // 處理觸控結束事件
      const handleTouchEnd = () => {
        isHovering = false;
      };

      // 若啟用滑鼠懸停效果則綁定相關事件
      if (enableHover) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        canvas.addEventListener("touchend", handleTouchEnd);
      }

      // 定義清理函式，元件卸載時移除事件與取消動畫
      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId);
        if (enableHover) {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseleave", handleMouseLeave);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
        }
      };

      // 將清理函式掛載到 canvas 方便卸載時呼叫
      canvas.cleanupFuzzyText = cleanup;
    };

    init();

    // 在元件卸載時執行清理動作
    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas && canvas.cleanupFuzzyText) {
        canvas.cleanupFuzzyText();
      }
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
    vertical, // 當 vertical 改變時重新初始化
  ]);

  // 回傳繪製文字的 canvas 元素
  return <canvas ref={canvasRef} />;
};

export default FuzzyText;
