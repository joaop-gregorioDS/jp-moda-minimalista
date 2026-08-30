# JP Minimal — Android (nativo, pronto)

Workspace: `K:\Grok\Roupas Lojas Deploy-app\jp-minimal-android`

Sessão Grok: **app-jpminimal-android nativo** (`01a04a4e-a345-76a0-994a-75fefb84689d`).

Segundo cliente nativo da **mesma API** da loja web. Sem Next.js, sem Mongo direto. Site em `..\Roupas Lojas`.

O usuário validou o app no Galaxy S22 Plus. Paleta, chips, ícone JP e API de produção estão alinhados.

## Stack

- Kotlin + Jetpack Compose + Material 3
- Navigation Compose, Retrofit + OkHttp + Kotlinx Serialization
- DataStore: sessão, sacola e favoritos (locais)
- Pacote `br.com.jpminimal`, `versionName` `0.1.0`

## Telas

Tabs: Início, Catálogo, Sacola, Conta. Busca no topo.

Home, catálogo, PDP, busca, sacola, checkout simulado (Pix/cartão/boleto/retirada), login/cadastro, pedidos, favoritos.

Pagamentos, estoque e pedidos são simulados. Peças = emoji no wash da cor.

## API (produção)

`https://jp-moda-minimalista.onrender.com` — Render + MongoDB Atlas.

Conta demo: `demo@jpstore.com.br` / `demo1234`

Render free dorme; 1ª request ~30–50 s. Timeouts longos + retry no OkHttp.

Local opcional: `npm run dev` em `..\Roupas Lojas\backend` e `API_BASE_URL=http://10.0.2.2:4000` (emulador) ou IP LAN (celular).

## Visual (não quebrar)

- Ink `#111111` · Paper `#FAFAF7` · Sand `#F3F0E9` · Gold `#C6A87C` · Mist `#7A7A74` · Line `#E9E5DC`
- Botão: pílula preta, texto Paper. Chip selecionado: preto + texto claro. Sem lilás do Material 3.
- Topo: **JP** dourado + **MINIMAL** preto.
- Ícone: monograma JP dourado em fundo Ink, inset 18% (máscara circular).
- Tipografia sem `color` fixo no TextStyle (senão o texto some em botão preto).

## iOS

Prompt para o app Swift: `..\SWIFT-IOS-PROMPT.md`. Nova pasta: `..\jp-minimal-ios`. Não misturar Xcode nesta pasta Android.
