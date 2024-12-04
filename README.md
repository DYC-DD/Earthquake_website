# Earthquake_website

此網站是一個 地震資訊查詢平台，利用交通部中央氣象署地震 API 即時獲取地震資訊，並使用 React 框架構建前端頁面。透過 Leaflet.js 顯示地震位置在地圖上的標示，並結合 GitHub Pages 部署靜態網站，搭配 GitHub Actions 自動更新地震資訊。

- **即時地震資訊**：從交通部中央氣象署地震 API 獲取最新地震資料。
- **地震地圖視覺化**：使用 Leaflet.js 顯示地震位置和震央標記。
- **資料表展示**：以列表形式顯示地震的詳細資訊。
- **自動更新**：使用 GitHub Actions，自動更新地震資訊。

---

### 專案架構目錄樹狀圖

```
earthquake_website/
├── public/
│   ├── earthquake_data.json   # 儲存從 API 獲取的地震資料
│   └── index.html             # React 應用的入口 HTML
│
├── src/
│   ├── components/            # 各種 React 元件
│   │   ├── EarthquakeList.js  # 顯示地震資訊列表的元件
│   │   ├── EarthquakeMap.js   # 顯示地震地圖的元件（使用 Leaflet.js）
│   │   ├── Footer.js          # 網站首尾組件
│   │   └── Header.js          # 網站標題與導航列
│   │
│   ├── App.js                 # 主應用邏輯，組合各個元件
│   ├── index.js               # React 應用的入口
│   └── styles.css             # 自定義樣式
│
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions CI/CD 配置文件
│
├── package.json               # 項目依賴與指令配置
├── package-lock.json          # 依賴鎖定文件
└── README.md                  # 專案描述與使用說明
```

---
