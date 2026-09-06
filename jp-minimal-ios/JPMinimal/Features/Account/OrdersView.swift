import SwiftUI

struct OrdersView: View {
    @Environment(AppModel.self) private var model
    @State private var orders: [Order] = []
    @State private var error: String?
    @State private var loading = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Pedidos")
                .font(TypeScale.headlineMedium)
                .foregroundStyle(Palette.ink)

            if model.session.user == nil {
                Text("Entre para ver seus pedidos.")
                    .font(TypeScale.bodyLarge)
                    .foregroundStyle(Palette.mist)
                JpButton(title: "Entrar") { model.openLogin() }
            } else if loading && orders.isEmpty {
                LoadingBlock(label: "Acordando o servidor…")
            } else {
                if let error {
                    Text(error)
                        .font(TypeScale.bodyMedium)
                        .foregroundStyle(Palette.error)
                }
                if orders.isEmpty && error == nil {
                    Text("Nenhum pedido ainda.")
                        .font(TypeScale.bodyLarge)
                        .foregroundStyle(Palette.mist)
                }
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 12) {
                        ForEach(orders) { order in
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Pedido #\(order.id) · \(order.status)")
                                    .font(TypeScale.titleMedium)
                                    .foregroundStyle(Palette.ink)
                                Text(Money.formatBRL(order.total))
                                    .font(TypeScale.bodyMedium)
                                    .foregroundStyle(Palette.mist)
                                ForEach(order.items) { line in
                                    HStack(spacing: 8) {
                                        ProductVisualBox(motif: line.visual, colorHex: "#111111")
                                            .frame(width: 40, height: 40)
                                        Text("\(line.quantity)× \(line.productName)")
                                            .font(TypeScale.bodyMedium)
                                            .foregroundStyle(Palette.ink)
                                    }
                                    .padding(.top, 4)
                                }
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }
            }
            Spacer(minLength: 0)
        }
        .padding(16)
        .background(Palette.paper)
        .task(id: model.session.user?.id) { await load() }
    }

    private func load() async {
        guard model.session.user != nil else { return }
        loading = true
        error = nil
        do {
            orders = try await model.api.orders()
        } catch {
            self.error = APIClient.friendly(error)
        }
        loading = false
    }
}
