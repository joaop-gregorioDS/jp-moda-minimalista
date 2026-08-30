# JP Moda Minimalista - Ecossistema Completo 🛍️

Este repositório abriga o ecossistema completo da **JP Minimal**, uma loja virtual de demonstração (portfólio) focada em uma experiência minimalista. O projeto é composto por um Backend centralizado que serve a três clientes diferentes: Web, Android e iOS.

*Nota: Este é um projeto de portfólio. As compras, pagamentos e estoques são **simulados**.*

## 📸 Demonstração nas 3 Plataformas

Abaixo, veja a coerência visual e o Design System do projeto rodando nas três plataformas consumindo a mesma API.

### 🏠 Tela Inicial (Home)
| 🌐 Web (Next.js) | 🤖 Android (Compose) | 🍎 iOS (SwiftUI) |
|:---:|:---:|:---:|
| <img src="./docs/Web%20Home.png" width="400"/> | <img src="./docs/Android%20Home.png" width="220"/> | <img src="./docs/IOS%20Home.PNG" width="220"/> |

### 🛍️ Catálogo / Produto
| 🌐 Web (Produto) | 🤖 Android (Catálogo) | 🍎 iOS (Catálogo) |
|:---:|:---:|:---:|
| <img src="./docs/Web%20produto.png" width="400"/> | <img src="./docs/Android%20Catalogo.png" width="220"/> | <img src="./docs/IOS%20catalogo.PNG" width="220"/> |

### 🛒 Sacola / Carrinho
| 🌐 Web (Carrinho) | 🤖 Android (Sacola) | 🍎 iOS (Sacola) |
|:---:|:---:|:---:|
| <img src="./docs/Web%20carrinho.png" width="400"/> | <img src="./docs/Android%20sacola.png" width="220"/> | <img src="./docs/IOS%20Sacola.PNG" width="220"/> |

## 🏗️ Arquitetura do Projeto (Monorepo)

O projeto está dividido em três frentes principais:

- 🌐 **[Web / API](./Roupas%20Lojas)**: Frontend construído com **Next.js** e Backend com **Node.js/Express** + **MongoDB Atlas**. A API gerencia os produtos, usuários e pedidos para todos os clientes. (Hospedado no Render / Vercel).
- 🤖 **[Android](./jp-minimal-android)**: Aplicativo nativo construído com **Kotlin** e **Jetpack Compose**. (Finalizado e testado).
- 🍎 **[iOS](./jp-minimal-ios)**: Aplicativo nativo construído com **Swift** e **SwiftUI** (iOS 17+).

## 🚀 Tecnologias Utilizadas

### Backend e Web (Roupas Lojas)
- **Frameworks:** Next.js, React, Express
- **Banco de Dados:** MongoDB Atlas
- **Deploy:** Render (API) e Vercel (Frontend Web)

### Android
- **Linguagem:** Kotlin
- **UI:** Jetpack Compose
- **Arquitetura:** MVVM, Coroutines, Retrofit/Ktor, DataStore local.

### iOS
- **Linguagem:** Swift 5.10+
- **UI:** SwiftUI (iOS 17+)
- **Gerenciamento:** URLSession (async/await), Keychain para tokens, UserDefaults.

## 🛠️ Como rodar o projeto localmente

### 1. Backend e Web
Navegue até a pasta `Roupas Lojas`. Crie um arquivo `.env.local` baseado no `.env.example` com sua string do MongoDB.
```bash
cd "Roupas Lojas"
npm install
npm run dev
```
*(O frontend e a API subirão juntos no ambiente local).*

### 2. Android
Abra a pasta `jp-minimal-android` no **Android Studio**. Aguarde a sincronização do Gradle e execute em um emulador.
*(A URL da API pode ser alterada no arquivo `ApiService.kt` ou variáveis de build, caso queira apontar para localhost).*

### 3. iOS
Navegue até a pasta `jp-minimal-ios` e abra no **Xcode** (em um Mac).
```bash
cd jp-minimal-ios
open JPMinimal.xcodeproj
```
Selecione o simulador e rode (Cmd + R). A URL da API está configurada em `Config/Production.xcconfig`.

## 💡 Destaques e Soluções
- **Cold Start do Servidor:** Como o backend usa o plano gratuito do Render, os aplicativos Mobile foram programados para informar ao usuário que o servidor está "acordando" caso haja demora na primeira requisição.
- **Ecossistema Único:** O uso do mesmo banco de dados (MongoDB) e API garante que os produtos e carrinho reflitam de maneira lógica a comunicação multi-plataforma.
- **Design System Coeso:** As mesmas paletas de cores (Ink, Paper, Sand, Gold) e regras visuais foram respeitadas em Kotlin e Swift sem depender de bibliotecas externas complexas.

## 📱 Contato
- **Desenvolvedor:** João Paulo Gregorio
- **E-mail:** joaop.gregorio@outlook.com
- **WhatsApp:** +55 (11) 98388-1984
- **GitHub:** [joaop-gregorioDS](https://github.com/joaop-gregorioDS)
