import { BAB, UPLINE, VIDEO, SOKONGAN } from "./content.js";

/* ---------- Progres (localStorage) ---------- */
const KEY = "eastel.progress.v1";
const loadProgress = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } };
const saveProgress = (p) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* mod peribadi */ } };
let progress = loadProgress();

const babAktif = BAB.filter((b) => !b.akanDatang);
const doneCount = (b) => (progress[b.id] || []).filter(Boolean).length;
const babPct = (b) => (b.langkah.length ? Math.round((doneCount(b) / b.langkah.length) * 100) : 0);
const totalPct = () => {
  const all = babAktif.reduce((a, b) => a + b.langkah.length, 0);
  const done = babAktif.reduce((a, b) => a + doneCount(b), 0);
  return all ? Math.round((done / all) * 100) : 0;
};
const isDone = (b, i) => Boolean((progress[b.id] || [])[i]);
const setDone = (b, i, v) => {
  const arr = progress[b.id] || Array(b.langkah.length).fill(false);
  arr[i] = v; progress[b.id] = arr; saveProgress(progress); updateHeader();
};

/* ---------- Util ---------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const $ = (sel, root = document) => root.querySelector(sel);
const main = $("#main");

let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast(`Disalin: ${text}`); }
  catch {
    const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.append(ta); ta.select();
    try { document.execCommand("copy"); toast(`Disalin: ${text}`); } catch { toast("Tak dapat salin — sila taip ID secara manual."); }
    ta.remove();
  }
}
function openQrModal() {
  const d = $("#qr-modal"); $("#qr-modal-img").src = UPLINE.qr; $("#qr-modal-id").textContent = UPLINE.id;
  if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
}
$("#qr-modal-close").addEventListener("click", () => $("#qr-modal").close());
$("#qr-modal").addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });

function updateHeader() {
  const pct = totalPct();
  $("#header-progress-text").textContent = `${pct}% siap`;
  $("#header-progress-bar").style.width = `${pct}%`;
}

/* ---------- Komponen ---------- */
function uplineBlock({ inline = false } = {}) {
  return `
    <div class="${inline ? "upline-inline" : "card upline-card"}">
      <div class="qr-box"><img src="${UPLINE.qr}" alt="QR code ID upline ${esc(UPLINE.id)}" width="220" height="220" loading="lazy"></div>
      <div>
        <span class="label">ID Upline anda (${esc(UPLINE.nama)})</span>
        <div class="upline-id" id="upline-id-text">${esc(UPLINE.id)}</div>
        <div class="upline-actions">
          <button class="btn btn-primary" type="button" data-copy="${esc(UPLINE.id)}">${icon("copy")} Salin ID</button>
          <button class="btn btn-outline" type="button" data-qr>${icon("qr")} Besarkan QR</button>
        </div>
        ${inline ? `<ol>
          <li>Dalam app Eastel, di bahagian <b>Upline Details</b> tekan <b>Find Member</b>.</li>
          <li>Imbas QR di sebelah <i>atau</i> taip ID <b>${esc(UPLINE.id)}</b>.</li>
          <li>Pastikan nama upline betul, kemudian tekan <b>Confirm &amp; Next</b>.</li>
        </ol>` : `<p class="note">Masukkan ID ini di langkah "Upline Member ID" semasa daftar akaun atau MNP.</p>`}
      </div>
    </div>`;
}

