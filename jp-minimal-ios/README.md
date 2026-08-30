# JP Minimal — iOS

App nativo SwiftUI da loja de portfólio **JP Minimal**. Consome a API REST já publicada com o site e o Android (Express + MongoDB Atlas). Não contém backend.

Pagamentos, estoque e pedidos são **simulados**. Nenhuma cobrança real é feita.

## Stack

- Swift 5.10+ / SwiftUI, iOS 17+
- NavigationStack + tab bar própria (Início, Catálogo, Sacola, Conta)
- `URLSession` + async/await + `Codable`
- Keychain (token), UserDefaults JSON (sacola e favoritos)

O site Next.js continua em `../Roupas Lojas`. O Android validado está em `../jp-minimal-android`. Este app é o **terceiro cliente** da mesma API.

## Abrir no Xcode (Mac)

```sh
open JPMinimal.xcodeproj
```

1. Selecione o scheme **JPMinimal**
2. Escolha um iPhone simulador (iOS 17+) ou um aparelho
3. Ajuste o **Team** de assinatura em Signing & Capabilities
4. Run

Se preferir [XcodeGen](https://github.com/yonaskolb/XcodeGen):

```sh
xcodegen generate
open JPMinimal.xcodeproj
```

Conta demo: `demo@jpstore.com.br` / `demo1234`

## URL da API

Em `Config/Production.xcconfig`:

```
API_BASE_URL = https:/$()/jp-moda-minimalista.onrender.com
```

(`$()` quebra o `//` porque em xcconfig isso inicia comentário.)

O valor entra no `Info.plist` como `$(API_BASE_URL)`. Sem barra no final. HTTPS — ATS padrão.

| Onde roda | Valor |
|---|---|
| Produção (Render + Atlas) | `https://jp-moda-minimalista.onrender.com` |
| API local na máquina | `http://127.0.0.1:4000` (precisa de exceção ATS) |

Para apontar para outra URL, crie `Config/Local.xcconfig` (gitignored) ou edite o `Production.xcconfig` e dê Rebuild.

No plano free o Render **dorme**. A primeira request pode levar ~30–50 s — o app mostra “Acordando o servidor…” e permite tentar de novo.

Este repositório foi gerado em Windows. **Não há `xcodebuild` verde daqui.** Abra no Mac para compilar.

## O que o app cobre

- Início (hero, chips de categoria, destaques e novidades)
- Catálogo com filtros (categoria em scroll horizontal, tamanho, ordenar)
- PDP (cor, tamanho, emoji, favoritar, relacionados)
- Busca com preview
- Sacola e favoritos (locais)
- Login / cadastro
- Checkout simulado (Pix, cartão, boleto, retirada)
- Pedidos da conta

Peças são emojis no wash da cor — iguais ao site e ao Android, sem fotos no banco.

## Contato

- E-mail: joaop.gregorio@outlook.com
- WhatsApp: +55 (11) 98388-1984
