// import React from "react";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import MapPage from "./components/MapPage";
// import DataPage from "./components/DataPage";
// import "./styles.css";

// const App = () => {
//   return (
//     <div className="App">
//       <Header />
//       <div className="content">
//         <div className="map-page">
//           <MapPage />
//         </div>
//         <div className="data-page">
//           <DataPage />
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default App;

// App.js
import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MapPage from "./components/MapPage";
import DataPage from "./components/DataPage";
import "./styles.css";

const App = () => {
  const [latestEarthquake, setLatestEarthquake] = useState(null);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <div className="map-page">
          {/* 將最新地震資訊經緯度傳給 MapPage */}
          <MapPage latestEarthquake={latestEarthquake} />
        </div>
        <div className="data-page">
          {/* 當 EarthquakeData 接收到最新資訊後，呼叫 onLatestEarthquake 更新上層狀態 */}
          <DataPage onLatestEarthquake={setLatestEarthquake} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
