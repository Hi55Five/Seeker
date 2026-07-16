/* =========================================================
   seeker. — vitrine + modo desenvolvedor (Firebase)
   =========================================================
   Coleção Firestore: "products"
   Campos de cada doc: code, title, category, platform,
   price, oldPrice, link, query, createdAt
   O "code" (ex: SK-0001) é o ID interno de fácil localização,
   gerado automaticamente a partir do contador em meta/counters.
   Se o Firebase ainda não foi configurado (firebase-config.js),
   o site cai sozinho no catálogo de exemplo abaixo, só pra
   visualização — o modo desenvolvedor fica desativado.
   ========================================================= */

import { FIREBASE_IS_CONFIGURED, db, auth } from "./firebase-config.js";

let collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, runTransaction, serverTimestamp;
let signInWithEmailAndPassword, onAuthStateChanged, signOut;

if (FIREBASE_IS_CONFIGURED) {
  ({ collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, runTransaction, serverTimestamp }
    = await import("https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"));
  ({ signInWithEmailAndPassword, onAuthStateChanged, signOut }
    = await import("https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"));
}

/* ---------- ícones por categoria ---------- */
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

/* ---------- catálogo de exemplo (offline / sem Firebase ainda) ---------- */
const DEMO_PRODUCTS = [
  { code: "SK-0001", title: "Vestido midi alcinha canelado", category: "vestidos", platform: "shein", price: "R$ 69,90", oldPrice: "R$ 98,00", query: "vestido midi alcinha canelado" },
  { code: "SK-0002", title: "Blusa cropped manga bufante", category: "blusas", platform: "shopee", price: "R$ 34,90", query: "blusa cropped manga bufante" },
  { code: "SK-0003", title: "Calça alfaiataria pantalona", category: "calcas", platform: "ali", price: "R$ 87,50", oldPrice: "R$ 120,00", query: "calça alfaiataria pantalona feminina" },
  { code: "SK-0004", title: "Tênis chunky branco plataforma", category: "calcados", platform: "shopee", price: "R$ 129,90", query: "tenis chunky branco plataforma feminino" },
  { code: "SK-0005", title: "Colar camadas banhado a ouro", category: "acessorios", platform: "ali", price: "R$ 24,90", query: "colar camadas banhado a ouro feminino" },
  { code: "SK-0006", title: "Vestido de linho manga longa", category: "vestidos", platform: "shopee", price: "R$ 79,90", query: "vestido linho manga longa" },
  { code: "SK-0007", title: "Regata canelada gola careca", category: "blusas", platform: "shein", price: "R$ 22,90", query: "regata canelada gola careca" },
  { code: "SK-0008", title: "Saia jeans midi botões", category: "calcas", platform: "shein", price: "R$ 54,90", oldPrice: "R$ 79,90", query: "saia jeans midi botões" }
];

let allProducts = [];
let currentFilter = "todos";
let editingId = null; // doc.id em edição (null = criando novo)

/* =========================================================
   RENDER — VITRINE PÚBLICA
   ========================================================= */
function applyFilter(){
  const list = currentFilter === "todos" ? allProducts : allProducts.filter(p => p.category === currentFilter);
  renderGrid(list);
}

function renderGrid(list){
  const grid = document.getElementById("productGrid");
  if (!list.length){
    grid.innerHTML = `<p class="empty-state">Nenhuma peça encontrada nessa categoria ainda.</p>`;
    return;
  }
  grid.innerHTML = list.map((p, i) => {
    const accent = ACCENTS[i % ACCENTS.length];
    const link = p.link ? p.link : PLATFORM_URL[p.platform](p.query || p.title);
    return `
      <a class="card" href="${link}" target="_blank" rel="noopener" data-category="${p.category}">
        <div class="card-media" style="background:color-mix(in srgb, var(--${accent}) 32%, var(--surface));">
          <span class="badge badge-${p.platform}">${PLATFORM_LABEL[p.platform]}</span>
          <div style="width:38%;color:var(--${accent}-ink)">${ICONS[p.category] || ""}</div>
        </div>
        <div class="card-body">
          <p class="card-title">${escapeHtml(p.title)}</p>
          <div class="card-meta">
            <div class="card-price">
              <span class="price-now">${escapeHtml(p.price)}</span>
              ${p.oldPrice ? `<span class="price-old">${escapeHtml(p.oldPrice)}</span>` : ""}
            </div>
            <span class="card-cta" aria-hidden="true">
              <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M7 17 17 7M9 7h8v8"/>
              </svg>
            </span>
          </div>
          ${p.code ? `<span class="card-code">${p.code}</span>` : ""}
        </div>
      </a>`;
  }).join("");
}

function escapeHtml(str=""){
  return String(str).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}

