// Render OG image: node scripts/og/render.mjs  → public/assets/og.png (1200x630) + og-square.png (1080x1080)
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("/opt/node-tools/node_modules/playwright")); }
const browser = await chromium.launch();
const url = pathToFileURL(resolve("scripts/og/og.html")).href;
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" }); await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/assets/og.png", type: "png" });
const sq = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
await sq.goto(url + "?square", { waitUntil: "networkidle" });
await sq.addStyleTag({ content: `body{width:1080px;height:1080px} .wrap{grid-template-columns:1fr;align-content:center;gap:36px;padding:72px} h1{font-size:72px} p{font-size:30px;max-width:900px} .side{grid-template-columns:1fr 1fr;align-items:stretch} .mentor{align-self:center}` });
await sq.evaluate(() => document.fonts.ready);
await sq.screenshot({ path: "public/assets/og-square.png", type: "png" });
await browser.close();
console.log("og.png + og-square.png dijana");
