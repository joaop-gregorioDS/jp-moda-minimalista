# JP Moda Minimalista 🛍️

Um e-commerce completo (Full-Stack) focado em moda minimalista, construído do zero com foco em performance, escalabilidade e boas práticas de desenvolvimento corporativo.

## 🚀 Acesse o Projeto Online
- **Frontend Principal (Vercel):** [https://jp-moda-minimalista.vercel.app](https://jp-moda-minimalista.vercel.app)
- **Frontend Alternativo (Netlify):** [https://lojaroupasjpminimalista.netlify.app](https://lojaroupasjpminimalista.netlify.app)
- **Backend API (Render):** Cloud-hosted (Protegido por políticas de segurança CORS)

## 💻 Tecnologias e Ferramentas

A arquitetura do projeto foi desenhada utilizando um ecossistema moderno e amplamente utilizado pelo mercado:

### Frontend (User Interface)
- **Core:** Next.js (App Router) & React
- **Linguagem:** TypeScript
- **Deploy & CI/CD:** Vercel e Netlify (Configuração de Alta Disponibilidade)

### Backend (Business Logic & API)
- **Ambiente:** Node.js (v20+)
- **API:** Express / Padrão RESTful
- **Linguagem:** TypeScript
- **Deploy & CI/CD:** Render.com (Web Services)

### Infraestrutura de Dados
- **Database:** MongoDB (NoSQL)
- **Hospedagem de Dados:** MongoDB Atlas (DBaaS)
- **Seed:** Scripts automatizados para popular a base de dados com mock data (catálogo de roupas).

## 🏗️ Arquitetura e Segurança (Destaques)
- **Desacoplamento:** O frontend (Next.js) e o backend (Node.js/Express) operam em repositórios independentes, permitindo que cada serviço escale de forma isolada e tenha seu próprio fluxo de deploy.
- **Segurança Restritiva (CORS):** A comunicação com a API backend no Render está blindada via variáveis de ambiente (`FRONTEND_ORIGIN`). O servidor aceita estritamente requisições originadas dos domínios oficiais (Vercel/Netlify), rejeitando tentativas de conexão externas não autorizadas.
- **CI/CD Automatizado:** Fluxo de *Continuous Integration* e *Continuous Deployment* integrado ao GitHub. Qualquer `push` validado na branch `main` dispara o *build* e *deploy* simultâneos nos três provedores (Render, Vercel e Netlify) sem intervenção manual.
- **Gestão de Segredos:** Todo dado sensível (Strings de conexão do MongoDB, links de API, tokens) é gerenciado via arquivos `.env` localmente e injetado via Painel de Controle de Variáveis de Ambiente nos servidores em nuvem, garantindo que credenciais não subam para o controle de versão (Git).

## ⚙️ Como Rodar o Projeto Localmente

Para rodar o projeto na sua máquina, você precisará do [Node.js](https://nodejs.org/) (versão 20+) e do [Git](https://git-scm.com/) instalados.

### 1. Clonando o Repositório
```bash
git clone https://github.com/joaop-gregorioDS/jp-moda-minimalista.git
cd jp-moda-minimalista
```

### 2. Subindo o Backend (API)
```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install
```
* **Configuração:** Crie um arquivo `.env` dentro da pasta `backend/` seguindo o modelo que houver (ou solicite as credenciais do MongoDB Atlas).
* **Banco de dados:** Para popular o catálogo inicial de produtos, rode: `npm run seed`
* **Inicie a API:** `npm run dev` (O servidor iniciará na porta `4000`)

### 3. Subindo o Frontend
Abra um **novo terminal** e mantenha o backend rodando.
```bash
# Na pasta raiz do projeto (fora da pasta backend)
npm install
```
* **Configuração:** Crie um arquivo `.env` na raiz do projeto com a seguinte variável para que o frontend encontre sua API local:
`NEXT_PUBLIC_API_URL=http://localhost:4000`
* **Inicie o Frontend:** `npm run dev`

Agora, basta acessar **http://localhost:3000** no seu navegador!

---
*Desenvolvido por João Gregório.*
