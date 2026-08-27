# JP Minimal

Loja virtual de **portfólio** — e-commerce de moda minimalista em arquitetura distribuída.

Pagamentos, estoque e pedidos são **simulados**. Nenhuma cobrança real é feita.

```
┌──────────────┐      /api/*       ┌──────────────┐      ┌────────────────┐
│  Frontend    │  ───────────────▶ │  API REST    │ ───▶ │  MongoDB Atlas │
│  Vercel ou   │   rewrite Next    │  Render      │      │  catálogo,     │
│  Netlify     │                   │  Express     │      │  users, pedidos│
│  Next.js 16  │                   │  Node 20     │      │                │
└──────────────┘                   └──────────────┘      └────────────────┘
```

O frontend **não** fala com o banco. Server Components e o browser chamam a API. No cliente, `/api/*` é reescrito pelo Next.js para o host da API (mesmo origin, sem CORS no browser).

## Stack

| Camada | Tecnologia | Onde publica |
|---|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 | [Vercel](https://vercel.com) ou [Netlify](https://netlify.com) |
| API | Express + TypeScript | [Render](https://render.com) |
| Banco | MongoDB (Mongoose) | [MongoDB Atlas](https://www.mongodb.com/atlas) (free) |
| Auth | HMAC + scrypt (Bearer token) | API |
| Visual | Emojis no lugar de fotos de produto | — |

## O que a loja cobre

- Home, catálogo com filtros, PDP, busca com autocomplete
- Carrinho e favoritos (`localStorage`)
- Cadastro / login
- Checkout simulado (Pix, cartão, boleto, retirada)
- Pedidos persistidos no Mongo com baixa de estoque
- Páginas institucionais e conta
- Layout responsivo (desktop e celular)

Peças são representadas por emojis (não há fotos). O seed gera **72 itens em 12 categorias** — volume adequado a uma loja simulada no Atlas gratuito.

Conta demo após o seed: `demo@jpstore.com.br` / `demo1234`.

## Requisitos

- Node.js **20+**
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Conta no [Render](https://render.com) (API)
- Conta na [Vercel](https://vercel.com) **ou** [Netlify](https://www.netlify.com) (frontend)
- Repositório Git (GitHub) para conectar os deploys

## Rodar local

### 1. API

```bash
cd backend
copy .env.example .env
# edite MONGODB_URI e APP_SECRET
npm install
npm run seed
npm run dev
```

API em `http://localhost:4000` · health em `/api/health`.

O seed **apaga** categorias, produtos, usuários e pedidos da base apontada em `MONGODB_URI` e recria o catálogo. Rode só quando quiser popular (ou resetar) o banco.

### 2. Frontend

Na raiz do repositório:

```bash
copy .env.example .env.local
npm install
npm run dev
```

Loja em `http://localhost:3000`.

Em dois terminais: `npm run dev:api` e `npm run dev:web`.

### Celular na mesma rede

O `next dev` escuta em `0.0.0.0:3000`. No telefone, abra `http://SEU_IP_LAN:3000` (ex.: `http://192.168.68.107:3000`), com a API rodando. Confirme que o IP da máquina está em `allowedDevOrigins` em `next.config.ts` — senão o JS do Next 16 não hidrata no dispositivo.

## Variáveis de ambiente

Arquivos `.env` **não** entram no Git. Use os `.env.example` como modelo.

### Frontend (Vercel / Netlify / local)

| Variável | Exemplo | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://seu-app.vercel.app` | URLs canônicas no site |
| `NEXT_PUBLIC_API_URL` | `https://jp-store-api.onrender.com` | origem da API (build) |
| `API_URL` | mesmo valor | fetch no servidor Next |
| `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` | `299` | frete grátis a partir de |
| `NEXT_PUBLIC_SHIPPING_FIXED` | `24.9` | frete fixo simulado |

### API (Render / local)

| Variável | Exemplo |
|---|---|
| `MONGODB_URI` | `mongodb+srv://USER:SENHA@cluster.mongodb.net/jp_store?retryWrites=true&w=majority` |
| `APP_SECRET` | string longa e aleatória (não reutilize o exemplo) |
| `FRONTEND_ORIGIN` | `https://seu-app.vercel.app` (várias URLs separadas por vírgula) |
| `PORT` | injetada pelo Render; local = `4000` |

No Atlas, em **Network Access**, libere `0.0.0.0/0` (ou os IPs de saída do Render). Sem isso a API não conecta.

## Publicar (ordem)

Faça nesta ordem: **Atlas → seed → Render → frontend → CORS**.

### 1. MongoDB Atlas

1. Crie um cluster **M0 (free)**.
2. Database user + senha.
3. Network Access: `0.0.0.0/0`.
4. Copie a connection string para `MONGODB_URI` (database `jp_store`).
5. Com o `.env` do `backend` apontando para o Atlas:

```bash
cd backend
npm install
npm run seed
```

### 2. API no Render

1. Suba este repositório no GitHub.
2. Render → **New → Web Service** → o repositório.
3. Root Directory: `backend`.
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Variáveis: `MONGODB_URI`, `APP_SECRET`, `FRONTEND_ORIGIN` (pode deixar a URL do frontend provisória e atualizar no passo 4).

Ou use o Blueprint `render.yaml` na raiz.

Health check: `https://SEU-SERVICO.onrender.com/api/health`.

No plano free o Render **dorme** após inatividade. A primeira requisição pode levar ~30–50 s (cold start).

### 3. Frontend na Vercel

1. Importar o repositório (root = pasta do Next.js, não `backend`).
2. Framework: Next.js (já em `vercel.json`).
3. Variáveis: `API_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL` (URL da API no Render + URL do próprio frontend).
4. Deploy.

### 4. Frontend na Netlify (alternativa)

1. Build command: `npm run build` (`netlify.toml` já aponta o plugin Next.js).
2. As mesmas variáveis da Vercel.

### 5. Fechar o CORS

Depois do primeiro deploy do frontend, coloque a URL real em `FRONTEND_ORIGIN` no Render (ex.: `https://jp-minimal.vercel.app`) e faça **redeploy** da API. Origens `*.vercel.app` e `*.netlify.app` também são aceitas pelo CORS da API.

## API

| Método | Rota | Auth |
|---|---|---|
| `GET` | `/api/health` | — |
| `GET` | `/api/categories` | — |
| `GET` | `/api/products` | — |
| `GET` | `/api/products/search?q=` | — |
| `GET` | `/api/products/featured` | — |
| `GET` | `/api/products/latest` | — |
| `GET` | `/api/products/:id` | — |
| `POST` | `/api/auth/register` | — |
| `POST` | `/api/auth/login` | — |
| `GET` | `/api/auth/me` | Bearer |
| `GET` | `/api/orders` | Bearer |
| `POST` | `/api/orders` | opcional |

## Estrutura

```
├── src/                      frontend Next.js (App Router)
│   ├── app/                  páginas e layout
│   ├── components/
│   ├── contexts/             auth, sacola, favoritos, toasts
│   └── lib/                  cliente HTTP da API
├── backend/                  API Express + Mongo
│   ├── src/index.ts
│   ├── src/routes/
│   ├── src/models/
│   ├── src/seed.ts
│   └── .env.example
├── public/banners/           hero e mosaicos
├── scripts/generate-banners.mjs
├── .env.example              frontend
├── render.yaml
├── netlify.toml
└── vercel.json
```

## Contato (portfólio)

- E-mail: [joaop.gregorio@outlook.com](mailto:joaop.gregorio@outlook.com)
- WhatsApp: [+55 (11) 98388-1984](https://wa.me/5511983881984)
