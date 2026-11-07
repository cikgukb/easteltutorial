/* Kandungan portal — sumber: Buku Panduan Lengkap EASTEL (CikguKB).
   Tukar UPLINE.id di sini + scripts/gen-qr.mjs jika ID upline berubah. */

export const UPLINE = {
  id: "E-0222933",
  nama: "CikguKB",
  qr: "assets/qr-upline.svg",
};

export const VIDEO = {
  youtube: {
    id: "4zuzKzdDlvM",
    url: "https://youtu.be/4zuzKzdDlvM",
    tajuk: "Panduan Lengkap Eastel (YouTube)",
  },
  hd: {
    tajuk: "Video Panduan Penuh (HD)",
    embed: "https://drive.google.com/file/d/1muqy4xqN3PVru0rRQ_ICU1IGJ0otgqmu/preview",
    pautan: "https://drive.google.com/file/d/1muqy4xqN3PVru0rRQ_ICU1IGJ0otgqmu/view",
  },
  whatsapp: {
    tajuk: "Versi WhatsApp (ringan)",
    pautan: "https://drive.google.com/file/d/120FzQYH5Vz4jtIEbWFMqr-5VVrF3aTfg/view",
  },
  pdf: {
    tajuk: "Buku Panduan PDF",
    pautan: "https://drive.google.com/file/d/1fYLOZ9KNK6u_ulSdYx5O4YwQVlRVvQr6/view",
  },
};

/* Pautan YouTube ke masa tertentu (saat). */
export const youtubeWatchUrl = (t = 0) => `${VIDEO.youtube.url}?t=${Math.max(0, Math.floor(t))}`;
export const youtubeEmbedUrl = (t = 0, end) => {
  const q = new URLSearchParams({ start: String(Math.max(0, Math.floor(t))), rel: "0", modestbranding: "1", autoplay: "1", playsinline: "1" });
  if (end) q.set("end", String(Math.floor(end)));
  return `https://www.youtube-nocookie.com/embed/${VIDEO.youtube.id}?${q}`;
};
export const youtubeThumb = `https://i.ytimg.com/vi/${VIDEO.youtube.id}/hqdefault.jpg`;
export const fmtMasa = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

export const SOKONGAN = {
  careline: "011 7033 7777",
  easyMenu: "330",
  laman: "https://eastel.com.my",
};

