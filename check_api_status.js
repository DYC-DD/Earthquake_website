const fetch = require("node-fetch");

const apiKey = process.env.CWA_API_KEY;
const urlsRaw = process.env.CWA_API_URLS;

if (!apiKey || !urlsRaw) {
  console.error("❌ 必須設定 CWA_API_KEY 和 CWA_API_URLS");
  process.exit(1);
}

const urls = urlsRaw.split(",");

const checkAPI = async (url) => {
  try {
    const response = await fetch(`${url}?Authorization=${apiKey}&format=JSON`);
    if (!response.ok) throw new Error(`HTTP Status: ${response.status}`);
    const json = await response.json();
    if (!json.records) throw new Error("Unexpected response format");
    console.log(`✅ ${url} OK`);
  } catch (err) {
    console.error(`❌ ${url} FAILED:`, err.message);
    process.exit(1); // 發生錯誤就中止 → GitHub Action 觸發寄信
  }
};

(async () => {
  for (const url of urls) {
    await checkAPI(url);
  }
})();
