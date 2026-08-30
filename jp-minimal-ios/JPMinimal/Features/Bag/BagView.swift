import SwiftUI

struct BagView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Sacola")
                .font(TypeScale.headlineMedium)
                .foregroundStyle(Palette.ink)
                .padding(.bottom, 12)

            if model.bag.items.isEmpty {
                Text("Sua sacola está vazia.")
                    .font(TypeScale.bodyLarge)
                    .foregroundStyle(Palette.mist)
                    .padding(.top, 12)
                JpButton(title: "Ver catálogo") {
                    model.openCatalog(category: nil)
                }
                .padding(.top, 16)
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(model.bag.items) { line in
                            HStack(alignment: .center, spacing: 12) {
                                ProductVisualBox(motif: line.visual, colorHex: line.colorHex)
                                    .frame(width: 72, height: 72)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(line.name)
                                        .font(TypeScale.titleMedium)
                                        .foregroundStyle(Palette.ink)
                                    Text("\(line.size) · \(line.colorName)")
                                        .font(TypeScale.bodyMedium)
                                        .foregroundStyle(Palette.mist)
                                    Text(Money.formatBRL(line.price * Double(line.quantity)))
                                        .font(TypeScale.bodyMedium)
                                        .foregroundStyle(Palette.ink)
                                    HStack(spacing: 12) {
                                        Button("−") { model.bag.setQty(key: line.key, qty: line.quantity - 1) }
                                            .foregroundStyle(Palette.ink)
                                        Text("\(line.quantity)")
                                            .font(TypeScale.bodyLarge)
                                            .foregroundStyle(Palette.ink)
                                            .frame(minWidth: 20)
                                        Button("+") { model.bag.setQty(key: line.key, qty: line.quantity + 1) }
                                            .foregroundStyle(Palette.ink)
                                    }
                                    .buttonStyle(.plain)
                                }
                                Spacer()
                                Button {
                                    model.bag.remove(key: line.key)
                                } label: {
                                    Image(systemName: "trash")
                                        .foregroundStyle(Palette.mist)
                                }
                                .buttonStyle(.plain)
                                .accessibilityLabel("Remover")
                            }
                        }
                    }
                }
                Text("Subtotal \(Money.formatBRL(model.bag.subtotal))")
                    .font(TypeScale.titleMedium)
                    .foregroundStyle(Palette.ink)
                    .padding(.vertical, 12)
                JpButton(title: "Checkout") {
                    model.openCheckout()
                }
            }
        }
        .padding(16)
        .background(Palette.paper)
    }
}
