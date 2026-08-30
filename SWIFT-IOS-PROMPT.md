# JP Minimal — iOS nativo (SwiftUI)

Cole este arquivo como **primeira mensagem** de um chat **novo**.

CWD do chat: `K:\Grok\Roupas Lojas Deploy-app`  
Pasta do app (criar): `K:\Grok\Roupas Lojas Deploy-app\jp-minimal-ios`  
Não abra nem misture com `jp-minimal-android` nem com `Roupas Lojas` (Next.js).

Referência Android (somente leitura): `jp-minimal-android`  
Referência loja web (somente leitura): `Roupas Lojas`  
Sessão Android concluída: **app-jpminimal-android nativo** (`01a04a4e-a345-76a0-994a-75fefb84689d`)  
Sessão iOS: **JP Loja-APP IOS** (`01a04ef1-03da-7871-98f9-cfb09b39aa6d`) — app em `jp-minimal-ios`. Retomar com `/resume` → `JP Loja-APP IOS`.

---

Você é o engenheiro iOS. Construa o **terceiro cliente** da loja de portfólio **JP Minimal**: app nativo SwiftUI. O Android já está pronto e validado no Galaxy S22 Plus. O site Next.js já está no ar. **Não recrie backend. Não use WebView, Capacitor, TWA, React Native nem Flutter.**

## O que este app é

Segundo/terceiro cliente da **mesma API REST** (Express no Render + MongoDB Atlas). Sem Next.js, sem Mongo no device.

Pagamentos, estoque e pedidos são **simulados**. Nenhuma cobrança real.

Peças **não têm foto no banco**: emoji no wash da cor (`visual` + `colorHex`), iguais ao site e ao Android.

## API (obrigatório)

Base (sem barra no final):

```
https://jp-moda-minimalista.onrender.com
```

Health: `GET /api/health` → `{ "ok": true, "service": "jp-store-api", "db": "connected" }`

O plano free do Render **dorme**. Primeira request ~30–50 s. Timeouts 50–75 s, 1 retry em 502–504 / falha de rede. Na UI: “Acordando o servidor…” + botão tentar de novo.

Conta demo: `demo@jpstore.com.br` / `demo1234`

Auth: `Authorization: Bearer <token>` após login/cadastro. Token no Keychain. Sacola e favoritos **locais** (AppStorage / JSON), como no Android DataStore.

### Endpoints

```
GET  /api/health
GET  /api/categories                          → { categories: [{ id, slug, name, description?, accent, sortOrder }] }
GET  /api/products?q&category&size&order&featured&page&pageSize
     → { products, total, page, pageSize, totalPages }
GET  /api/products/featured?limit=8           → { products: ProductCard[] }
GET  /api/products/latest?limit=8             → { products: ProductCard[] }
GET  /api/products/search?q=                  → { results: ProductCard[] }
GET  /api/products/by-ids?ids=1,2,3           → { products: ProductCard[] }
GET  /api/products/{idOrSlug}                 → { product: Product }
GET  /api/products/{idOrSlug}/related?limit=8 → { products: ProductCard[] }
POST /api/auth/login    { email, password }   → { token, user }
POST /api/auth/register { name, email, password, phone? } → { token, user }
GET  /api/auth/me                             (Bearer)
GET  /api/orders                              (Bearer)
POST /api/orders      PlaceOrderBody          (Bearer opcional; Android envia logado ou não)
```

`order`: `newest` | `price-asc` | `price-desc` | `sale` | `name`

ProductCard: `id, slug, name, price, compareAtPrice?, discountPct?, visual, colorHex, categoryName, categorySlug, inStock, sizes[]`

Product: + `sku, description, categoryId, stock, featured, colors: [{ name, hex }]`

PlaceOrderBody: `{ name, email, items: [{ productId?, productName, price, quantity, color?, size?, visual }], address: { street, number, complement?, city, state, zip }, subtotal, shipping, discount }`

JSON: ignoreUnknownKeys. Datas/números podem vir Int ou Double — decodifique de forma tolerante.

Contrato Kotlin (fonte de verdade): `jp-minimal-android/app/src/main/java/br/com/jpminimal/data/ApiService.kt` e `Dtos.kt`.

## Stack iOS (otimizada)

- Swift 5.10+ / SwiftUI, iOS **17+**
- TabView + NavigationStack
- `@Observable` (não MVVM pesado com Combine se não precisar)
- `URLSession` + `async/await` + `Codable` — sem Alamofire
- Keychain para o token; UserDefaults/AppStorage JSON para sacola e favoritos
- Bundle ID `br.com.jpminimal`, display name **JP Minimal**, versão `0.1.0`
- AccentColor = Gold. **Não** deixar o tint azul/lilás do sistema nos chips e botões
- Sem CocoaPods se der. SPM só se for inevitável