/* Setiap langkah: { t: teks, upline: true (paparkan QR), tip: nota, table: [...] } */
export const BAB = [
  {
    id: 1, video: { mula: 22 },
    slug: "daftar-akaun",
    tajuk: "Daftar Akaun Eastel",
    soalan: "Bagaimana nak daftar akaun Eastel?",
    ringkas: "Aktifkan SIM baru, pilih nombor, sahkan identiti dan tetapkan PIN.",
    ikon: "user-plus",
    masa: "10–15 min",
    langkah: [
      { t: "Pergi ke App Store / Play Store dan muat turun aplikasi rasmi Eastel." },
      { t: "Buka aplikasi Eastel, kemudian tekan Get Started untuk mula daftar." },
      { t: "Tekan Activate New SIM Card untuk aktifkan SIM anda.", tip: "Sediakan: kad SIM Eastel, MyKad/Pasport, pencahayaan baik dan internet/Wi-Fi yang stabil." },
      { t: "Tekan Proceed. Proses ada 3 peringkat: SIM Registration → Mobile Number Selection → ID Verification." },
      { t: "Pilih sama ada nak imbas, atau masukkan sendiri kod bar dan PUK kad SIM." },
      { t: "Masukkan ID ahli upline, atau imbas QR ahli upline. Kemudian tekan Confirm & Next.", upline: true },
      { t: "Tekan Choose a new number, dan masukkan empat digit terakhir nombor telefon yang anda nak." },
      { t: "Pilih kaedah pengesahan identiti: MyKad, MyTentera, MyPR, Pasport, iKad Student atau iKad Employee.", tip: "Guna dokumen asal, pencahayaan baik tanpa silau, dan pastikan seluruh kad berada dalam bingkai." },
      { t: "Pastikan semua maklumat peribadi betul, kemudian tekan Next." },
      { t: "Buat pengesahan wajah.", tip: "Letak wajah dalam bingkai, buka cermin mata jika perlu, pegang telefon paras mata dan kelip mata bila diminta." },
      { t: "Baca terma, tekan Setuju, kemudian Next." },
      { t: "Kad SIM anda dah berjaya diaktifkan! Status: Successfully Registered." },
      { t: "Di skrin log masuk, tekan First Time Login." },
      { t: "Masukkan nombor Eastel yang anda baru pilih tadi, dan terima kod pengesahan OTP melalui SMS." },
      { t: "Masukkan kod OTP, kemudian tekan Verify & Set PIN." },
      { t: "Tetapkan PIN 6 digit pilihan anda (Login & Transaction PIN) untuk lengkapkan pendaftaran." },
      { t: "Masukkan User ID (nombor MyKad/Pasport) dan PIN anda untuk masuk ke sistem Eastel." },
      { t: "Tahniah, pendaftaran Eastel anda berjaya. Selamat guna!" },
    ],
  },
  {
    id: 2, video: { mula: 113 },
    slug: "kekalkan-nombor-mnp",
    tajuk: "Kekalkan Nombor Lama (MNP)",
    soalan: "Cara tukar telco ke Eastel sambil kekalkan nombor lama.",
    ringkas: "Pindah nombor sedia ada (Mobile Number Portability) ke Eastel.",
    ikon: "repeat",
    masa: "15–20 min + menunggu telco lama",
    langkah: [
      { t: "Pergi ke App Store / Play Store dan muat turun aplikasi rasmi Eastel." },
      { t: "Buka aplikasi Eastel dan tekan Get Started." },
      { t: "Tekan Activate New SIM Card.", tip: "Sediakan: kad SIM Eastel, MyKad/Pasport, pencahayaan baik dan internet stabil." },
      { t: "Tekan Proceed." },
      { t: "Pilih sama ada nak imbas, atau masukkan sendiri kod bar dan PUK kad SIM." },
      { t: "Masukkan ID ahli upline atau imbas QR upline, kemudian tekan Confirm & Next.", upline: true },
      { t: "Pilih Switch my current number to Eastel, kemudian masukkan nombor telefon yang anda nak pindahkan.", tip: "Nombor mesti bermula dengan 6 (contoh: 60123456789)." },
      { t: "Pilih operator mudah alih semasa anda (Maxis, Celcom, Digi, U Mobile, unifi, redONE, Tune Talk, XOX, dan lain-lain)." },
      { t: "Pilih kaedah pengesahan identiti: MyKad, MyTentera, MyPR, Pasport, iKad Student atau iKad Employee." },
      { t: "Pastikan semua maklumat betul, kemudian tekan Next." },
      { t: "Buat pengesahan wajah." },
      { t: "Baca terma, tekan Setuju, kemudian Next." },
      { t: "Kad SIM anda dah berjaya diaktifkan!" },
      { t: "Eastel dah terima permohonan pindah nombor anda. Sekarang tunggu pengesahan daripada telco semasa anda.", tip: "SMS daripada +60 11 7033 7777: \"TQ for yr request to switch to Eastel. We are awaiting confirmation frm yr current service provider.\"" },
      { t: "Sahkan pemindahan nombor dengan telco semasa anda — balas SMS port-out ikut format yang diberi (lihat Bab 3)." },
      { t: "Telco semasa akan maklumkan sama ada permohonan pindah diluluskan." },
      { t: "Bila isyarat telefon hilang, tukar kepada kad SIM Eastel." },
      { t: "Kembali ke aplikasi Eastel dan tekan First Time Login." },
      { t: "Masukkan nombor anda dan terima kod pengesahan OTP." },
      { t: "Masukkan kod OTP, kemudian tekan Verify & Set PIN." },
      { t: "Tetapkan PIN 6 digit pilihan anda untuk lengkapkan pendaftaran." },
      { t: "Masukkan User ID dan PIN untuk masuk ke sistem Eastel." },
      { t: "Tahniah, pendaftaran Eastel anda berjaya!" },
    ],
  },
  {
    id: 3, video: { mula: 235 },
    slug: "balas-sms-port-out",
    tajuk: "Balas SMS Port-Out",
    soalan: "Cara balas mesej port-out daripada telco lama.",
    ringkas: "Format balasan SMS mengikut telco semasa anda.",
    ikon: "message",
    masa: "2 min",
    langkah: [
      { t: "Anda akan terima SMS pengesahan port-out daripada telco semasa.", tip: "Contoh Maxis (23599): \"Please confirm your request to leave Maxis, reply PortOut No or Yes 60166160 before 05-03-2026 08:10 pm\"." },
      {
        t: "Balas SMS tu ikut format yang ditetapkan oleh telco anda.",
        table: {
          head: ["Telco", "Format balasan", "Hantar ke"],
          rows: [
            ["Maxis / Hotlink", "PortOut Yes 601xxxxxxx", "23599"],
            ["Celcom", "PortOut YES 601xxxxxxx", "28882"],
            ["Digi", "PortOut YES 601xxxxxxx", "27676"],
            ["U Mobile", "PortOut YES 601xxxxxxx", "28138"],
            ["unifi Mobile", "PortOut YES 601xxxxxxx", "22009"],
            ["redONE", "PortOut YES 601xxxxxxx", "20025"],
            ["Tune Talk", "MNP YES", "23388"],
          ],
          nota: "Ikut teks sebenar dalam SMS yang anda terima — nombor dan format di atas adalah rujukan daripada buku panduan.",
        },
      },
      { t: "Lepas balas, tunggu pengesahan daripada telco anda dalam masa yang ditetapkan." },
      { t: "Telco semasa akan maklumkan sama ada permohonan pindah diluluskan.", tip: "Contoh: \"We acknowledge your request to move. Thank you for being with MAXIS...\"" },
      { t: "Bila dapat SMS daripada Eastel (\"Welcome to Eastel! Please switch to our SIM card when yr current signal is unavailable\"), maknanya nombor anda dah berjaya dipindahkan." },
    ],
  },
  {
    id: 4, video: { mula: 268 },
    slug: "tambah-nilai",
    tajuk: "Cara Tambah Nilai",
    soalan: "Bagaimana nak buat tambah nilai (reload)?",
    ringkas: "Topup airtime melalui kad, online banking atau e-wallet.",
    ikon: "wallet",
    masa: "3 min",
    langkah: [
      { t: "Di halaman utama app, tekan Reload untuk masuk ke halaman tambah nilai." },
      { t: "Masukkan jumlah, atau pilih jumlah segera (RM5, RM10, RM20, RM50, RM100, RM200), kemudian teruskan." },
      { t: "Pilih kaedah bayaran: Eastel Wallet, Debit/Credit Card, Online Banking (FPX) atau e-wallet lain." },
      { t: "Bila tambah nilai selesai (Payment Successful), kembali ke halaman utama untuk semak baki terkini." },
      { t: "Tekan History untuk semak status tambah nilai anda. Tambah nilai berjaya!" },
    ],
  },
  {
    id: 5, video: { mula: 299 },
    slug: "beli-pelan-data",
    tajuk: "Beli Pelan Data",
    soalan: "Bagaimana nak beli pelan internet?",
    ringkas: "Langgan pelan bulanan 5G EZ guna baki airtime.",
    ikon: "signal",
    masa: "3 min",
    langkah: [
      { t: "Di halaman utama, tekan Plan Details untuk ke halaman pembelian." },
      { t: "Tekan Buy Plan untuk teruskan." },
      {
        t: "Pilih pelan internet yang anda nak beli.",
        table: {
          head: ["Pelan", "Harga", "Kandungan"],
          rows: [
            ["5G EZ35", "RM35", "200GB 5G/4G · 100GB hotspot · panggilan tanpa had · 10 SMS · 30 hari"],
            ["5G EZ50", "RM50", "500GB · panggilan tanpa had · 30 hari"],
            ["5G EZ68", "RM68", "700GB · panggilan tanpa had · 30 hari"],
            ["5G EZ98", "RM98", "Panggilan tanpa had · 30 hari"],
          ],
          nota: "Butiran pelan boleh berubah — rujuk app Eastel untuk tawaran terkini.",
        },
      },
      { t: "Semak Order Summary, kemudian tekan Subscribe Now. Bayaran terus daripada Airtime Balance." },
      { t: "Jika ada pelan aktif, paparan Replace Active Plan? akan keluar — tekan Proceed untuk teruskan." },
      { t: "Masukkan Transaction PIN 6 digit anda." },
      { t: "Pembelian berjaya! Baki data akan dipaparkan di halaman utama." },
      { t: "Tekan History untuk lihat rekod langganan pelan anda." },
    ],
  },
  {
    id: 6, video: { mula: 331 },
    slug: "aktifkan-eastel-wallet",
    tajuk: "Aktifkan Eastel Wallet",
    soalan: "Bagaimana nak aktifkan Eastel Wallet dan tambah nilai e-dompet?",
    ringkas: "Daftar e-dompet Eastel, kenali fungsi asas dan reload wallet.",
    ikon: "card",
    masa: "5 min",
    langkah: [
      { t: "Di halaman Wallet, tandakan Terma dan Syarat Eastel Wallet, kemudian tekan Activate." },
      { t: "Lengkapkan maklumat peribadi (e-mel, status pekerjaan, nama syarikat, jawatan, bidang perniagaan) dan tandakan saya faham dan bersetuju dengan pengisytiharan.", tip: "Maklumat peribadi boleh terus guna tetapan asal akaun." },
      { t: "Tekan Register." },
      { t: "Paparan Registration Received! akan keluar. Tekan Okay untuk teruskan — Eastel akan sahkan butiran anda." },
      { t: "Kenali halaman Eastel Wallet: baki wallet, dan rekod sejarah tambah nilai, transaksi masuk, pindahan dan lain-lain." },
      { t: "Fungsi asas e-dompet: Reload, Scan (imbas QR bayaran), Receive (terima bayaran) dan Transfer (pindah wang ke akaun lain)." },
      { t: "Untuk tambah nilai wallet: tekan Reload." },
      { t: "Masukkan jumlah tambah nilai, atau pilih jumlah yang tersedia (RM5–RM200), kemudian tekan Next." },
      { t: "Pilih kaedah bayaran (Online Banking FPX / Kad) dan tekan Proceed Payment." },
      { t: "Bila bayaran selesai, skrin Payment Successful akan keluar. Tekan Done." },
    ],
  },
  { id: 7, video: { mula: 404 }, slug: "cari-kod-rujukan", tajuk: "Cari Kod Rujukan", ringkas: "Cara dapatkan ID ahli / kod rujukan anda sendiri.", ikon: "search", masa: "—", akanDatang: true, langkah: [] },
  { id: 8, video: { mula: 430 }, slug: "tambah-nilai-orang-lain", tajuk: "Tambah Nilai Untuk Orang Lain", ringkas: "Reload nombor Eastel rakan atau keluarga.", ikon: "gift", masa: "—", akanDatang: true, langkah: [] },
  { id: 9, video: { mula: 461 }, slug: "hantar-semula-mnp", tajuk: "Hantar Semula MNP", ringkas: "Jika permohonan pindah nombor ditolak.", ikon: "refresh", masa: "—", akanDatang: true, langkah: [] },
  { id: 10, video: { mula: 495 }, slug: "semak-insentif", tajuk: "Semak Insentif", ringkas: "Lihat prestasi insentif dan pangkat ahli.", ikon: "trophy", masa: "—", akanDatang: true, langkah: [] },
  { id: 11, video: { mula: 506 }, slug: "semak-kelayakan-komisen", tajuk: "Semak Kelayakan Komisen", ringkas: "Syarat kelayakan komisen Eastelpreneur.", ikon: "percent", masa: "—", akanDatang: true, langkah: [] },
  { id: 12, video: { mula: 541 }, slug: "beli-starter-kit", tajuk: "Beli Eastel Starter Kit (ESK)", ringkas: "Cara pesan SIM/ESK melalui app.", ikon: "box", masa: "—", akanDatang: true, langkah: [] },
];
