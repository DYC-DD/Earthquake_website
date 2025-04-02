const fetch = require("node-fetch");

const apiKey = process.env.CWA_API_KEY;
const urlsRaw = process.env.CWA_API_URLS;

if (!apiKey || !urlsRaw) {
  console.error("❌ 必須設定 CWA_API_KEY 和 CWA_API_URLS");
  process.exit(1);
}

const urls = urlsRaw.split(",");

const getTaiwanTimeString = () => {
  const now = new Date();
  return now.toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hour12: false,
  });
};

// 單一 API 檢查
const checkAPI = async (url) => {
  try {
    const fullUrl = `${url}?Authorization=${apiKey}&format=JSON`;
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP Status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.records) {
      throw new Error("⚠️ API 回傳格式異常：缺少 records 欄位");
    }

    console.log(`✅ [${getTaiwanTimeString()}] ${url} 正常`);
  } catch (err) {
    console.error(`❌ [${getTaiwanTimeString()}] ${url} 失敗`);
    console.error(`原因：${err.message}`);
    process.exit(1);
  }
};

// 依序檢查每個 API
(async () => {
  for (const url of urls) {
    await checkAPI(url);
  }
})();
