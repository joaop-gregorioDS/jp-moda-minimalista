import SwiftUI

struct CatalogView: View {
    @Environment(AppModel.self) private var model
    @State private var loading = true
    @State private var error: String?
    @State private var products: [ProductCard] = []
    @State private var total = 0
    @State private var categories: [Category] = []
    @State private var category: String?
    @State private var size: String?
    @State private var order = "newest"

    private let sizes = ["PP", "P", "M", "G", "GG", "Único"]
    private let orders: [(id: String, label: String)] = [
        ("newest", "Novidades"),
        ("price-asc", "Menor preço"),
        ("price-desc", "Maior preço"),
        ("sale", "Promoção"),
        ("name", "Nome"),
    ]

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        let _ = model.catalogCategory
        VStack(spacing: 0) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(categories) { cat in
                        JpFilterChip(label: cat.name, selected: category == cat.slug) {
                            category = (category == cat.slug) ? nil : cat.slug
                            model.catalogCategory = category
                            Task { await refresh() }
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
            }

            HStack {
                Menu {
                    Button("Todos") {
                        size = nil
                        Task { await refresh() }
                    }
                    ForEach(sizes, id: \.self) { s in
                        Button(s) {
                            size = s
                            Task { await refresh() }
                        }
                    }
                } label: {
                    Text(size ?? "Tamanho")
                        .font(TypeScale.bodyMedium)
                        .foregroundStyle(Palette.ink)
                }
                .tint(Palette.ink)

                Menu {
                    ForEach(orders, id: \.id) { item in
                        Button(item.label) {
                            order = item.id
                            Task { await refresh() }
                        }
                    }
                } label: {
                    Text(orders.first(where: { $0.id == order })?.label ?? "Ordenar")
                        .font(TypeScale.bodyMedium)
                        .foregroundStyle(Palette.ink)
                }
                .tint(Palette.ink)

                Spacer()
                Text("\(total) peças")
                    .font(TypeScale.bodyMedium)
                    .foregroundStyle(Palette.mist)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 8)

            Group {
                if loading && products.isEmpty {
                    LoadingBlock(label: "Acordando o servidor…")
                } else if let error, products.isEmpty {
                    ErrorBlock(message: error, onRetry: { Task { await refresh() } })
                } else if products.isEmpty {
                    Text("Nenhuma peça nesta filtragem.")
                        .font(TypeScale.bodyMedium)
                        .foregroundStyle(Palette.mist)
                        .padding(24)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                } else {
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(products) { product in
                                ProductCardView(product: product) {
                                    model.openProduct(product.slug)
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 8)
                        .padding(.bottom, 24)
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .background(Palette.paper)
        .task { await bootstrap() }
        .onChange(of: model.catalogCategory) { _, seed in
            if seed != category {
                category = seed
                Task { await refresh() }
            }
        }
    }

    private func bootstrap() async {
        if let seed = model.catalogCategory {
            category = seed
        }
        async let cats: () = loadCategories()
        async let page: () = refresh()
        _ = await (cats, page)
    }

    private func loadCategories() async {
        categories = (try? await model.api.categories()) ?? []
    }

    private func refresh() async {
        loading = true
        error = nil
        do {
            let page = try await model.api.products(category: category, size: size, order: order, page: 1)
            products = page.products
            total = page.total
        } catch {
            self.error = APIClient.friendly(error)
        }
        loading = false
    }
}
