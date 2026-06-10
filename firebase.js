// =============================================
// SEEKER — Firebase Config
// Substitua com suas credenciais do Firebase
// =============================================
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializa Firebase
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();
const auth = firebase.auth();

// Configurações de performance (cache offline + persistência)
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
  if (err.code === 'failed-precondition') console.warn('Seeker: múltiplas abas abertas, cache desativado');
  else if (err.code === 'unimplemented') console.warn('Seeker: browser não suporta cache offline');
});

// =============================================
// Firestore Collections
// games/{id}         → dados do jogo
// favorites/{userId}/items/{gameId} → favoritos
// =============================================

// Plataformas suportadas com metadados
const PLATFORMS = {
  steam:   { label: "Steam",        color: "#1b9ed4", icon: "brand-steam" },
  epic:    { label: "Epic Games",   color: "#a78bfa", icon: "brand-epic-games" },
  gog:     { label: "GOG",          color: "#c47e2d", icon: "circle-letter-g" },
  psn:     { label: "PlayStation",  color: "#4a7fd4", icon: "brand-playstation" },
  xbox:    { label: "Xbox",         color: "#4caf50", icon: "brand-xbox" },
  switch_: { label: "Nintendo Switch", color: "#e84040", icon: "brand-nintendo" },
  pc:      { label: "PC (Outros)",  color: "#888",    icon: "device-desktop" },
};

const GENRES = ["Ação", "Aventura", "RPG", "Estratégia", "Indie", "Esporte", "Simulação", "Terror", "Puzzle", "Corrida"];

