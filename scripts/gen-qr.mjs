// Jana QR code upline → public/assets/qr-upline.svg
// Tukar UPLINE_ID di sini DAN dalam public/content.js jika ID berubah.
import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "node:fs";

export const UPLINE_ID = "E-0222933";
const QR_PAYLOAD = UPLINE_ID; // Andaian: app Eastel baca ID ahli sebagai teks biasa.
const DARK = process.env.QR_DARK || "#0B1F3A";

const svg = await QRCode.toString(QR_PAYLOAD, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  color: { dark: DARK, light: "#FFFFFF" },
});
mkdirSync("public/assets", { recursive: true });
writeFileSync("public/assets/qr-upline.svg", svg);
console.log(`QR dijana untuk "${QR_PAYLOAD}" → public/assets/qr-upline.svg`);