**Máquina:** o workspace atual é Windows. Gere o projeto Xcode-ready (`*.xcodeproj` ou `project.yml` + XcodeGen, sources em `jp-minimal-ios/`). Se não houver Xcode/simulação iOS neste host, **não finja build verde**: deixe a árvore completa, um README de abertura no Mac (`open JPMinimal.xcodeproj`), e valide o que der (Swift syntax, JSON de exemplo, URL da API via curl). Não bloqueie o scaffold por falta de Mac.

## Telas (paridade Android)

Tab bar: **Início · Catálogo · Sacola · Conta**. Lupa no topo (não é tab).

1. Início — hero JP/MINIMAL, chips de categoria (scroll horizontal), Destaques, Novidades
2. Catálogo — chips de categoria com scroll (nunca wrap vertical), filtros Tamanho / Ordenar, contagem “N peças”, grid 2 colunas
3. PDP — visual emoji, preço + compare + % off, descrição, cor (círculos), tamanho (chips), favoritar, Adicionar à sacola, “Quem viu, viu também”
4. Busca com preview
5. Sacola — qty, remover, subtotal, Checkout
6. Checkout simulado — Entrega | Retirada; Pix 5% off / Cartão / Boleto 5% off; cartão **não** vai para a API
7. Conta — Entrar / cadastro, pedidos, favoritos, sobre + e-mail `joaop.gregorio@outlook.com` e WhatsApp `+55 (11) 98388-1984`
8. Login / cadastro / pedidos

Banner fixo: **Loja de portfólio — pagamentos simulados**

Regras de preço (iguais ao Android `util/Money.kt`):

- Frete grátis se retirada **ou** subtotal ≥ 299; senão 24,90
- Pix e boleto: 5% off no subtotal (não na retirada)
- Formatar BRL com `pt_BR`

## Visual (coerência loja + Android)

Paleta (não inventar):

| Token | Hex |
|---|---|
| Ink | `#111111` |
| InkSoft | `#1C1C1C` |
| Paper | `#FAFAF7` |
| Sand | `#F3F0E9` |
| Gold | `#C6A87C` |
| GoldDark | `#A88758` |
| GoldLight | `#E5D8BF` |
| Mist | `#7A7A74` |
| Line | `#E9E5DC` |
| Error | `#8B2E3A` |

- Fundo Paper. Texto principal Ink. Secundário Mist.
- Topo: **JP** Gold + **MINIMAL** Ink, peso black, tracking aberto.
- Botão primário: pílula 48pt, fundo Ink, texto Paper (creme). Nunca texto Ink em fundo Ink.
- Chip selecionado: fundo Ink + texto Paper. Não selecionado: fundo Paper, borda Line, texto Ink. **Zero lilás/roxo.**
- Cards: canto ~20pt, visual 1:1, categoria em labelSmall Mist uppercase, nome 2 linhas, preço BRL.
- Ícone do app: monograma **JP** Gold em quadrado Ink. Deixar folga (~18%) para a máscara circular da Springboard. Não usar ícone de loja genérico.
- Tab selecionada: Ink; indicador suave Gold.

Referências visuais: prints do Android na sessão Android; site https://jp-moda-minimalista.vercel.app

## Emojis (`visual`)

```
tee/tee-long 👕  shirt 👔  pants 👖  shorts 🩳  sweater 🧶
cardigan/jacket/coat/puffer/parka/trucker/letterman 🧥
turtleneck/scarf 🧣  blazer 🤵  dress/slip/skirt 👗
sneaker 👟  loafer 👞  bag 👜  belt 🪢  cap 🧢  wallet 👛  watch ⌚
fallback 🛍️
```

Mapa completo: `jp-minimal-android/app/src/main/java/br/com/jpminimal/visual/ProductEmoji.kt`

## Lições do Android (não repetir)

1. Tipografia **sem** cor cravada no estilo — senão o label some em botão preto.
2. Categorias em `ScrollView(.horizontal)`, nunca `HStack` que estoura e empilha letras.
3. Ícone adaptativo/circular corta letras nas bordas — centrar e recuar.
4. Tint padrão do sistema pinta chip de lilás — forçar Ink/Paper.
5. Render dorme: loading honesto + retry, não spinner eterno.
6. URL da API **no Info/xcconfig**, HTTPS produção. Sem `10.0.2.2`. ATS ok para Render.

## Fora de escopo

- Play Store / App Store submit
- Pagamento real, push, analytics
- Copiar `Roupas Lojas/src` React para Swift
- Mongo no app

## Ordem de entrega

1. Scaffold `jp-minimal-ios` + paleta + ícone JP + TabView vazio
2. Cliente HTTP + health/featured (provar Render)
3. Home, catálogo, PDP, busca
4. Sacola local + checkout simulado
5. Auth, pedidos, favoritos
6. README: abrir no Xcode, conta demo, nota do Render sleep

Comece agora. Primeiro passo: criar a pasta `jp-minimal-ios` e o esqueleto SwiftUI com a paleta JP e a URL do Render.
