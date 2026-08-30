import SwiftUI

struct AccountView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.openURL) private var openURL

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Conta")
                .font(TypeScale.headlineMedium)
                .foregroundStyle(Palette.ink)

            if let user = model.session.user {
                Text(user.name)
                    .font(TypeScale.titleLarge)
                    .foregroundStyle(Palette.ink)
                    .padding(.top, 4)
                Text(user.email)
                    .font(TypeScale.bodyLarge)
                    .foregroundStyle(Palette.mist)
                Button("Meus pedidos") { model.openOrders() }
                    .jpTextLink()
                Button("Favoritos") { model.openFavorites() }
                    .jpTextLink()
                Button("Sair") { model.session.logout() }
                    .jpTextLink()
            } else {
                Text("Entre para ver pedidos e dados da conta.")
                    .font(TypeScale.bodyLarge)
                    .foregroundStyle(Palette.mist)
                JpButton(title: "Entrar") { model.openLogin() }
                    .padding(.top, 4)
            }

            Text("Sobre a JP Minimal")
                .font(TypeScale.titleMedium)
                .foregroundStyle(Palette.ink)
                .padding(.top, 24)
            Text("Loja de portfólio. Pagamentos simulados.")
                .font(TypeScale.bodyMedium)
                .foregroundStyle(Palette.mist)

            Button("joaop.gregorio@outlook.com") {
                if let url = URL(string: "mailto:joaop.gregorio@outlook.com") {
                    openURL(url)
                }
            }
            .jpGoldLink()

            Button("WhatsApp +55 (11) 98388-1984") {
                if let url = URL(string: "https://wa.me/5511983881984") {
                    openURL(url)
                }
            }
            .jpGoldLink()

            Spacer()
        }
        .padding(16)
        .background(Palette.paper)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

extension View {
    func jpTextLink() -> some View {
        self
            .font(TypeScale.bodyLarge)
            .foregroundStyle(Palette.ink)
            .buttonStyle(.plain)
            .padding(.top, 4)
    }

    func jpGoldLink() -> some View {
        self
            .font(TypeScale.bodyLarge)
            .foregroundStyle(Palette.gold)
            .buttonStyle(.plain)
            .padding(.top, 2)
    }
}