// Seed de jogos iniciais (carregado só se coleção vazia)
const SEED_GAMES = [
  {
    title: "Elden Ring", genre: "RPG", icon: "⚔️",
    description: "RPG de mundo aberto épico da FromSoftware.",
    releaseYear: 2022, metacritic: 96,
    platforms: {
      steam:  { price: 249.99, url: "https://store.steampowered.com/app/1245620/", onSale: false },
      psn:    { price: 299.99, url: "https://www.playstation.com/pt-br/games/elden-ring/", onSale: false },
      xbox:   { price: 249.99, url: "https://www.xbox.com/pt-BR/games/store/elden-ring/9p3mhrqlzs6g", onSale: false },
    }
  },
  {
    title: "Cyberpunk 2077", genre: "RPG", icon: "🌆",
    description: "RPG de mundo aberto em Night City.",
    releaseYear: 2020, metacritic: 86,
    platforms: {
      steam:  { price: 79.99,  url: "https://store.steampowered.com/app/1091500/", onSale: true, originalPrice: 159.99 },
      epic:   { price: 79.99,  url: "https://store.epicgames.com/p/cyberpunk-2077", onSale: true, originalPrice: 159.99 },
      gog:    { price: 79.99,  url: "https://www.gog.com/game/cyberpunk_2077", onSale: true, originalPrice: 159.99 },
      psn:    { price: 149.99, url: "https://www.playstation.com/pt-br/games/cyberpunk-2077/", onSale: false },
      xbox:   { price: 149.99, url: "https://www.xbox.com/pt-BR/games/store/cyberpunk-2077/BX9PNXNPRDRC", onSale: false },
    }
  },
  {
    title: "Hollow Knight", genre: "Indie", icon: "🐛",
    description: "Metroidvania indie com arte desenhada à mão.",
    releaseYear: 2017, metacritic: 90,
    platforms: {
      steam:   { price: 17.99, url: "https://store.steampowered.com/app/367520/", onSale: true, originalPrice: 44.99 },
      gog:     { price: 17.99, url: "https://www.gog.com/game/hollow_knight", onSale: true, originalPrice: 44.99 },
      switch_: { price: 54.99, url: "https://www.nintendo.com/games/detail/hollow-knight-switch/", onSale: false },
    }
  },
  {
    title: "Red Dead Redemption 2", genre: "Aventura", icon: "🤠",
    description: "Épico western em mundo aberto da Rockstar.",
    releaseYear: 2018, metacritic: 97,
    platforms: {
      steam: { price: 149.99, url: "https://store.steampowered.com/app/1174180/", onSale: false },
      epic:  { price: 149.99, url: "https://store.epicgames.com/p/red-dead-redemption-2", onSale: false },
      psn:   { price: 149.99, url: "https://www.playstation.com/pt-br/games/red-dead-redemption-2/", onSale: false },
      xbox:  { price: 149.99, url: "https://www.xbox.com/pt-BR/games/store/red-dead-redemption-2/BSMTXB2HNPL1", onSale: false },
    }
  },
  {
    title: "The Witcher 3", genre: "RPG", icon: "🐺",
    description: "RPG definitivo de mundo aberto da CD Projekt.",
    releaseYear: 2015, metacritic: 92,
    platforms: {
      steam:   { price: 59.99, url: "https://store.steampowered.com/app/292030/", onSale: false },
      gog:     { price: 59.99, url: "https://www.gog.com/game/the_witcher_3_wild_hunt", onSale: false },
      psn:     { price: 79.99, url: "https://www.playstation.com/pt-br/games/the-witcher-3-wild-hunt/", onSale: false },
      xbox:    { price: 79.99, url: "https://www.xbox.com/pt-BR/games/store/the-witcher-3-wild-hunt/C4F9BBRJM9Q1", onSale: false },
      switch_: { price: 119.99, url: "https://www.nintendo.com/games/detail/the-witcher-3-wild-hunt-complete-edition-switch/", onSale: false },
    }
  },
  {
    title: "Hades", genre: "Ação", icon: "🔱",
    description: "Roguelike da Supergiant Games premiado pela crítica.",
    releaseYear: 2020, metacritic: 93,
    platforms: {
      steam:   { price: 69.99, url: "https://store.steampowered.com/app/1145360/", onSale: false },
      epic:    { price: 69.99, url: "https://store.epicgames.com/p/hades", onSale: false },
      psn:     { price: 79.99, url: "https://www.playstation.com/pt-br/games/hades/", onSale: false },
      switch_: { price: 79.99, url: "https://www.nintendo.com/games/detail/hades-switch/", onSale: false },
    }
  },
  {
    title: "God of War", genre: "Ação", icon: "🪓",
    description: "Kratos e Atreus em aventura épica nórdica.",
    releaseYear: 2018, metacritic: 94,
    platforms: {
      steam: { price: 199.99, url: "https://store.steampowered.com/app/1593500/", onSale: false },
      epic:  { price: 199.99, url: "https://store.epicgames.com/p/god-of-war", onSale: false },
      psn:   { price: 249.99, url: "https://www.playstation.com/pt-br/games/god-of-war/", onSale: false },
    }
  },
  {
    title: "Baldur's Gate 3", genre: "RPG", icon: "🎲",
    description: "RPG definitivo baseado em D&D da Larian Studios.",
    releaseYear: 2023, metacritic: 96,
    platforms: {
      steam: { price: 249.99, url: "https://store.steampowered.com/app/1086940/", onSale: false },
      gog:   { price: 249.99, url: "https://www.gog.com/game/baldurs_gate_iii", onSale: false },
      psn:   { price: 299.99, url: "https://www.playstation.com/pt-br/games/baldurs-gate-3/", onSale: false },
    }
  },
  {
    title: "Stardew Valley", genre: "Indie", icon: "🌾",
    description: "Simulação de fazenda relaxante e encantadora.",
    releaseYear: 2016, metacritic: 89,
    platforms: {
      steam:   { price: 29.99, url: "https://store.steampowered.com/app/413150/", onSale: false },
      gog:     { price: 29.99, url: "https://www.gog.com/game/stardew_valley", onSale: false },
      psn:     { price: 39.99, url: "https://www.playstation.com/pt-br/games/stardew-valley/", onSale: false },
      xbox:    { price: 39.99, url: "https://www.xbox.com/pt-BR/games/store/stardew-valley/C3D571L6VGPR", onSale: false },
      switch_: { price: 49.99, url: "https://www.nintendo.com/games/detail/stardew-valley-switch/", onSale: false },
    }
  },
  {
    title: "Civilization VI", genre: "Estratégia", icon: "🌍",
    description: "Estratégia por turnos para dominar a história.",
    releaseYear: 2016, metacritic: 88,
    platforms: {
      steam:   { price: 29.99, url: "https://store.steampowered.com/app/289070/", onSale: true, originalPrice: 119.99 },
      epic:    { price: 29.99, url: "https://store.epicgames.com/p/sid-meiers-civilization-vi", onSale: true, originalPrice: 119.99 },
      psn:     { price: 49.99, url: "https://www.playstation.com/pt-br/games/sid-meiers-civilization-vi/", onSale: false },
      xbox:    { price: 49.99, url: "https://www.xbox.com/pt-BR/games/store/sid-meiers-civilization-vi/BXBHVV5NKJPN", onSale: false },
      switch_: { price: 59.99, url: "https://www.nintendo.com/games/detail/sid-meiers-civilization-vi-switch/", onSale: false },
    }
  },
  {
    title: "Dead Cells", genre: "Ação", icon: "💀",
    description: "Roguelike-Metroidvania brutalmente divertido.",
    releaseYear: 2018, metacritic: 89,
    platforms: {
      steam:   { price: 35.99, url: "https://store.steampowered.com/app/588650/", onSale: true, originalPrice: 59.99 },
      gog:     { price: 35.99, url: "https://www.gog.com/game/dead_cells", onSale: true, originalPrice: 59.99 },
      psn:     { price: 35.99, url: "https://www.playstation.com/pt-br/games/dead-cells/", onSale: true, originalPrice: 59.99 },
      xbox:    { price: 35.99, url: "https://www.xbox.com/pt-BR/games/store/dead-cells/BWMZBGTS9RJK", onSale: true, originalPrice: 59.99 },
      switch_: { price: 49.99, url: "https://www.nintendo.com/games/detail/dead-cells-switch/", onSale: false },
    }
  },
  {
    title: "Fortnite", genre: "Ação", icon: "🏗️",
    description: "Battle Royale free-to-play da Epic Games.",
    releaseYear: 2017, metacritic: 81, isFree: true,
    platforms: {
      epic:    { price: 0, url: "https://store.epicgames.com/p/fortnite", onSale: false },
      psn:     { price: 0, url: "https://www.playstation.com/pt-br/games/fortnite/", onSale: false },
      xbox:    { price: 0, url: "https://www.xbox.com/pt-BR/games/store/fortnite/bt5p2x999vh2", onSale: false },
      switch_: { price: 0, url: "https://www.nintendo.com/games/detail/fortnite-switch/", onSale: false },
    }
  },
];