/* filtro por categoria */
const filterRow = document.getElementById("filterRow");
filterRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if(!btn) return;
  filterRow.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  applyFilter();
});

/* =========================================================
   CARREGAMENTO DOS PRODUTOS (Firestore ou demo)
   ========================================================= */
function loadDemo(){
  allProducts = DEMO_PRODUCTS.map((p, i) => ({ ...p, id: `demo-${i}` }));
  applyFilter();
  renderDevList();
  setDevStatus("Modo de exemplo — configure o Firebase em firebase-config.js pra editar de verdade.", "warn");
}

function startProductsListener(){
  if (!FIREBASE_IS_CONFIGURED){ loadDemo(); return; }
  try{
    const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
    onSnapshot(q,
      snap => {
        allProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!allProducts.length){ setDevStatus("Catálogo vazio no Firestore. Use '+ Novo produto' pra começar.", "warn"); }
        else { setDevStatus("", ""); }
        applyFilter();
        renderDevList();
      },
      err => {
        console.warn("Firestore indisponível, caindo pro catálogo de exemplo:", err);
        loadDemo();
      }
    );
  }catch(err){
    console.warn("Erro ao conectar no Firebase, caindo pro catálogo de exemplo:", err);
    loadDemo();
  }
}

/* =========================================================
   TEMA CLARO/ESCURO
   ========================================================= */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
function applyTheme(theme){ root.setAttribute("data-theme", theme); localStorage.setItem("seeker-theme", theme); }
const savedTheme = localStorage.getItem("seeker-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);
themeToggle.addEventListener("click", () => applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

/* =========================================================
   MODO DESENVOLVEDOR
   ========================================================= */
const devToggle      = document.getElementById("devToggle");
const devOverlay     = document.getElementById("devOverlay");
const devDrawer      = document.getElementById("devDrawer");
const devClose       = document.getElementById("devClose");
const devHeadTitle   = document.getElementById("devHeadTitle");
const devStatusEl    = document.getElementById("devStatus");
const devLoginPanel  = document.getElementById("devLoginPanel");
const devAdminPanel  = document.getElementById("devAdminPanel");
const devLoginForm   = document.getElementById("devLoginForm");
const devLoginError  = document.getElementById("devLoginError");
const devUserEmail   = document.getElementById("devUserEmail");
const devLogout      = document.getElementById("devLogout");
const devNewBtn      = document.getElementById("devNewBtn");
const devProductForm = document.getElementById("devProductForm");
const devFormError   = document.getElementById("devFormError");
const devSearch      = document.getElementById("devSearch");
const devList        = document.getElementById("devList");
const pfDelete       = document.getElementById("pfDelete");
const pfCancel       = document.getElementById("pfCancel");
const pfCodeRow      = document.getElementById("pfCodeRow");
const pfCode         = document.getElementById("pfCode");

function openDrawer(){ devDrawer.classList.add("open"); devOverlay.classList.add("open"); devDrawer.setAttribute("aria-hidden","false"); }
function closeDrawer(){ devDrawer.classList.remove("open"); devOverlay.classList.remove("open"); devDrawer.setAttribute("aria-hidden","true"); resetProductForm(); }
devToggle.addEventListener("click", openDrawer);
devClose.addEventListener("click", closeDrawer);
devOverlay.addEventListener("click", closeDrawer);

function setDevStatus(msg, kind){
  devStatusEl.textContent = msg || "";
  devStatusEl.className = "dev-status" + (kind ? ` dev-status-${kind}` : "");
}

if (!FIREBASE_IS_CONFIGURED){
  devToggle.disabled = true;
  devToggle.title = "Configure o firebase-config.js pra ativar o modo desenvolvedor";
}

/* ---------- login / logout ---------- */
if (FIREBASE_IS_CONFIGURED){
  onAuthStateChanged(auth, user => {
    if (user){
      devHeadTitle.textContent = "Catálogo";
      devLoginPanel.classList.add("hidden");
      devAdminPanel.classList.remove("hidden");
      devUserEmail.textContent = user.email;
    } else {
      devHeadTitle.textContent = "Entrar";
      devLoginPanel.classList.remove("hidden");
      devAdminPanel.classList.add("hidden");
    }
  });
}

devLoginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  devLoginError.textContent = "";
  const email = document.getElementById("devEmail").value.trim();
  const password = document.getElementById("devPassword").value;
  try{
    await signInWithEmailAndPassword(auth, email, password);
    devLoginForm.reset();
  }catch(err){
    devLoginError.textContent = "E-mail ou senha inválidos.";
  }
});

devLogout?.addEventListener("click", () => signOut(auth));

