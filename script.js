/* =========================================================
   seeker. — dados de exemplo + interações
   Troque PRODUCTS pelos seus produtos/links reais.
   Cada item usa "query" pra montar um link de busca na loja
   de origem — troque por um link direto do produto quando tiver.
   ========================================================= */

const ICONS = {
  vestidos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3l1.5 2h3L15 3l3 3-2 2 1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2l1-11-2-2 3-3z"/></svg>`,
  blusas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4 4 7l2 3 2-1.3V20h8V8.7L18 10l2-3-4-3-2 1.5h-4L8 4z"/></svg>`,
  calcas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l.8 6-2.3 12h-2l-1.2-9-1.2 9h-2L6.2 9 7 3z"/></svg>`,
  calcados: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c0-2 1-3 3-4l4-2 2-3 3 1-1 3 6 2.5c1 .4 1.5 1 1.5 2.5H3z"/></svg>`,
  acessorios: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3.2"/><path d="M12 10.2V21M8 21h8"/></svg>`
};

const PLATFORM_LABEL = { shopee: "Shopee", shein: "Shein", ali: "AliExpress" };
const PLATFORM_URL = {
  shopee: q => `https://shopee.com.br/search?keyword=${encodeURIComponent(q)}`,
  shein:  q => `https://us.shein.com/pdsearch/${encodeURIComponent(q)}/`,
  ali:    q => `https://pt.aliexpress.com/wholesale?SearchText=${encodeURIComponent(q)}`
};

const ACCENTS = ["lilac", "mint", "peach", "blue", "rose"];

const PRODUCTS = [
  { title: "Vestido midi alcinha canelado", category: "vestidos", platform: "shein", price: "R$ 69,90", old: "R$ 98,00", query: "vestido midi alcinha canelado" },
  { title: "Blusa cropped manga bufante", category: "blusas", platform: "shopee", price: "R$ 34,90", query: "blusa cropped manga bufante" },
  { title: "Calça alfaiataria pantalona", category: "calcas", platform: "ali", price: "R$ 87,50", old: "R$ 120,00", query: "calça alfaiataria pantalona feminina" },
  { title: "Tênis chunky branco plataforma", category: "calcados", platform: "shopee", price: "R$ 129,90", query: "tenis chunky branco plataforma feminino" },
  { title: "Colar camadas banhado a ouro", category: "acessorios", platform: "ali", price: "R$ 24,90", query: "colar camadas banhado a ouro feminino" },
  { title: "Vestido de linho manga longa", category: "vestidos", platform: "shopee", price: "R$ 79,90", query: "vestido linho manga longa" },
  { title: "Regata canelada gola careca", category: "blusas", platform: "shein", price: "R$ 22,90", query: "regata canelada gola careca" },
  { title: "Saia jeans midi botões", category: "calcas", platform: "shein", price: "R$ 54,90", old: "R$ 79,90", query: "saia jeans midi botões" },
  { title: "Sandália rasteira tiras finas", category: "calcados", platform: "ali", price: "R$ 41,90", query: "sandalia rasteira tiras finas feminina" },
  { title: "Bolsa tiracolo mini couro sintético", category: "acessorios", platform: "shopee", price: "R$ 58,90", query: "bolsa tiracolo mini couro sintetico" },
  { title: "Cardigã tricô botões pérola", category: "blusas", platform: "ali", price: "R$ 63,90", query: "cardiga trico botoes perola" },
  { title: "Vestido de festa fenda lateral", category: "vestidos", platform: "shein", price: "R$ 112,00", old: "R$ 159,90", query: "vestido de festa fenda lateral" }
];

/* ---------- render dos cards ---------- */
function renderProducts(list){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = list.map((p, i) => {
    const accent = ACCENTS[i % ACCENTS.length];
    const link = PLATFORM_URL[p.platform](p.query);
    return `
      <a class="card" href="${link}" target="_blank" rel="noopener" data-category="${p.category}">
        <div class="card-media" style="background:color-mix(in srgb, var(--${accent}) 32%, var(--surface));">
          <span class="badge badge-${p.platform}">${PLATFORM_LABEL[p.platform]}</span>
          <div style="width:38%;color:var(--${accent}-ink)">${ICONS[p.category]}</div>
        </div>
        <div class="card-body">
          <p class="card-title">${p.title}</p>
          <div class="card-meta">
            <div class="card-price">
              <span class="price-now">${p.price}</span>
              ${p.old ? `<span class="price-old">${p.old}</span>` : ""}
            </div>
            <span class="card-cta" aria-hidden="true">
              <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17 17 7M9 7h8v8"/>
              </svg>
            </span>
          </div>
        </div>
      </a>`;
  }).join("");
}

renderProducts(PRODUCTS);

/* ---------- filtro por categoria ---------- */
const filterRow = document.getElementById("filterRow");
filterRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if(!btn) return;
  filterRow.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");

  const filter = btn.dataset.filter;
  const filtered = filter === "todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  renderProducts(filtered);
});

/* ---------- toggle de tema (claro/escuro) ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme){
  root.setAttribute("data-theme", theme);
  localStorage.setItem("seeker-theme", theme);
}

const savedTheme = localStorage.getItem("seeker-theme")
  || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
});
