/* Mirsol Portfolio - Vanilla JS (updated) */

const DEFAULT_TAGS = [
  "Scripting","Systems","UI","VFX","Tools","Monetization","Multiplayer","Optimization","Backend","Data","Design","AI"
];

const state = {
  projects: [],
  games: [],
  reviews: [],
  view: "grid",
  filters: new Set(),
  search: "",
  sort: "newest",
  visible: 9
};

const els = {
  themeToggle: null,
  workGrid: null,
  workCount: null,
  workLoadMore: null,
  filters: null,
  search: null,
  sort: null,
  viewGrid: null,
  viewList: null,
  projectModal: null,
  gameModal: null,
  navToggle: null,
  navMenu: null,
  reviewsTrack: null
};

document.addEventListener("DOMContentLoaded", () => {
  // Cache
  els.themeToggle = document.getElementById("themeToggle");
  els.workGrid = document.getElementById("workGrid");
  els.workCount = document.getElementById("workCount");
  els.workLoadMore = document.getElementById("workLoadMore");
  els.filters = document.getElementById("workFilters");
  els.search = document.getElementById("workSearch");
  els.sort = document.getElementById("workSort");
  els.viewGrid = document.getElementById("viewGrid");
  els.viewList = document.getElementById("viewList");
  els.projectModal = document.getElementById("projectModal");
  els.gameModal = document.getElementById("gameModal");
  els.navToggle = document.querySelector(".nav-toggle");
  els.navMenu = document.getElementById("navMenu");
  els.reviewsTrack = document.getElementById("reviewsTrack");

  // Theme
  hydrateTheme();

  // Nav
  setupNav();

  // Filters
  buildFilterChips(DEFAULT_TAGS);

  // Events
  els.search.addEventListener("input", debounce((e) => {
    state.search = e.target.value.trim().toLowerCase();
    state.visible = 9;
    renderProjects();
  }, 120));

  els.sort.addEventListener("change", (e) => {
    state.sort = e.target.value;
    state.visible = 9;
    renderProjects();
  });

  els.viewGrid.addEventListener("click", () => setView("grid"));
  els.viewList.addEventListener("click", () => setView("list"));
  els.workLoadMore.addEventListener("click", () => {
    state.visible += 9;
    renderProjects();
  });

  // Tilt
  enableTilt();

  // Discord copy
  document.getElementById("copyDiscord").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById("discordHandle").textContent.trim());
      flashToast("Discord handle copied!");
    } catch {
      flashToast("Copy not supported. Copy manually: mirajsol");
    }
  });

  // Modals close
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", closeModals);
  });

  // Fetch data
  initData();
loadAvatar(); // <— add this line
document.getElementById("year").textContent = new Date().getFullYear();
});

async function loadAvatar() {
try {
const url = "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=272664542&size=420x420&format=Png&isCircular=false";
const res = await fetch(url);
const data = await res.json();
const imgUrl = data?.data?.[0]?.imageUrl;
if (imgUrl) {
const img = document.getElementById("avatarImg");
if (img) img.src = imgUrl;
}
} catch (e) {
// keep the placeholder if it fails
console.warn("Avatar fetch failed; using placeholder.", e);
}
}

/* ========== Data ========== */

async function initData() {
  try {
    const [p, g, r] = await Promise.all([
      fetch("data/projects.json").then(r => r.json()),
      fetch("data/games.json").then(r => r.json()),
      fetch("data/testimonials.json").then(r => r.json())
    ]);
    state.projects = p;
    state.games = g;
    state.reviews = r;
  } catch (e) {
    console.warn("Could not fetch data, using fallback samples.", e);
    state.projects = fallbackProjects();
    state.games = fallbackGames();
    state.reviews = fallbackReviews();
  }
  renderProjects();
  renderGames();
  renderReviews();
}

