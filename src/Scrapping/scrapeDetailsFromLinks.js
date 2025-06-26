import puppeteer from "puppeteer";
import fs from "fs";
import axios from "axios";

// 🔹 DEVPOST SCRAPER
async function scrapeDevpost(page, links) {
  const results = [];
  for (const link of links) {
    console.log(`🔍 Devpost: ${link}`);
    try {
      await page.goto(link, { waitUntil: "networkidle2", timeout: 0 });
      await page.waitForSelector("h1", { timeout: 15000 });

      const data = await page.evaluate(() => {
        const getText = (selector) =>
          document.querySelector(selector)?.innerText.trim() || null;
        const getAllText = (selector) =>
          Array.from(document.querySelectorAll(selector)).map((el) =>
            el.innerText.trim()
          );
        return {
          title: getText("h1"),
          subtitle: getText("h2") || getText("h3"),
          date: getText(".value time") || getText(".submission-period"),
          prize:
            getText(".stats .value") ||
            getText(".prizes .value") ||
            getText(".prize-amount"),
          participants: getText(".participants strong") || null,
          image: document.querySelector("img")?.src || null,
          tags: getAllText(".tag"),
          link: window.location.href,
        };
      });

      results.push(data);
      await new Promise((res) => setTimeout(res, 1000)); // avoid being blocked
    } catch (err) {
      console.error(`❌ Devpost failed for ${link}:`, err.message);
    }
  }
  return results;
}

// 🔹 DEVFOLIO API SCRAPER
async function scrapeDevfolio() {
  const url = "https://api.devfolio.co/api/search/hackathons";
  const limit = 50;
  let offset = 0;
  let allHackathons = [];

  while (true) {
    const body = {
      query: "",
      filters: { status: ["open"] },
      limit,
      offset,
      sort: "recent",
    };

    try {
      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
          Origin: "https://devfolio.co",
          Referer: "https://devfolio.co",
        },
      });

      const hits = response.data.hits?.hits || [];
      if (hits.length === 0) break;

      const formatted = hits.map((hit) => {
        const h = hit._source;
        return {
          title: h.name || null,
          link: h.slug ? `https://${h.slug}.devfolio.co/` : null,
          date: `${new Date(h.starts_at).toDateString()} - ${new Date(
            h.ends_at
          ).toDateString()}`,
          prize: h.prizes?.length
            ? h.prizes.map((p) => p.name).join(", ")
            : null,
          participants: h.participants_count?.toString() || null,
          image: h.cover_img || h.hackathon_setting?.logo || null,
          tags: [
            ...(h.themes || []),
            ...(h.hackathon_setting?.site ? [h.hackathon_setting.site] : []),
          ],
        };
      });

      allHackathons.push(...formatted);
      offset += limit;
    } catch (err) {
      console.error("❌ API error:", err.message);
      break;
    }
  }

  return allHackathons;
}

// 🔹 MAIN MERGE RUNNER
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Load Devpost links from saved file
  const raw = fs.readFileSync("./open_hackathons.json");
  const devpostLinks = [...new Set(JSON.parse(raw).map((h) => h.link))];

  const devpostData = await scrapeDevpost(page, devpostLinks);
  const devfolioData = await scrapeDevfolio();

  const merged = [...devpostData, ...devfolioData];

  fs.writeFileSync("hackathonData.json", JSON.stringify(merged, null, 2));
  console.log(`📝 Saved ${merged.length} hackathons to hackathonData.json`);

  await browser.close();
})();
