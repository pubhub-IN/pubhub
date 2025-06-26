import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  const url = "https://devpost.com/hackathons?status[]=open";
  console.log(`🔄 Opening: ${url}`);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  // 👇 Smart scroll: stop when no new tiles are added
  let lastCount = 0;
  let attempts = 0;
  const maxAttempts = 12;

  while (attempts < maxAttempts) {
    const currentCount = await page.$$eval(
      ".hackathon-tile",
      (els) => els.length
    );
    console.log(`🔎 Found ${currentCount} hackathons so far...`);

    if (currentCount === lastCount) {
      console.log("✅ No more hackathons loaded. Stopping scroll.");
      break;
    }

    lastCount = currentCount;

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 2500)); // wait for lazy content
    attempts++;
  }

  // 👇 Scrape all visible tiles
  const hackathons = await page.evaluate(() => {
    const cards = document.querySelectorAll(".hackathon-tile");

    return Array.from(cards).map((card) => {
      const title = card.querySelector("h3")?.innerText.trim();
      const link = card.querySelector("a")?.href;
      const image = card.querySelector("img")?.src;
      const date = card.querySelector(".submission-period")?.innerText.trim();
      const prize = card.querySelector(".prize-amount")?.innerText.trim();
      const participants = card
        .querySelector(".participants strong")
        ?.innerText.trim();
      const tags = Array.from(
        card.querySelectorAll(".themes .theme-label")
      ).map((tag) => tag.innerText.trim());

      return { title, link, date, prize, participants, image, tags };
    });
  });

  console.log(`✅ Total ongoing hackathons scraped: ${hackathons.length}`);
  fs.writeFileSync("open_hackathons.json", JSON.stringify(hackathons, null, 2));

  await browser.close();
})();