function fallbackProjects() {
  const now = new Date().toISOString().slice(0,10);
  return [
    { id: "inv-system", title: "Inventory System", date: now, summary: "Modular inventory with stackable items, rarity, and hotbar.", tags: ["Scripting","Systems","UI"], cover: "", video: "", role: "Systems & UI", tools: ["Luau","Knit","ProfileService"], links: { roblox: "", github: "" }, body: ["Built with clean modules and events for performance.","Includes drag-and-drop, tooltips, and rarity colors."] },
    { id: "economy", title: "Economy & Shop", date: now, summary: "Data-backed shop with products, passes, limiteds, and analytics hooks.", tags: ["Monetization","Data","Systems"], cover: "", video: "", role: "Scripting", tools: ["Luau","DataStore2"], links: { roblox: "", github: "" }, body: ["Supports featured rotations and discounts.","Plug-in config via folder attributes."] },
    { id: "ui-framework", title: "Game UI Framework", date: now, summary: "Responsive UI toolkit with theming and animations.", tags: ["UI","Design","Tools"], cover: "", video: "", role: "UI/UX", tools: ["Roact","TweenService"], links: { roblox: "", github: "" }, body: ["Reusable components for menus, HUDs, and modals.","Supports light/dark themes and localization."] },
    { id: "vfx-kit", title: "VFX Pack", date: now, summary: "Hit sparks, ability trails, and environment glows.", tags: ["VFX","Design"], cover: "", video: "", role: "VFX", tools: ["ParticleEmitters"], links: { roblox: "" }, body: ["Optimized emission and lifetimes.","Preset colorways for quick theming."] },
    { id: "matchmaking", title: "Matchmaking & Lobby", date: now, summary: "Queue, party, server routing, and cross-server comms.", tags: ["Multiplayer","Backend","Scripting"], cover: "", video: "", role: "Networking", tools: ["MessagingService"], links: { roblox: "" }, body: ["Reliable messaging with backoff.","Party invites and cross-server chat."] },
    { id: "optimization", title: "Performance Pass", date: now, summary: "Profiling, memory audits, and FPS uplift.", tags: ["Optimization","Scripting","Tools"], cover: "", video: "", role: "Optimization", tools: [], links: {}, body: ["Measured improvements with before/after metrics."] }
  ];
}

function fallbackGames() {
  return [
    { id: "game1", title: "Crystal Tycoon", cover: "", video: "", link: "", summary: "Resource mining, upgrades, and trading." },
    { id: "game2", title: "Neo Obby", cover: "", video: "", link: "", summary: "Polished parkour with checkpoints and cosmetics." },
    { id: "game3", title: "Arena Rush", cover: "", video: "", link: "", summary: "Wave combat with abilities and power-ups." },
    { id: "game4", title: "Build & Battle", cover: "", video: "", link: "", summary: "Quick build PVP with destructible blocks." },
    { id: "game5", title: "Cyber Runner", cover: "", video: "", link: "", summary: "Endless runner with daily challenges." }
  ];
}

function fallbackReviews() {
  return [
    { quote: "Fast, communicative, and the code was super clean. Delivered exactly what we needed.", author: "Game Studio Owner", role: "Commission", rating: 5, source: "" },
    { quote: "UI felt so polished. Players noticed the quality instantly.", author: "Indie Dev", role: "UI/UX", rating: 5, source: "" },
    { quote: "Handled data and monetization like a pro. Revenue went up after release.", author: "Tycoon Team Lead", role: "Systems", rating: 5, source: "" },
    { quote: "Great optimization pass—FPS improved without breaking anything.", author: "Community Creator", role: "Performance", rating: 5, source: "" }
  ];
}

/* ========== Renderers ========== */

function renderProjects() {
  const filtered = filterSortSearch(state.projects);
  const total = filtered.length;
  const slice = filtered.slice(0, state.visible);

  els.workGrid.innerHTML = "";
  els.workGrid.dataset.view = state.view;

  if (!slice.length) {
    els.workGrid.innerHTML = `<p class="muted">No results. Try clearing filters or changing the search.</p>`;
  } else {
    for (const p of slice) {
      els.workGrid.appendChild(projectCard(p));
    }
  }

  els.workCount.textContent = `${slice.length} of ${total} projects`;
  els.workLoadMore.hidden = slice.length >= total;

  enableTilt();
}

function renderGames() {
  const grid = document.getElementById("gamesGrid");
  grid.innerHTML = "";
  for (const g of state.games.slice(0, 5)) {
    grid.appendChild(gameCard(g));
  }
  enableTilt();
}

function renderReviews() {
  const track = els.reviewsTrack;
  if (!track) return;
  track.innerHTML = "";
  state.reviews.forEach(r => {
    const card = document.createElement("article");
    card.className = "review";
    const stars = "★★★★★".slice(0, Math.max(0, Math.min(5, r.rating || 5)));
    card.innerHTML = `
      <div class="stars" aria-label="${r.rating || 5} out of 5 stars">${stars}</div>
      <p>${escapeHtml(r.quote || "")}</p>
      <p class="who">— ${escapeHtml(r.author || "Client")} • ${escapeHtml(r.role || "")}</p>
    `;
    track.appendChild(card);
  });

  // Slider buttons (mobile)
  const prev = document.getElementById("revPrev");
  const next = document.getElementById("revNext");
  const scrollAmount = () => Math.min(track.clientWidth * 0.9, 420);

  prev.addEventListener("click", () => track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left:  scrollAmount(), behavior: "smooth" }));
}

