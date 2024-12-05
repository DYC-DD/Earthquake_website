### 專案架構目錄樹狀圖

```
earthquake_website/
├── docs/                      # 存放專案的相關文檔
│
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
