### Version

- **`1.0.0`**：地震資訊
  - `1.X.X`：( 迭代都忘了更新 )
- **`2.0.0`**：增加天氣欄位，顯示各縣市 36 小時天氣
  - `2.1.0`：增加切換縣市功能
  - `2.2.0`：增加縣市鄉鎮天氣資訊
    - `2.2.1`：style debug
    - `2.2.2`：顯示鄉鎮座標
    - `2.2.3`：debug 減少顯示資訊

---

### 專案架構目錄樹狀圖

```
earthquake_website/
├── build/                             # 打包成靜態網站
├── docs/                              # 存放專案的相關開發文檔
│
├── public/
│   ├── data/                          # json資料檔
│   ├── icons/                         # 天氣圖標
│   ├── images/                        # 圖片
│   └── index.html                     # React 應用的入口 HTML
│
├── src/
│   ├── components/                     # 各種 React 元件
│   │   ├── home/
│   │   │   ├── EarthquakeData.js       # 地震資訊
│   │   │   ├── EarthquakeDataPage.js   # 地震資訊頁面
│   │   │   ├── EarthquakeMap.js        # 地震地圖
│   │   │   ├── EarthquakeMapPage.js    # 地震地圖頁面
│   │   │   ├── WeatherData.js          # 天氣資訊
│   │   │   ├── WeatherDataPage.js      # 天氣資訊頁面
│   │   │   ├── WeatherMap.js           # 天氣地圖
│   │   │   └── WeatherMapPage.js       # 天氣地圖頁面
│   │   │
│   │   ├── layout/
│   │   │   ├── Footer.js               # 網站首尾組件
│   │   │   └── Header.js               # 網站標題與導航列
│   │   │
│   │   └── pages/
│   │       ├── ContactPage.js          # 連絡我頁面
│   │       └── KnowledgePage.js        # 地震小知識頁面
│   │
│   ├── App.js                          # 主應用邏輯，組合各個元件
│   ├── index.js                        # React 應用的入口
│   └── styles.css                      # 自定義樣式
│
├── tests/
│   ├── plot_config/                    # 繪畫地震波型 GIF
│   ├── test_api/                       # 測試 API
│   └── test_map/                       # 測試地圖
│
├── package.json                        # 項目依賴與指令配置
├── package-lock.json                   # 依賴鎖定文件
└── README.md                           # 專案描述與使用說明
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