function tableBlock(tb) {
  return `<div class="table-wrap"><table class="data">
    <thead><tr>${tb.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${tb.rows.map((r) => `<tr>${r.map((c, i) => `<td>${i === 1 && /PortOut|MNP/.test(c) ? `<code>${esc(c)}</code>` : esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>${tb.nota ? `<p class="note">${esc(tb.nota)}</p>` : ""}`;
}

/* ---------- Halaman utama ---------- */
function renderHome() {
  const jumlahLangkah = babAktif.reduce((a, b) => a + b.langkah.length, 0);
  const next = babAktif.find((b) => babPct(b) < 100) || babAktif[0];
  main.innerHTML = `
  <div class="view">
    <section class="hero">
      <div class="wrap">
        <div>
          <span class="eyebrow">${icon("signal")} Onboarding SIM Eastel</span>
          <h1>Daftar &amp; guna Eastel, langkah demi langkah.</h1>
          <p>Ikut bab mengikut urutan — daripada aktifkan SIM, kekalkan nombor lama, tambah nilai, beli pelan data hingga Eastel Wallet. Progres anda disimpan automatik dalam peranti ini.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/bab/${next.id}">${icon("play")} ${totalPct() > 0 ? "Sambung belajar" : "Mula Bab 1"}</a>
            <a class="btn btn-outline" href="#video">${icon("play")} Tonton video penuh</a>
          </div>
        </div>
        <div>
          <div class="mentor">
            <img src="assets/avatar-cikgukb.svg" alt="Avatar CikguKB" width="72" height="72">
            <div><strong>CikguKB</strong><span>Mentor &amp; upline anda · ID ${esc(UPLINE.id)}</span></div>
          </div>
          <div class="hero-stats">
            <div><b>${babAktif.length}</b><small>bab sedia</small></div>
            <div><b>${jumlahLangkah}</b><small>langkah</small></div>
            <div><b>${totalPct()}%</b><small>siap</small></div>
          </div>
        </div>
      </div>
    </section>

    <section id="video">
      <div class="wrap">
        <div class="section-head"><div><h2>Video panduan penuh</h2><p>Tonton dulu sekali lalu, kemudian ikut bab satu persatu.</p></div></div>
        <div class="card video-card">
          <div class="video-frame" id="video-frame">
            <button class="video-poster" type="button" id="video-play" aria-label="Main video panduan penuh">
              <span class="play">${icon("play")}</span>
              <span>${esc(VIDEO.hd.tajuk)} · Google Drive</span>
            </button>
          </div>
          <div class="video-links">
            <a class="btn btn-sm btn-outline" href="${VIDEO.hd.pautan}" target="_blank" rel="noopener">${icon("play")} Buka di Drive</a>
            <a class="btn btn-sm btn-outline" href="${VIDEO.whatsapp.pautan}" target="_blank" rel="noopener">${icon("whatsapp")} ${esc(VIDEO.whatsapp.tajuk)}</a>
            <a class="btn btn-sm btn-outline" href="${VIDEO.pdf.pautan}" target="_blank" rel="noopener">${icon("file")} ${esc(VIDEO.pdf.tajuk)}</a>
          </div>
        </div>
      </div>
    </section>

    <section id="upline">
      <div class="wrap">
        <div class="section-head"><div><h2>Upline anda</h2><p>Sediakan ini sebelum daftar — anda akan diminta pada langkah "Upline Member ID".</p></div></div>
        ${uplineBlock()}
      </div>
    </section>

    <section id="bab">
      <div class="wrap">
        <div class="section-head"><div><h2>Bab tutorial</h2><p>Ikut urutan 1 → 6. Bab lain menyusul.</p></div><span class="chip chip-brand">${totalPct()}% siap</span></div>
        <div class="grid grid-2">
          ${BAB.map((b) => {
            const pct = babPct(b); const done = pct === 100 && b.langkah.length;
            if (b.akanDatang) return `
              <a class="card bab-card soon" href="#/bab/${b.id}" aria-label="Bab ${b.id}: ${esc(b.tajuk)} (akan datang)">
                <span class="num">${icon(b.ikon)}</span>
                <div><h3>Bab ${b.id} · ${esc(b.tajuk)}</h3><p>${esc(b.ringkas)}</p><div class="meta"><span class="chip">${icon("clock")} Akan datang</span></div></div>
              </a>`;
            return `
              <a class="card bab-card ${done ? "done" : ""}" href="#/bab/${b.id}">
                <span class="num">${done ? icon("check") : icon(b.ikon)}</span>
                <div>
                  <h3>Bab ${b.id} · ${esc(b.tajuk)}</h3>
                  <p>${esc(b.ringkas)}</p>
                  <div class="meta">
                    <span>${b.langkah.length} langkah · ${esc(b.masa)}</span>
                    <div class="bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
                    ${done ? `<span class="chip chip-success">${icon("check")} Siap</span>` : `<span>${pct}%</span>`}
                  </div>
                </div>
              </a>`;
          }).join("")}
        </div>
      </div>
    </section>

    <section id="sokongan">
      <div class="wrap">
        <div class="section-head"><div><h2>Perlukan bantuan?</h2><p>Saluran rasmi Eastel dan upline anda.</p></div></div>
        <div class="support">
          <div class="card">${icon("phone")}<div><b>Careline Eastel</b><span><a href="tel:+60117033777">${esc(SOKONGAN.careline)}</a></span></div></div>
          <div class="card">${icon("hash")}<div><b>Easy Menu</b><span>Dail <b>*${esc(SOKONGAN.easyMenu)}#</b> dari SIM Eastel</span></div></div>
          <div class="card">${icon("globe")}<div><b>Laman rasmi</b><span><a href="${SOKONGAN.laman}" target="_blank" rel="noopener">eastel.com.my</a></span></div></div>
        </div>
      </div>
    </section>
  </div>`;

  $("#video-play")?.addEventListener("click", () => {
    $("#video-frame").innerHTML = `<iframe src="${VIDEO.hd.embed}" title="${esc(VIDEO.hd.tajuk)}" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>`;
  });
  document.title = "Panduan Eastel · Tutorial Onboarding SIM";
}

/* ---------- Halaman bab ---------- */
function renderBab(id) {
  const b = BAB.find((x) => x.id === id);
  if (!b) { location.hash = "#/"; return; }
  const idx = BAB.indexOf(b);
  const prev = BAB[idx - 1], next = BAB[idx + 1];
  document.title = `Bab ${b.id}: ${b.tajuk} · Panduan Eastel`;

  if (b.akanDatang) {
    main.innerHTML = `
    <div class="view">
      <section class="bab-hero"><div class="wrap">
        <div class="crumbs"><a href="#/">${icon("arrow-left")} Utama</a><span>/</span><span>Bab ${b.id}</span></div>
        <h1>${esc(b.tajuk)}</h1><p>${esc(b.ringkas)}</p>
      </div></section>
      <section><div class="wrap"><div class="card soon-box">
        ${icon("lock")}
        <h2 style="margin:12px 0 6px">Bab ini akan datang</h2>
        <p class="note" style="font-size:15px">Kandungan sedang disediakan. Sementara itu, rujuk <a href="${VIDEO.pdf.pautan}" target="_blank" rel="noopener">buku panduan PDF</a> atau hubungi upline anda.</p>
        <div class="bab-nav" style="justify-content:center">
          ${prev ? `<a class="btn btn-outline" href="#/bab/${prev.id}">${icon("arrow-left")} Bab ${prev.id}</a>` : ""}
          <a class="btn btn-primary" href="#/">Kembali ke senarai bab</a>
          ${next ? `<a class="btn btn-outline" href="#/bab/${next.id}">Bab ${next.id} ${icon("arrow-right")}</a>` : ""}
        </div>
      </div></div></section>
    </div>`;
    return;
  }

  const currentIdx = () => b.langkah.findIndex((_, i) => !isDone(b, i));
  const cur = currentIdx();

  main.innerHTML = `
  <div class="view">
    <section class="bab-hero">
      <div class="wrap">
        <div class="crumbs"><a href="#/">${icon("arrow-left")} Utama</a><span>/</span><span>Bab ${b.id} daripada ${babAktif.length}</span></div>
        <h1>${esc(b.tajuk)}</h1>
        <p>${esc(b.soalan || b.ringkas)}</p>
        <div class="bab-progress"><span id="bab-pct">${babPct(b)}%</span><div class="bar" aria-hidden="true"><span id="bab-bar" style="width:${babPct(b)}%"></span></div><span>${b.langkah.length} langkah · ${esc(b.masa)}</span></div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <ol class="steps" id="steps">
          ${b.langkah.map((s, i) => `
            <li class="card step ${isDone(b, i) ? "done" : ""} ${i === cur ? "current" : ""}" id="langkah-${i + 1}" data-i="${i}">
              <span class="num" aria-hidden="true">${isDone(b, i) ? icon("check") : i + 1}</span>
              <div class="body">
                <p class="text"><span class="sr-only">Langkah ${i + 1}: </span>${esc(s.t)}</p>
                ${s.tip ? `<div class="tip">${icon("info")}<span>${esc(s.tip)}</span></div>` : ""}
                ${s.table ? tableBlock(s.table) : ""}
                ${s.upline ? uplineBlock({ inline: true }) : ""}
                <div class="step-actions">
                  <label class="check"><input type="checkbox" data-step="${i}" ${isDone(b, i) ? "checked" : ""}> ${isDone(b, i) ? "Siap" : "Tandakan siap"}</label>
                </div>
              </div>
            </li>`).join("")}
        </ol>

        <div class="bab-nav">
          ${prev ? `<a class="btn btn-outline" href="#/bab/${prev.id}">${icon("arrow-left")} Bab ${prev.id}: ${esc(prev.tajuk)}</a>` : `<a class="btn btn-outline" href="#/">${icon("arrow-left")} Utama</a>`}
          ${next ? `<a class="btn btn-outline" href="#/bab/${next.id}">Bab ${next.id}: ${esc(next.tajuk)} ${icon("arrow-right")}</a>` : ""}
        </div>
      </div>
    </section>

    <div class="sticky-cta">
      <div class="wrap">
        <div class="status" id="sticky-status"></div>
        <button class="btn btn-gradient" type="button" id="btn-next-step"></button>
      </div>
    </div>
  </div>`;

  const refresh = (scroll = true) => {
    const c = currentIdx();
    const pct = babPct(b);
    $("#bab-pct").textContent = `${pct}%`; $("#bab-bar").style.width = `${pct}%`;
    document.querySelectorAll("#steps .step").forEach((li) => {
      const i = Number(li.dataset.i); const d = isDone(b, i);
      li.classList.toggle("done", d); li.classList.toggle("current", i === c);
      li.querySelector(".num").innerHTML = d ? icon("check") : String(i + 1);
      const cb = li.querySelector("input"); cb.checked = d;
      cb.parentElement.lastChild.textContent = d ? " Siap" : " Tandakan siap";
    });
    const btn = $("#btn-next-step"), st = $("#sticky-status");
    if (c === -1) {
      st.textContent = `Bab ${b.id} selesai!`;
      btn.innerHTML = next ? `Bab seterusnya ${icon("arrow-right")}` : `Kembali ke utama ${icon("arrow-right")}`;
      btn.onclick = () => { location.hash = next ? `#/bab/${next.id}` : "#/"; };
    } else {
      st.textContent = `Langkah ${c + 1} / ${b.langkah.length}`;
      btn.innerHTML = `${icon("check")} Siap langkah ${c + 1}`;
      btn.onclick = () => { setDone(b, c, true); refresh(true); };
    }
    if (scroll && c !== -1) {
      const el = $(`#langkah-${c + 1}`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };
  main.addEventListener("change", (e) => {
    const cb = e.target.closest("input[data-step]"); if (!cb) return;
    setDone(b, Number(cb.dataset.step), cb.checked); refresh(false);
  });
  refresh(false);
}

/* ---------- Router ---------- */
function route() {
  const h = location.hash || "#/";
  const m = h.match(/^#\/bab\/(\d+)/);
  if (m) renderBab(Number(m[1])); else renderHome();
  updateHeader();
  if (!/^#[a-z]/.test(h)) window.scrollTo({ top: 0 });
  main.focus({ preventScroll: true });
}
window.addEventListener("hashchange", route);

/* Delegasi klik global: salin, QR, anchor dalam halaman */
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-copy]"); if (c) { copyText(c.dataset.copy); return; }
  const q = e.target.closest("[data-qr]"); if (q) { openQrModal(); return; }
  const a = e.target.closest('a[href^="#"]');
  if (a && !a.getAttribute("href").startsWith("#/")) {
    const el = document.getElementById(a.getAttribute("href").slice(1));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }
});

$("#year").textContent = new Date().getFullYear();
route();