function projectCard(p) {
  const card = document.createElement("article");
  card.className = "card tilt";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open ${p.title} details`);
  card.addEventListener("click", () => openProjectModal(p));
  card.addEventListener("keypress", (e) => { if (e.key === "Enter") openProjectModal(p); });

  const media = document.createElement("div");
  media.className = "media";
  media.innerHTML = coverHTML(p.cover, p.title) + `<span class="hint">Click to view details</span>`;

  const body = document.createElement("div");
  body.className = "body";
  body.innerHTML = `
    <h3 class="title">${escapeHtml(p.title)}</h3>
    <p class="muted">${escapeHtml(p.summary || "")}</p>
  `;

  const tags = document.createElement("div");
  tags.className = "tags";
  (p.tags || []).forEach(t => {
    const span = document.createElement("span");
    span.className = "tag"; span.textContent = t;
    tags.appendChild(span);
  });

  body.appendChild(tags);
  card.appendChild(media);
  card.appendChild(body);
  return card;
}

function gameCard(g) {
  const card = document.createElement("article");
  card.className = "card tilt";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.addEventListener("click", () => openGameModal(g));
  card.addEventListener("keypress", (e) => { if (e.key === "Enter") openGameModal(g); });

  const media = document.createElement("div");
  media.className = "media";
  media.innerHTML = coverHTML(g.cover, g.title) + `<span class="hint">Click to view details</span>`;

  const body = document.createElement("div");
  body.className = "body";
  body.innerHTML = `
    <h3 class="title">${escapeHtml(g.title)}</h3>
    <p class="muted">${escapeHtml(g.summary || "")}</p>
  `;

  card.appendChild(media);
  card.appendChild(body);
  return card;
}

function coverHTML(url, title) {
  if (url) {
    return `<img src="${url}" alt="${escapeHtml(title)} cover" loading="lazy" />`;
  }
  const initials = title?.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase() || "⚙";
  return `<div class="skeleton" style="display:grid;place-items:center;color:rgba(255,255,255,.7);font-weight:800;font-size:28px;">${initials}</div>`;
}

/* ========== Modal Logic ========== */

function openProjectModal(p) {
  const modal = els.projectModal;
  const media = document.getElementById("projectMedia");
  media.innerHTML = videoHTML(p.video);

  document.getElementById("projectTitle").textContent = p.title;
  document.getElementById("projectSummary").textContent = p.summary || "";
  const tags = document.getElementById("projectTags"); tags.innerHTML = "";
  (p.tags || []).forEach(t => {
    const span = document.createElement("span"); span.className = "tag"; span.textContent = t; tags.appendChild(span);
  });

  const body = document.getElementById("projectBody"); body.innerHTML = "";
  (p.body || []).forEach(par => {
    const pEl = document.createElement("p"); pEl.textContent = par; body.appendChild(pEl);
  });

  const links = document.getElementById("projectLinks"); links.innerHTML = "";
  if (p.links?.roblox) links.appendChild(linkBtn("Play on Roblox", p.links.roblox));
  if (p.links?.github) links.appendChild(linkBtn("Source", p.links.github));

  openModal(modal);
}

function openGameModal(g) {
  const modal = els.gameModal;
  const media = document.getElementById("gameMedia");
  media.innerHTML = videoHTML(g.video);

  document.getElementById("gameTitle").textContent = g.title;
  document.getElementById("gameSummary").textContent = g.summary || "";
  const links = document.getElementById("gameLinks"); links.innerHTML = "";
  if (g.link) links.appendChild(linkBtn("Play on Roblox", g.link));
  openModal(modal);
}

function videoHTML(video) {
  if (!video) {
    return `<div class="skeleton" style="width:100%;height:100%;display:grid;place-items:center;color:#bbb;">Add your video link here</div>`;
  }
  if (typeof video === "string" && video.includes("youtube")) {
    const id = parseYouTubeId(video);
    return `<iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  }
  if (typeof video === "string" && video.endsWith(".mp4")) {
    return `<video src="${video}" controls playsinline></video>`;
  }
  return `<div class="skeleton" style="width:100%;height:100%;display:grid;place-items:center;color:#bbb;">Unsupported video format</div>`;
}

