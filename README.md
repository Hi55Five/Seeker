# SEEKER — Biblioteca de Jogos

> Compare preços de jogos em Steam, Epic, GOG, PlayStation, Xbox e Nintendo Switch.

## Stack
- **Frontend**: HTML + CSS + JS vanilla (sem framework, leve e rápido)
- **Backend**: Firebase Firestore (banco de dados em tempo real)
- **Auth**: Firebase Authentication (Google Sign-In)
- **Hosting**: Firebase Hosting (recomendado) ou qualquer servidor estático

---

## Configuração

### 1. Criar projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um novo projeto chamado `seeker`
3. Ative **Firestore Database** (modo produção)
4. Ative **Authentication** → Provedores de login → **Google**

### 2. Configurar credenciais

Abra `firebase.js` e substitua o objeto `FIREBASE_CONFIG`:

```js
const FIREBASE_CONFIG = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

Você encontra esses dados em:
`Firebase Console → Configurações do projeto → Seus aplicativos → SDK`

### 3. Definir admins

Em `admin.html`, localize a linha:

```js
const ADMIN_EMAILS = ['seu-email@gmail.com'];
```

Substitua pelo seu e-mail do Google. Você pode adicionar múltiplos e-mails.

### 4. Regras do Firestore

No Firebase Console → Firestore → **Rules**, cole o conteúdo do arquivo `firestore.rules`.

### 5. Deploy

#### Opção A — Firebase Hosting (recomendado)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

#### Opção B — Qualquer servidor estático
Suba os arquivos para qualquer servidor web (Nginx, Apache, Vercel, Netlify, etc.).
O site não precisa de backend próprio — o Firebase cuida de tudo.

---

## Estrutura dos arquivos

```
seeker/
├── index.html       → Biblioteca principal com busca e filtros
├── favorites.html   → Favoritos do usuário (requer login)
├── compare.html     → Comparador de preços lado a lado
├── admin.html       → Painel de administração
├── styles.css       → Estilos globais
├── firebase.js      → Config Firebase + seed de jogos
└── firestore.rules  → Regras de segurança do Firestore
```

---

## Funcionalidades

| Feature | Descrição |
|---|---|
| 📚 Biblioteca | Grid de jogos com busca, filtros por gênero, plataforma e ordenação |
| ❤️ Favoritos | Salvar jogos favoritos na nuvem, sincronizados por conta |
| ⚖️ Comparador | Comparar até 4 jogos lado a lado com destaque no melhor preço |
| 🔍 Detalhe | Modal com tabela de preços por plataforma + link direto para compra |
| 🔧 Admin | CRUD completo de jogos, estatísticas, painel protegido por e-mail |
| 📶 Offline | Cache automático do Firestore para leitura offline |

---

## Performance para alto tráfego

- **Cache offline** do Firestore ativado (`enablePersistence`) — reduz reads no banco
- **Firestore indexes** são criados automaticamente pela SDK
- **Sem servidor próprio** — escala automaticamente com Firebase
- Para tráfego muito alto, ative **Firebase App Check** para proteção contra abuso
- Considere **Firestore bundle** para pré-carregar jogos populares sem reads

---

## Próximos passos sugeridos

- [ ] Adicionar imagens de capa dos jogos (Firebase Storage)
- [ ] Notificações de promoção por e-mail (Firebase Functions + SendGrid)
- [ ] Sistema de avaliação dos usuários
- [ ] Histórico de preços com gráfico
- [ ] PWA (Progressive Web App) com notificações push
