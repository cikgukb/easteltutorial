// Bina dist/worker.js yang membenam semua fail public/ ke dalam skrip Worker.
// Guna bila muat naik aset wrangler tak boleh dipakai (cth. proxy menimpa header Authorization).
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = "public";
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".json": "application/json; charset=utf-8", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json" };

const files = {};
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    const rel = "/" + relative(ROOT, p).split("\\").join("/");
    if (rel === "/_headers") continue;
    files[rel] = { type: TYPES[extname(name)] || "application/octet-stream", b64: readFileSync(p).toString("base64") };
  }
})(ROOT);

const headersFile = readFileSync(join(ROOT, "_headers"), "utf8");

const worker = `// DIJANA oleh scripts/build-inline.mjs — jangan edit tangan.
const FILES = ${JSON.stringify(files)};
const HEADERS_RULES = parseHeaders(${JSON.stringify(headersFile)});
const BIN = new Map();
function bytes(path) {
  let b = BIN.get(path);
  if (!b) { const s = atob(FILES[path].b64); b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); BIN.set(path, b); }
  return b;
}
function parseHeaders(txt) {
  const rules = []; let cur = null;
  for (const raw of txt.split("\\n")) {
    if (!raw.trim()) continue;
    if (!/^\\s/.test(raw)) { cur = { pattern: raw.trim(), headers: [] }; rules.push(cur); }
    else if (cur) { const i = raw.indexOf(":"); cur.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]); }
  }
  return rules;
}
function matches(pattern, path) {
  const re = new RegExp("^" + pattern.replace(/[.+?^\${}()|[\\]\\\\]/g, "\\\\$&").replace(/\\*/g, ".*") + "$");
  return re.test(path);
}
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith("/")) path += "index.html";
    if (!FILES[path] && FILES[path + ".html"]) path += ".html";
    if (!FILES[path]) path = /\\.[a-z0-9]+$/i.test(path) ? path : "/index.html";
    const f = FILES[path];
    if (!f) return new Response("Tidak dijumpai", { status: 404 });
    const h = new Headers({ "content-type": f.type });
    for (const r of HEADERS_RULES) if (matches(r.pattern, path)) for (const [k, v] of r.headers) h.set(k, v);
    if (!h.has("cache-control")) h.set("cache-control", path === "/index.html" ? "no-cache" : "public, max-age=3600");
    const etag = '"' + f.b64.length.toString(36) + "-" + f.b64.slice(-12) + '"';
    h.set("etag", etag);
    if (request.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers: h });
    return new Response(request.method === "HEAD" ? null : bytes(path), { headers: h });
  }
};
`;
mkdirSync("dist", { recursive: true });
writeFileSync("dist/worker.js", worker);
console.log(`dist/worker.js: ${Object.keys(files).length} fail dibenam (${(worker.length / 1024).toFixed(1)} KB)`);
