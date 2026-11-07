---
name: og-image
description: Jana OG image (Open Graph) secara automatik untuk mana-mana projek laman web / landing page / portal sebelum deploy. Gunakan setiap kali membina atau men-deploy website baru, menukar tajuk/brand laman, atau bila pengguna sebut "OG image", "preview link", "preview WhatsApp/Facebook", "share image". Mengikut spesifikasi WhatsApp/Facebook/Twitter dan warna brand projek.
---

# OG Image — spesifikasi & aliran kerja

**Peraturan (DNA CikguKB):** setiap website yang siap dibina MESTI ada OG image sebelum dikira siap. Jangan tunggu diminta.

## Spesifikasi wajib
| Perkara | Nilai |
|---|---|
| Saiz utama | 1200 × 630 px (nisbah 1.91:1) |
| Format | JPEG progresif, kualiti 80–88, **< 300 KB** (WhatsApp tak papar gambar besar) |
| Versi persegi (pilihan) | 1080 × 1080 px untuk status WhatsApp / Instagram |
| Teks selamat | padding ≥ 56 px, tajuk ≤ 2 baris, saiz tajuk 56–72 px, kontras ≥ 4.5:1 |
| Warna & font | ambil dari token brand projek (`:root` CSS / design system), bukan warna rawak |
| Elemen | logo/wordmark, tajuk, 1 baris subtajuk, 2–3 "pill" ciri utama, elemen identiti (avatar/QR/produk) di kanan |
| Tag HTML | `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (**URL mutlak https**), `og:image:width/height/alt`, `og:locale`, `twitter:card=summary_large_image`, `twitter:image` |
| Tiada | emoji sebagai ikon, teks < 20 px, imej stok tanpa lesen |

## Aliran kerja
1. Baca token brand projek (warna, font, logo) — sama seperti laman.
2. Salin `scripts/og-template.html` ke `scripts/og/og.html` dalam projek; isi tajuk, subtajuk, pills, logo, elemen kanan. Edit CSS jika brand berbeza.
3. Jalankan `node scripts/og/render.mjs` (salin dari `scripts/render-og.mjs`) → `public/assets/og.jpg` (+ `og-square.jpg`).
4. Semak saiz fail `< 300 KB`; jika lebih, turunkan `quality` atau kurangkan kecerunan/bayang.
5. Tambah tag meta dalam `<head>` (lihat `scripts/og-meta.html`), guna URL mutlak domain sebenar.
6. Tambah skrip `"build:og": "node scripts/og/render.mjs"` dalam `package.json` dan nota di README.
7. Verifikasi selepas deploy:
   ```bash
   curl -s https://DOMAIN/ | grep -o '<meta property="og:image"[^>]*>'
   curl -s -o /dev/null -w "%{http_code} %{size_download} %{content_type}\n" https://DOMAIN/assets/og.jpg
   ```
   Hantar fail imej kepada pengguna untuk dilihat. Ingatkan: WhatsApp cache preview ikut URL — uji dengan `?v=2`.

## Kandungan teks (Bahasa Melayu lalai)
- Tajuk = janji utama laman (bukan nama syarikat sahaja). Contoh: "Daftar & guna Eastel, langkah demi langkah."
- Subtajuk = 1 ayat apa yang ada di dalam.
- Pills = 2–3 fakta ringkas: bilangan bab, "Video", bahasa, harga, tempoh.
