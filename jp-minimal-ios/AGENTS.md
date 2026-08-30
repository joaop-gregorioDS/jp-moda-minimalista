# JP Minimal — iOS (nativo, SwiftUI)

Workspace: `K:\Grok\Roupas Lojas Deploy-app\jp-minimal-ios`

Sessão Grok: **JP Loja-APP IOS** (`01a04ef1-03da-7871-98f9-cfb09b39aa6d`).  
CWD da sessão: `K:\Grok\Roupas Lojas Deploy-app`.

Retomar: `/resume` e filtrar `JP Loja-APP IOS`, ou no terminal:

```sh
grok --resume "JP Loja-APP IOS"
```

Terceiro cliente nativo da **mesma API** da loja web e do Android. Sem Next.js, sem Mongo no device.

Não misturar com `jp-minimal-android` nem com `Roupas Lojas`.

## Stack

- Swift 5.10+ / SwiftUI, iOS 17+
- TabView custom + NavigationStack
- `URLSession` + async/await + Codable
- Keychain (token), UserDefaults JSON (sacola e favoritos)
- Bundle ID `br.com.jpminimal`, versão `0.1.0`

## API

`https://jp-moda-minimalista.onrender.com` — em `Config/Production.xcconfig` e `Info.plist`.

Conta demo: `demo@jpstore.com.br` / `demo1234`

Render free dorme; 1ª request ~30–50 s. Timeouts longos + 1 retry.

## Visual (não quebrar)

- Ink `#111111` · Paper `#FAFAF7` · Sand `#F3F0E9` · Gold `#C6A87C` · Mist `#7A7A74` · Line `#E9E5DC`
- Botão: pílula Ink, texto Paper. Chip selecionado: Ink + texto Paper. Sem lilás do sistema.
- Topo: **JP** Gold + **MINIMAL** Ink.
- Ícone: monograma JP Gold em fundo Ink, inset 18%.
- Tipografia sem cor cravada no estilo.

## Abrir

No Mac: `open JPMinimal.xcodeproj`
