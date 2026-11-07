import { BAB, UPLINE, VIDEO, SOKONGAN, youtubeWatchUrl, youtubeEmbedUrl, youtubeThumb, fmtMasa } from "./content.js";

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

/* ---------- Video (YouTube + time code) ---------- */
const segmen = (b) => {
  const i = BAB.indexOf(b); const next = BAB[i + 1];
  return { mula: b.video?.mula ?? 0, tamat: next?.video?.mula };
};
function mountPlayer(frame, t = 0, end, title = VIDEO.youtube.tajuk) {
  frame.innerHTML = `<iframe src="${youtubeEmbedUrl(t, end)}" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
function posterHtml(label, t = 0) {
  return `<button class="video-poster" type="button" data-play="${t}" aria-label="Main video: ${esc(label)}">
      <img class="poster-img" src="${youtubeThumb}" alt="" loading="lazy" width="480" height="360">
      <span class="play">${icon("play")}</span>
      <span class="poster-label">${esc(label)}</span>
    </button>`;
}
function babVideoCard(b) {
  const { mula, tamat } = segmen(b);
  return `
    <div class="card video-card bab-video">
      <div class="video-frame" data-frame data-start="${mula}" data-end="${tamat ?? ""}" data-title="Bab ${b.id}: ${esc(b.tajuk)}">
        ${posterHtml(`Tonton Bab ${b.id} dalam video · ${fmtMasa(mula)}${tamat ? "–" + fmtMasa(tamat) : ""}`, mula)}
      </div>
      <div class="video-links">
        <a class="btn btn-sm btn-outline" href="${youtubeWatchUrl(mula)}" target="_blank" rel="noopener">${icon("play")} Buka di YouTube (${fmtMasa(mula)})</a>
        <a class="btn btn-sm btn-ghost" href="${VIDEO.pdf.pautan}" target="_blank" rel="noopener">${icon("file")} PDF</a>
      </div>
    </div>`;
}
/* Thumbnail YouTube gagal dimuat → sembunyikan, kekalkan latar gradien */
document.addEventListener("error", (e) => { if (e.target?.classList?.contains("poster-img")) e.target.remove(); }, true);
/* Delegasi: poster → iframe (lazy) */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-play]"); if (!btn) return;
  const frame = btn.closest("[data-frame]"); if (!frame) return;
  mountPlayer(frame, Number(frame.dataset.start || 0), frame.dataset.end ? Number(frame.dataset.end) : undefined, frame.dataset.title);
});

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
          <div class="video-frame" id="video-frame" data-frame data-start="0" data-title="${esc(VIDEO.youtube.tajuk)}">
            ${posterHtml(VIDEO.youtube.tajuk + " · 9 min", 0)}
          </div>
          <ol class="chapters" id="chapters" aria-label="Bab dalam video">
            <li><button type="button" data-seek="0" aria-current="true"><span class="t">0:00</span><span>Senarai kandungan</span></button></li>
            ${BAB.map((b) => `<li><button type="button" data-seek="${b.video.mula}"><span class="t">${fmtMasa(b.video.mula)}</span><span>Tutorial ${b.id}: ${esc(b.tajuk)}</span></button></li>`).join("")}
          </ol>
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

  $("#chapters")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-seek]"); if (!btn) return;
    const t = Number(btn.dataset.seek);
    document.querySelectorAll("#chapters [data-seek]").forEach((x) => x.removeAttribute("aria-current"));
    btn.setAttribute("aria-current", "true");
    const frame = $("#video-frame"); frame.dataset.start = String(t);
    mountPlayer(frame, t, undefined, VIDEO.youtube.tajuk);
    frame.scrollIntoView({ behavior: "smooth", block: "center" });
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
      <section><div class="wrap">
        ${babVideoCard(b)}
        <div class="card soon-box">
        ${icon("lock")}
        <h2 style="margin:12px 0 6px">Teks langkah akan datang</h2>
        <p class="note" style="font-size:15px">Buat masa ini ikut bahagian video di atas. Teks langkah demi langkah sedang disediakan — atau rujuk <a href="${VIDEO.pdf.pautan}" target="_blank" rel="noopener">buku panduan PDF</a>.</p>
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
        ${babVideoCard(b)}
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
