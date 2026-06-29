/* ============================================================
   Shared behaviour: theme toggle + publication rendering.
   ============================================================ */

/* ---------- theme ---------- */
(function initTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

/* ---------- escaping ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* ---------- one publication card ---------- */
function pubCard(p, idx) {
  const venue = p.venue ? `<span class="venue">${esc(p.venue)}</span>` : "";
  const status = p.status ? `<span class="status">${venue ? " · " : ""}${esc(p.status)}</span>` : "";
  const sep = p.venue || p.status ? " · " : "";

  const links = (p.links || [])
    .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
    .join("");

  const aid = `abs-${idx}`;
  const abstractToggle = p.abstract
    ? `<button class="abstract-toggle" aria-expanded="false" aria-controls="${aid}" onclick="toggleAbstract(this,'${aid}')">Abstract</button>`
    : "";

  const abstract = p.abstract
    ? `<div class="abstract" id="${aid}">${esc(p.abstract)}</div>`
    : "";

  const linkRow =
    abstractToggle || links
      ? `<div class="pub-links">${abstractToggle}${links}</div>`
      : "";

  const yearBadge = p.year ? `<span class="year">${p.year}</span>` : "";

  return `
    <article class="pub">
      ${yearBadge}
      <div class="pub-body">
        <p class="title">${esc(p.title)}</p>
        <p class="meta">${esc(p.authors)}${sep}${venue}${status}</p>
        ${linkRow}
        ${abstract}
      </div>
    </article>`;
}

/* ---------- work-in-progress (lighter) ---------- */
function wipCard(p) {
  return `
    <article class="pub">
      <div class="pub-body">
        <p class="title">${esc(p.title)}</p>
        <p class="meta">${esc(p.authors)}</p>
      </div>
    </article>`;
}

function toggleAbstract(btn, id) {
  const el = document.getElementById(id);
  const open = el.classList.toggle("open");
  btn.setAttribute("aria-expanded", String(open));
  btn.textContent = open ? "Hide abstract" : "Abstract";
}

/* ---------- loaders ---------- */
async function loadPublications(mode) {
  // mode: "selected" (home, 3 newest selected) or "all" (research page)
  const res = await fetch("data/publications.json");
  const data = await res.json();
  let i = 0;

  if (mode === "selected") {
    const el = document.getElementById("selected-pubs");
    if (!el) return;
    const sel = data.published.filter((p) => p.selected).slice(0, 4);
    el.innerHTML = sel.map((p) => pubCard(p, i++)).join("");
    return;
  }

  const pub = document.getElementById("published-pubs");
  if (pub) pub.innerHTML = data.published.map((p) => pubCard(p, i++)).join("");

  const work = document.getElementById("working-pubs");
  if (work) work.innerHTML = data.working.map((p) => pubCard(p, i++)).join("");

  const wip = document.getElementById("wip-pubs");
  if (wip) wip.innerHTML = data.wip.map((p) => wipCard(p)).join("");
}
