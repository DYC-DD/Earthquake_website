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

// fetch 包裝：加上 timeout 限制（5秒）
const fetchWithTimeout = (url, options = {}, timeout = 5000) =>
  Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("⏰ 請求逾時（Timeout 5 秒）")),
        timeout
      )
    ),
  ]);

let hasError = false;

const checkAPI = async (url) => {
  try {
    const fullUrl = `${url}?Authorization=${apiKey}&format=JSON`;
    console.log(`[檢查中] ${fullUrl}`);

    const response = await fetchWithTimeout(fullUrl);

    if (!response.ok) {
      throw new Error(`HTTP Status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.records || Object.keys(json.records).length === 0) {
      throw new Error("⚠️ API 回傳格式異常：records 欄位為空或缺失");
    }

    console.log(`✅ [${getTaiwanTimeString()}] ${url} 正常`);
  } catch (err) {
    console.error(`❌ [${getTaiwanTimeString()}] ${url} 失敗`);
    console.error(`原因：${err.message}`);
    hasError = true;
  }
};

// 檢查所有 API，最後再決定是否結束
(async () => {
  for (const url of urls) {
    await checkAPI(url);
  }
  if (hasError) process.exit(1);
})();
