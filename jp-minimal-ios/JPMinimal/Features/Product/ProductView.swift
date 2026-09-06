import SwiftUI

struct ProductView: View {
    @Environment(AppModel.self) private var model
    let idOrSlug: String

    @State private var loading = true
    @State private var error: String?
    @State private var product: Product?
    @State private var related: [ProductCard] = []
    @State private var size: String?
    @State private var color: ProductColor?
    @State private var toast: String?

    var body: some View {
        ZStack(alignment: .bottom) {
            Group {
                if loading && product == nil {
                    LoadingBlock(label: "Acordando o servidor…")
                } else if let error, product == nil {
                    ErrorBlock(message: error, onRetry: { Task { await load() } })
                } else if let product {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 0) {
                            ProductVisualBox(
                                motif: product.visual,
                                colorHex: color?.hex ?? product.colors.first?.hex ?? "#111111",
                                corner: 16
                            )
                            .aspectRatio(1, contentMode: .fit)

                            HStack(alignment: .top) {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(product.categoryName.uppercased())
                                        .font(TypeScale.labelSmall)
                                        .tracking(1.6)
                                        .foregroundStyle(Palette.mist)
                                    Text(product.name)
                                        .font(TypeScale.headlineMedium)
                                        .foregroundStyle(Palette.ink)
                                }
                                Spacer()
                                Button {
                                    model.favorites.toggle(product.id)
                                } label: {
                                    Image(systemName: model.favorites.contains(product.id) ? "heart.fill" : "heart")
                                        .font(.system(size: 22))
                                        .foregroundStyle(Palette.gold)
                                }
                                .buttonStyle(.plain)
                                .accessibilityLabel("Favoritar")
                            }
                            .padding(.top, 16)

                            HStack(spacing: 8) {
                                Text(Money.formatBRL(product.price))
                                    .font(TypeScale.titleLarge)
                                    .foregroundStyle(Palette.ink)
                                if let compare = product.compareAtPrice, compare > product.price {
                                    Text(Money.formatBRL(compare))
                                        .font(TypeScale.bodyLarge)
                                        .foregroundStyle(Palette.mist)
                                        .strikethrough()
                                }
                                if let pct = product.discountPct {
                                    Text("\(pct)% off")
                                        .font(TypeScale.bodyMedium)
                                        .foregroundStyle(Palette.gold)
                                }
                            }
                            .padding(.top, 8)

                            Text(product.description)
                                .font(TypeScale.bodyLarge)
                                .foregroundStyle(Palette.mist)
                                .padding(.top, 12)

                            if !product.colors.isEmpty {
                                Text("Cor")
                                    .font(TypeScale.labelLarge)
                                    .tracking(1.4)
                                    .foregroundStyle(Palette.ink)
                                    .padding(.top, 16)
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 8) {
                                        ForEach(product.colors, id: \.self) { c in
                                            Circle()
                                                .fill(Color(hex: c.hex))
                                                .frame(width: 32, height: 32)
                                                .overlay(
                                                    Circle().stroke(color == c ? Palette.ink : Palette.line, lineWidth: 2)
                                                )
                                                .onTapGesture { color = c }
                                                .accessibilityLabel(c.name)
                                        }
                                    }
                                }
                                .padding(.top, 8)
                            }

                            if !product.sizes.isEmpty {
                                Text("Tamanho")
                                    .font(TypeScale.labelLarge)
                                    .tracking(1.4)
                                    .foregroundStyle(Palette.ink)
                                    .padding(.top, 16)
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 8) {
                                        ForEach(product.sizes, id: \.self) { s in
                                            JpFilterChip(label: s, selected: size == s) { size = s }
                                        }
                                    }
                                }
                                .padding(.top, 8)
                            }

                            JpButton(
                                title: product.stock > 0 ? "Adicionar à sacola" : "Esgotado",
                                enabled: product.stock > 0 && (product.sizes.count <= 1 || size != nil)
                            ) {
                                addToBag(product)
                            }
                            .padding(.top, 16)

                            if !related.isEmpty {
                                Text("Quem viu, viu também")
                                    .font(TypeScale.titleLarge)
                                    .foregroundStyle(Palette.ink)
                                    .padding(.top, 24)
                                    .padding(.bottom, 12)
                                ForEach(Array(related.prefix(4))) { rel in
                                    ProductCardView(product: rel) {
                                        model.openProduct(rel.slug)
                                    }
                                    .padding(.bottom, 12)
                                }
                            }
                        }
                        .padding(16)
                    }
                }
            }

            if let toast {
                Text(toast)
                    .font(TypeScale.bodyMedium)
                    .foregroundStyle(Palette.paper)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(Palette.ink, in: Capsule())
                    .padding(.bottom, 24)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .background(Palette.paper)
        .task(id: idOrSlug) { await load() }
        .animation(.easeInOut(duration: 0.2), value: toast)
    }

    private func load() async {
        loading = true
        error = nil
        do {
            async let p = model.api.product(idOrSlug)
            async let r = model.api.related(idOrSlug)
            let loaded = try await p
            related = (try? await r) ?? []
            product = loaded
            if color == nil { color = loaded.colors.first }
            if size == nil { size = loaded.sizes.first }
        } catch {
            self.error = APIClient.friendly(error)
        }
        loading = false
    }

    private func addToBag(_ product: Product) {
        model.bag.add(
            CartLine(
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                visual: product.visual,
                colorName: color?.name ?? "",
                colorHex: color?.hex ?? "#111111",
                size: size ?? product.sizes.first ?? "Único",
                quantity: 1,
                stock: product.stock
            )
        )
        toast = "Adicionado à sacola"
        Task {
            try? await Task.sleep(for: .seconds(1.6))
            if toast == "Adicionado à sacola" { toast = nil }
        }
    }
}
