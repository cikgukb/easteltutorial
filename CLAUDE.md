# easteltutorial — nota untuk Claude

- Portal statik (HTML/CSS/JS) diservis oleh Cloudflare Worker. Deploy: `npm run deploy:inline` (lihat README).
- Data kandungan hanya dalam `public/content.js`; warna brand hanya dalam `public/styles.css` `:root`.
- **Setiap kali tajuk/brand laman berubah atau sebelum deploy versi baru, jana semula OG image** dengan skill `og-image` (`npm run build:og`) dan pastikan `og.jpg` < 300 KB. Ini peraturan tetap untuk semua projek website CikguKB.
