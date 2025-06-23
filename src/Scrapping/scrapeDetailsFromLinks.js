const puppeteer = require("puppeteer");
const fs = require("fs");

// Load the links from your saved JSON
const raw = fs.readFileSync("./devpost_hackathons.json");
const hackathonList = [...new Set(JSON.parse(raw).map((h) => h.link))]; // remove duplicates

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  const detailedHackathons = [];

  for (const link of hackathonList) {
    console.log(`🔍 Scraping: ${link}`);
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
          title: getText("h1"), // Main title
          subtitle: getText("h2") || getText("h3"), // Subtitle or short description
          deadline: getText(".value time"), // Deadline time
          prize: getText(".stats .value") || getText(".prizes .value"), // Prize amount
          tags: getAllText(".tag"), // Tags like Beginner Friendly, AI, etc.
        };
      });

      data.link = link;
      detailedHackathons.push(data);

      // Optional wait to avoid bot detection
      await new Promise((res) => setTimeout(res, 1000));
    } catch (err) {
      console.error(`❌ Failed to scrape ${link}`, err.message);
    }
  }

  fs.writeFileSync(
    "hackathon_details.json",
    JSON.stringify(detailedHackathons, null, 2)
  );
  console.log(
    `✅ Scraped ${detailedHackathons.length} hackathons and saved to hackathon_details.json`
  );

  await browser.close();
})();
