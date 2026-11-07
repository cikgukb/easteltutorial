// Render OG image daripada scripts/og/og.html → public/assets/og.jpg (1200x630) + og-square.jpg (1080x1080)
// Guna: node scripts/og/render.mjs [--html scripts/og/og.html] [--out public/assets] [--quality 82] [--no-square]
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { statSync, mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("/opt/node-tools/node_modules/playwright")); }

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const html = resolve(arg("--html", "scripts/og/og.html"));
const out = arg("--out", "public/assets");
let quality = Number(arg("--quality", 82));
const square = !process.argv.includes("--no-square");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const url = pathToFileURL(html).href;
async function shot(path, vp, extraCss) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  if (extraCss) await page.addStyleTag({ content: extraCss });
  await page.evaluate(() => document.fonts.ready);
  let q = quality;
  for (;;) {
    await page.screenshot({ path, type: "jpeg", quality: q });
    const kb = statSync(path).size / 1024;
    if (kb < 290 || q <= 60) { console.log(`${path}: ${kb.toFixed(0)} KB (q=${q})`); break; }
    q -= 6; // WhatsApp: pastikan < 300 KB
  }
  await page.close();
}
await shot(`${out}/og.jpg`, { width: 1200, height: 630 });
if (square) await shot(`${out}/og-square.jpg`, { width: 1080, height: 1080 },
  `body{width:1080px;height:1080px} .wrap{grid-template-columns:1fr;align-content:center;gap:36px;padding:72px} h1{font-size:72px} p{font-size:30px;max-width:900px} .side{grid-template-columns:1fr 1fr;align-items:stretch}`);
await browser.close();