function parseYouTubeId(url) {
  const re = /(?:youtube\.com.*(?:v=|embed\/)|youtu\.be\/)([^&?/]+)/;
  const m = url.match(re); return m ? m[1] : url;
}

function linkBtn(text, href) {
  const a = document.createElement("a");
  a.className = "btn btn-ghost"; a.href = href; a.target = "_blank"; a.rel = "noopener";
  a.textContent = text; return a;
}

function openModal(modal) {
  modal.classList.add("active"); modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModals() {
  document.querySelectorAll(".modal.active").forEach(m => {
    m.classList.remove("active"); m.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

/* ========== Filtering / Sorting ========== */

function filterSortSearch(items) {
  let out = items.slice();

  if (state.search) {
    const q = state.search;
    out = out.filter(p =>
      (p.title || "").toLowerCase().includes(q) ||
      (p.summary || "").toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  if (state.filters.size) {
    out = out.filter(p => {
      const tags = (p.tags || []).map(t => t.toLowerCase());
      for (const f of state.filters) {
        if (!tags.includes(f.toLowerCase())) return false;
      }
      return true;
    });
  }

  switch (state.sort) {
    case "newest": out.sort((a,b) => (b.date||"").localeCompare(a.date||"")); break;
    case "oldest": out.sort((a,b) => (a.date||"").localeCompare(b.date||"")); break;
    case "az": out.sort((a,b) => (a.title||"").localeCompare(b.title||"")); break;
    case "za": out.sort((a,b) => (b.title||"").localeCompare(a.title||"")); break;
  }

  return out;
}

function buildFilterChips(tags) {
  els.filters.innerHTML = "";
  const allChip = chip("All", true);
  allChip.addEventListener("click", () => {
    state.filters.clear(); updateChips(); state.visible = 9; renderProjects();
  });
  els.filters.appendChild(allChip);

  tags.forEach(tag => {
    const c = chip(tag, false);
    c.dataset.tag = tag;
    c.addEventListener("click", () => {
      if (state.filters.has(tag)) state.filters.delete(tag);
      else state.filters.add(tag);
      updateChips(); state.visible = 9; renderProjects();
    });
    els.filters.appendChild(c);
  });

  function updateChips() {
    els.filters.querySelectorAll(".chip").forEach(ch => {
      const t = ch.dataset.tag;
      if (!t) ch.classList.toggle("active", state.filters.size === 0);
      else ch.classList.toggle("active", state.filters.has(t));
    });
  }
  updateChips();
}

function chip(text, active=false) {
  const c = document.createElement("button");
  c.className = "chip" + (active ? " active" : "");
  c.type = "button";
  c.textContent = text;
  return c;
}

/* ========== View Toggle ========== */

function setView(view) {
  state.view = view;
  els.viewGrid.classList.toggle("active", view === "grid");
  els.viewList.classList.toggle("active", view === "list");
  els.viewGrid.setAttribute("aria-pressed", view === "grid");
  els.viewList.setAttribute("aria-pressed", view === "list");
  renderProjects();
}

/* ========== Theme ========== */

function hydrateTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  els.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* ========== Nav & Misc ========== */

function setupNav() {
  const toggle = els.navToggle;
  const menu = els.navMenu;
  toggle.addEventListener("click", () => {
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close menu when clicking a link (mobile)
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== toggle) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

/* ========== Tilt Effect ========== */

function enableTilt() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  document.querySelectorAll(".tilt").forEach(el => {
    el.onmousemove = null; el.onmouseleave = null;
    const bounds = () => el.getBoundingClientRect();
    const max = 12;
    el.style.transition = "transform 150ms var(--ease)";
    el.onmousemove = (e) => {
      const b = bounds();
      const px = (e.clientX - b.left) / b.width;
      const py = (e.clientY - b.top) / b.height;
      const rx = (py - 0.5) * -max;
      const ry = (px - 0.5) * max;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    };
    el.onmouseleave = () => { el.style.transform = "rotateX(0) rotateY(0)"; };
  });
}

/* ========== Helpers ========== */

function debounce(fn, wait=150) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
function escapeHtml(s="") {
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function flashToast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.position = "fixed";
  el.style.bottom = "20px";
  el.style.left = "50%";
  el.style.transform = "translateX(-50%)";
  el.style.background = "rgba(0,0,0,.8)";
  el.style.color = "#fff";
  el.style.padding = "10px 14px";
  el.style.borderRadius = "10px";
  el.style.border = "1px solid rgba(255,255,255,.15)";
  el.style.zIndex = "9999";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}