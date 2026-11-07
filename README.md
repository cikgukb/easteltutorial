# Panduan Eastel — Portal Tutorial Onboarding SIM

Portal web ringkas gaya LMS untuk pelanggan baru SIM Eastel: ikut bab demi bab, langkah demi langkah,
dengan QR code & ID upline, video panduan dan progres yang disimpan dalam peranti.

Dibina tanpa framework (HTML + CSS + JS) dan dihoskan sebagai **Cloudflare Worker (static assets)**.

## Struktur

```
public/            # fail statik yang diservis
  index.html       # shell + ikon SVG
  styles.css       # token warna brand Eastel (tukar warna DI SINI)
  app.js           # router (#/bab/1), render, progres localStorage
  content.js       # DATA: bab, langkah, video, upline, sokongan
  assets/qr-upline.svg          # dijana oleh scripts/gen-qr.mjs
  assets/avatar-cikgukb.svg     # placeholder — ganti dengan foto sebenar
scripts/gen-qr.mjs # jana QR daripada ID upline
wrangler.jsonc     # konfigurasi Cloudflare Worker
```

## Tukar perkara biasa

| Nak tukar | Fail |
|---|---|
| ID upline (sekarang `E-0222933`) | `public/content.js` → `UPLINE.id` **dan** `scripts/gen-qr.mjs` → `UPLINE_ID`, kemudian `npm run build:qr` |
| Warna brand | `public/styles.css` blok `:root` (`--brand-*`, `--primary`) |
| Video YouTube | `public/content.js` → `VIDEO.youtube.id`; time code setiap bab di `BAB[n].video.mula` (saat) |
| Video Drive / PDF | `public/content.js` → `VIDEO.hd`, `VIDEO.whatsapp`, `VIDEO.pdf` (kongsi "anyone with link") |
| Langkah bab / tambah bab | `public/content.js` → `BAB` (tetapkan `akanDatang: false` dan isi `langkah`) |
| OG image (preview WhatsApp/FB) | edit `scripts/og/og.html`, jalankan `npm run build:og` → `public/assets/og.png` & `og-square.png` |
| Avatar mentor | ganti `public/assets/avatar-cikgukb.svg` (atau tukar `src` dalam `app.js` ke `.png/.jpg`) |

Andaian: app Eastel mengimbas QR yang mengandungi ID ahli sebagai teks biasa (`E-0222933`).
Jika app perlukan format lain, ubah `QR_PAYLOAD` dalam `scripts/gen-qr.mjs`.

## Jalankan setempat

```bash
npm install
npm run build:qr
npm run dev        # wrangler dev → http://localhost:8787
```

## Deploy ke Cloudflare

```bash
npx wrangler login   # atau set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
npm run deploy
```

Alternatif tanpa CLI: Cloudflare dashboard → Workers & Pages → Create → **Import a repository** → pilih repo ini.
Build command kosong, deploy command `npx wrangler deploy`.

### Deploy mod "inline" (fail dibenam dalam Worker)

Jika muat naik aset wrangler gagal 401 (contoh: rangkaian/proxy yang menimpa header `Authorization`),
gunakan mod inline — semua fail `public/` dibenam terus ke dalam `dist/worker.js`:

```bash
npm run deploy:inline
```

Nama Worker sama (`eastel-tutorial`), jadi URL kekal. Laman langsung: https://eastel-tutorial.kbcimb.workers.dev

## Nota kandungan

- Bab 1–6 diambil daripada *Buku Panduan Lengkap EASTEL (CikguKB)*.
- Bab 7–12 wujud dalam indeks buku tetapi langkahnya belum ada → dipaparkan sebagai "Akan datang".
- Video utama di-embed daripada YouTube (`youtube-nocookie.com`) dengan `start`/`end` mengikut time code bab; Drive kekal sebagai pautan sandaran (fail 50MB / 29MB melebihi had 25 MiB sefail Cloudflare).
