# Earthquake_website

此網站是一個 地震資訊查詢平台，利用交通部中央氣象署地震 API 即時獲取地震資訊，並使用 React 框架構建前端頁面。透過 Leaflet.js 顯示地震位置在地圖上的標示，並結合 GitHub Pages 部署靜態網站，~~搭配 GitHub Actions 自動更新地震資訊~~。

- **即時地震資訊**：從交通部中央氣象署地震 API 獲取最新地震資料。
- **地震地圖視覺化**：使用 Leaflet.js 顯示地震位置和震央標記。
- **資料表展示**：以列表形式顯示地震的詳細資訊。
- ~~**自動更新**：使用 GitHub Actions，自動更新地震資訊。~~

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