/* ---------- lista lateral (dev) ---------- */
function renderDevList(){
  const term = (devSearch?.value || "").trim().toLowerCase();
  const list = !term ? allProducts : allProducts.filter(p =>
    (p.code || "").toLowerCase().includes(term) || (p.title || "").toLowerCase().includes(term)
  );

  devList.innerHTML = list.map(p => `
    <div class="dev-row" data-id="${p.id}">
      <div class="dev-row-main">
        <code class="dev-row-code">${p.code || "—"}</code>
        <span class="dev-row-title">${escapeHtml(p.title)}</span>
        <span class="dev-row-meta">${PLATFORM_LABEL[p.platform] || p.platform} · ${p.price || ""}</span>
      </div>
      <button class="link-btn dev-row-edit" data-id="${p.id}">Editar</button>
    </div>
  `).join("") || `<p class="dev-hint">Nada encontrado.</p>`;

  devList.querySelectorAll(".dev-row-edit").forEach(btn => {
    btn.addEventListener("click", () => openProductForm(btn.dataset.id));
  });
}
devSearch?.addEventListener("input", renderDevList);

/* ---------- formulário: novo / editar ---------- */
devNewBtn?.addEventListener("click", () => openProductForm(null));
pfCancel?.addEventListener("click", resetProductForm);

function openProductForm(id){
  editingId = id;
  devProductForm.classList.remove("hidden");
  devFormError.textContent = "";

  if (id){
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    document.getElementById("pfDocId").value = id;
    document.getElementById("pfTitle").value = p.title || "";
    document.getElementById("pfCategory").value = p.category || "vestidos";
    document.getElementById("pfPlatform").value = p.platform || "shopee";
    document.getElementById("pfPrice").value = p.price || "";
    document.getElementById("pfOldPrice").value = p.oldPrice || "";
    document.getElementById("pfLink").value = p.link || "";
    document.getElementById("pfQuery").value = p.query || "";
    pfCode.textContent = p.code || "—";
    pfCodeRow.style.display = "flex";
    pfDelete.classList.remove("hidden");
    document.getElementById("pfSubmit").textContent = "Salvar alterações";
  } else {
    devProductForm.reset();
    document.getElementById("pfDocId").value = "";
    pfCodeRow.style.display = "none";
    pfDelete.classList.add("hidden");
    document.getElementById("pfSubmit").textContent = "Salvar produto";
  }
  devProductForm.scrollIntoView({ block: "nearest" });
}

function resetProductForm(){
  editingId = null;
  devProductForm.classList.add("hidden");
  devProductForm.reset();
  devFormError.textContent = "";
}

/* gera o próximo código sequencial (SK-0001, SK-0002…) via transação */
async function nextProductCode(){
  const counterRef = doc(db, "meta", "counters");
  const code = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().productSeq || 0) : 0;
    const next = current + 1;
    tx.set(counterRef, { productSeq: next }, { merge: true });
    return `SK-${String(next).padStart(4, "0")}`;
  });
  return code;
}

devProductForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  devFormError.textContent = "";

  const data = {
    title: document.getElementById("pfTitle").value.trim(),
    category: document.getElementById("pfCategory").value,
    platform: document.getElementById("pfPlatform").value,
    price: document.getElementById("pfPrice").value.trim(),
    oldPrice: document.getElementById("pfOldPrice").value.trim(),
    link: document.getElementById("pfLink").value.trim(),
    query: document.getElementById("pfQuery").value.trim()
  };

  if (!data.link && !data.query){
    devFormError.textContent = "Preencha um link direto ou um termo de busca.";
    return;
  }

  const docId = document.getElementById("pfDocId").value;
  const submitBtn = document.getElementById("pfSubmit");
  submitBtn.disabled = true;

  try{
    if (docId){
      await updateDoc(doc(db, "products", docId), data);
    } else {
      data.code = await nextProductCode();
      data.createdAt = serverTimestamp();
      await addDoc(collection(db, "products"), data);
    }
    resetProductForm();
  }catch(err){
    devFormError.textContent = "Não foi possível salvar. Confira as regras do Firestore e tente de novo.";
    console.error(err);
  }finally{
    submitBtn.disabled = false;
  }
});

pfDelete?.addEventListener("click", async () => {
  const docId = document.getElementById("pfDocId").value;
  if (!docId) return;
  if (!confirm("Excluir esse produto do catálogo? Essa ação não pode ser desfeita.")) return;
  try{
    await deleteDoc(doc(db, "products", docId));
    resetProductForm();
  }catch(err){
    devFormError.textContent = "Não foi possível excluir. Tente de novo.";
    console.error(err);
  }
});

/* ---------- inicia o carregamento dos produtos ----------
   (fica no final do arquivo de propósito: só chama depois
   que todos os elementos do modo desenvolvedor já existem) */
startProductsListener();