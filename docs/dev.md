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

### 交通部中央氣象署 API

1. [交通部中央氣象署](https://www.cwa.gov.tw/V8/C/)

2. [氣象資料開放平台](https://opendata.cwa.gov.tw/index)

- **Tag**

  - **地震資訊**

    - `EarthquakeNo`: 地震編號。
    - `Web`: 報告的網頁連結。
    - `OriginTime`: 地震發生時間。
    - `FocalDepth`: 地震深度。
    - `Epicenter`
      - `Location`: 震央地點。
    - `EarthquakeMagnitude`
      - `MagnitudeValue`: 地震芮氏規模值。

  - **資訊標籤**

    - `EarthquakeNo`: 地震編號。
    - `OriginTime`: 地震發生時間。
    - `Epicenter`
      - `EpicenterLatitude`: 震央的緯度。
      - `EpicenterLongitude`: 震央的經度。
    - `EarthquakeMagnitude`
      - `MagnitudeValue`: 地震芮氏規模值。

- **Requests**

  - **限制**
    - 24 (H) / 20000 (Times) = 4.32 (S)
    - 24 (H) / 2 (GB)
  - **估計**
    - 86400 (S) / 5 (S) = 17280 (次)
    - 17280 (次) \* 60 (KB) = 1036800 (KB) ≈ 0.989 (GB)

---

### Dev

`npm run build`：打包成成靜態檔案。  
`npm run deploy`：部署到 GitHub Pages。

- 地震

  - Wave GIF：[網站](https://imgur.com/a/O7Jq0Hy)
    - [S wave](https://i.imgur.com/05kws0p.gif)
    - [P wave](https://i.imgur.com/CBkQxk2.gif)
    - [Love wave](https://i.imgur.com/b1QsFzV.gif)
    - [Rayleigh wave](https://i.imgur.com/vHhYN2J.gif)

- 天氣

  - 台灣縣市邊界座標 GeoJSON：[網站](https://github.com/ronnywang/twgeojson)

    - `twcounty2010.json`：縣市界圖(原始精度)，共 22 縣市
    - 透過 QGIS 細修與 Leaflet.js 的誤差。

    - 台灣各縣市中心點座標（經緯度）

      | 縣市名稱 | 中心點經度 (Longitude) | 中心點緯度 (Latitude) |
      | -------- | ---------------------- | --------------------- |
      | 台北市   | 121.5598               | 25.0911               |
      | 新北市   | 121.6739               | 25.0108               |
      | 桃園市   | 121.2168               | 24.9376               |
      | 台中市   | 120.6736               | 24.1477               |
      | 台南市   | 120.2270               | 23.1378               |
      | 高雄市   | 120.6660               | 23.0109               |
      | 基隆市   | 121.7419               | 25.1221               |
      | 新竹市   | 120.9647               | 24.8039               |
      | 新竹縣   | 121.1252               | 24.7033               |
      | 苗栗縣   | 120.9417               | 24.4893               |
      | 彰化縣   | 120.4818               | 23.9929               |
      | 南投縣   | 120.9876               | 23.8388               |
      | 雲林縣   | 120.3897               | 23.7559               |
      | 嘉義縣   | 120.5740               | 23.4589               |
      | 嘉義市   | 120.4473               | 23.4801               |
      | 屏東縣   | 120.5415               | 22.5519               |
      | 宜蘭縣   | 121.7195               | 24.6929               |
      | 花蓮縣   | 121.3542               | 23.7569               |
      | 台東縣   | 121.1132               | 22.7646               |
      | 澎湖縣   | 119.6151               | 23.5655               |
      | 金門縣   | 118.3171               | 24.4321               |
      | 連江縣   | 119.5397               | 26.1974               |

    - 天氣對照表：[網站](https://www.cwa.gov.tw/V8/C/K/Weather_Icon.html?utm_source=chatgpt.com)
