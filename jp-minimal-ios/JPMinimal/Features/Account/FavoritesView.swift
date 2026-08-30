import SwiftUI

struct FavoritesView: View {
    @Environment(AppModel.self) private var model
    @State private var products: [ProductCard] = []
    @State private var loading = false

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Favoritos")
                .font(TypeScale.headlineMedium)
                .foregroundStyle(Palette.ink)

            if loading && products.isEmpty {
                LoadingBlock()
            } else if products.isEmpty {
                Text("Nenhuma peça salva.")
                    .font(TypeScale.bodyLarge)
                    .foregroundStyle(Palette.mist)
                Spacer()
            } else {
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(products) { product in
                            ProductCardView(product: product) {
                                model.openProduct(product.slug)
                            }
                        }
                    }
                    .padding(.bottom, 24)
                }
            }
        }
        .padding(16)
        .background(Palette.paper)
        .task(id: Array(model.favorites.ids).sorted()) { await load() }
    }

    private func load() async {
        let ids = Array(model.favorites.ids)
        if ids.isEmpty {
            products = []
            return
        }
        loading = true
        products = (try? await model.api.byIds(ids)) ?? []
        loading = false
    }
}
