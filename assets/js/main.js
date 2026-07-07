/* ============================================================
   Publication + co-author rendering from data/publications.json.
   ============================================================ */

/* ---------- escaping ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* ---------- one publication card ---------- */
function pubCard(p, idx) {
  // citation: Authors (Year). Venue, status.
  let cite = esc(p.authors);
  if (p.year) cite += ` (${esc(p.year)})`;
  if (!/[.!?]$/.test(cite)) cite += ".";
  let tail = "";
  if (p.venue) {
    tail = `<span class="venue">${esc(p.venue)}</span>`;
    if (p.pages) tail += `, ${esc(p.pages)}`;
    if (p.status) tail += `, <span class="status">${esc(p.status)}</span>`;
  } else if (p.status) {
    tail = `<span class="status">${esc(p.status)}</span>`;
  }
  if (tail) cite += " " + tail + ".";

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

  const numBadge = p._num ? `<span class="pnum">[${p._num}]</span>` : "";

  return `
    <article class="pub">
      ${numBadge}
      <div class="pub-body">
        <p class="title">${esc(p.title)}</p>
        <p class="meta">${cite}</p>
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
async function loadPublications() {
  const res = await fetch("data/publications.json", { cache: "no-cache" });
  const data = await res.json();
  let i = 0;

  // selected work (home landing) — featured, unnumbered
  const sel = document.getElementById("selected-pubs");
  if (sel) {
    sel.innerHTML = data.published
      .filter((p) => p.selected)
      .slice(0, 3)
      .map((p) => pubCard(p, i++))
      .join("");
  }

  // co-authors
  const co = document.getElementById("coauthors");
  if (co && data.coauthors) {
    co.innerHTML = data.coauthors
      .map((c) =>
        c.url
          ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.name)}</a>`
          : `<span>${esc(c.name)}</span>`
      )
      .join("");
  }

  // published & forthcoming — numbered newest (highest) to oldest
  const pub = document.getElementById("published-pubs");
  if (pub) {
    const n = data.published.length;
    pub.innerHTML = data.published
      .map((p, k) => {
        p._num = n - k;
        return pubCard(p, i++);
      })
      .join("");
  }

  // working papers — no number
  const work = document.getElementById("working-pubs");
  if (work) work.innerHTML = data.working.map((p) => pubCard(p, i++)).join("");

  // work in progress
  const wip = document.getElementById("wip-pubs");
  if (wip) wip.innerHTML = data.wip.map((p) => wipCard(p)).join("");
}
