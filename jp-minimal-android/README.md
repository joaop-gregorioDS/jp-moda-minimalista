# JP Minimal — Android

App nativo da loja de portfólio **JP Minimal**. Consome a API REST já publicada com o site (Express + MongoDB Atlas). Não contém backend.

Pagamentos, estoque e pedidos são **simulados**. Nenhuma cobrança real é feita.

## Stack

- Kotlin + Jetpack Compose + Material 3
- Navigation Compose
- Retrofit + OkHttp + Kotlinx Serialization
- DataStore (sessão, sacola, favoritos)

O site Next.js continua em `../Roupas Lojas`. Este app é um **segundo cliente** da mesma API.

## Abrir no Android Studio

1. File → Open → esta pasta (`jp-minimal-android`)
2. Espere o Gradle Sync
3. Rode no emulador ou no celular

Conta demo (depois do `npm run seed` da API): `demo@jpstore.com.br` / `demo1234`

## URL da API

Em `gradle.properties`:

```
API_BASE_URL=https://jp-moda-minimalista.onrender.com
```

| Onde roda o app | Valor |
|---|---|
| Produção (Render + Atlas) | `https://jp-moda-minimalista.onrender.com` |
| Emulador + API na máquina | `http://10.0.2.2:4000` |
| Celular na mesma Wi‑Fi | `http://SEU_IP_LAN:4000` |

Depois de mudar, faça **Rebuild**. Sem barra no final da URL.

No plano free o Render **dorme**. A primeira request pode levar ~30–50 s — o app mostra “acordando o servidor…” e permite tentar de novo.

## O que o app cobre

- Início (destaques e novidades)
- Catálogo com filtros
- PDP (cor, tamanho, emoji)
- Busca com preview
- Sacola e favoritos (locais)
- Login / cadastro
- Checkout simulado (Pix, cartão, boleto, retirada)
- Pedidos da conta

Peças são emojis no wash da cor — iguais ao site, sem fotos no banco.

## Contato

- E-mail: joaop.gregorio@outlook.com
- WhatsApp: +55 (11) 98388-1984
