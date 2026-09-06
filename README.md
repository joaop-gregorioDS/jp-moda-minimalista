# JP Minimal

Loja virtual de moda de **demonstração**, com o mesmo catálogo no web, Android e iOS.

Pagamentos, estoque e frete são simulados. Não há cobrança real.

[Live](https://jp-moda-minimalista.vercel.app)

---

## Demonstração

| Plataforma | Acesso |
| :--- | :--- |
| Web | [jp-moda-minimalista.vercel.app](https://jp-moda-minimalista.vercel.app) |
| Android / iOS | clientes nativos da mesma API |

### Conta de um clique

| E-mail | Senha |
| :--- | :--- |
| `demo@jpstore.com.br` | `demo1234` |

**Caminho do avaliador:** início → produto → sacola → entrar → checkout simulado → pedidos.

Rotas de conta e pedido exigem token. Sem autenticação, o checkout não grava pedido.

### Telas

| Web | Android | iOS |
| :---: | :---: | :---: |
| <img src="./docs/Web%20Home.png" width="400"/> | <img src="./docs/Android%20Home.png" width="220"/> | <img src="./docs/IOS%20Home.PNG" width="220"/> |
| <img src="./docs/Web%20produto.png" width="400"/> | <img src="./docs/Android%20Catalogo.png" width="220"/> | <img src="./docs/IOS%20catalogo.PNG" width="220"/> |
| <img src="./docs/Web%20carrinho.png" width="400"/> | <img src="./docs/Android%20sacola.png" width="220"/> | <img src="./docs/IOS%20Sacola.PNG" width="220"/> |

---

## O que é real e o que é simulado

| Real (grava na API) | Simulado |
| :--- | :--- |
| Cadastro, login, sessão | Pix, cartão, boleto |
| Catálogo e busca | Estoque e logística |
| Sacola, favoritos, pedido | Nota fiscal |

No plano gratuito a API pode dormir. A primeira chamada pode levar alguns segundos.

---

## Código

```
Roupas Lojas/          site Next.js + API Express
jp-minimal-android/    cliente Android
jp-minimal-ios/        cliente iOS
```

Stack: Next.js · Express · MongoDB Atlas · Kotlin · SwiftUI.

---

## Licença

Projeto de portfólio. Uso livre para avaliação.
