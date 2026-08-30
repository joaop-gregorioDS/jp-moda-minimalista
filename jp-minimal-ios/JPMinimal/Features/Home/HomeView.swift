import SwiftUI

struct HomeView: View {
    @Environment(AppModel.self) private var model
    @State private var loading = true
    @State private var error: String?
    @State private var categories: [Category] = []
    @State private var featured: [ProductCard] = []
    @State private var latest: [ProductCard] = []

    private let columns = [
        GridItem(.flexible(), spacing: 12),
        GridItem(.flexible(), spacing: 12),
    ]

    var body: some View {
        Group {
            if loading && featured.isEmpty {
                LoadingBlock(label: "Acordando o servidor…")
            } else if let error, featured.isEmpty {
                ErrorBlock(message: error, onRetry: { Task { await load() } })
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 12) {
                        hero
                        if !categories.isEmpty { categoryStrip }
                        Text("Destaques")
                            .font(TypeScale.titleLarge)
                            .foregroundStyle(Palette.ink)
                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(featured) { product in
                                ProductCardView(product: product) {
                                    model.openProduct(product.slug)
                                }
                            }
                        }
                        Text("Novidades")
                            .font(TypeScale.titleLarge)
                            .foregroundStyle(Palette.ink)
                            .padding(.top, 8)
                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(latest) { product in
                                ProductCardView(product: product) {
                                    model.openProduct(product.slug)
                                }
                            }
                        }
                    }
                    .padding(16)
                    .padding(.bottom, 24)
                }
            }
        }
        .background(Palette.paper)
        .task { await load() }
    }

    private var hero: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("JP")
                .font(TypeScale.headlineLarge)
                .tracking(-0.5)
                .foregroundStyle(Palette.gold)
            Text("MINIMAL")
                .font(TypeScale.labelSmall)
                .tracking(1.6)
                .foregroundStyle(Palette.gold)
            Text("Moda minimalista em tons sóbrios com toques de dourado.")
                .font(TypeScale.bodyLarge)
                .foregroundStyle(Palette.paper.opacity(0.8))
                .padding(.top, 12)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(24)
        .background(Palette.ink, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }

    private var categoryStrip: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(categories) { cat in
                    Button {
                        model.openCatalog(category: cat.slug)
                    } label: {
                        Text(cat.name)
                            .font(TypeScale.bodyMedium)
                            .foregroundStyle(Palette.ink)
                            .lineLimit(1)
                            .fixedSize(horizontal: true, vertical: false)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(Palette.sand, in: Capsule())
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private func load() async {
        loading = true
        error = nil
        do {
            async let c = model.api.categories()
            async let f = model.api.featured()
            async let l = model.api.latest()
            categories = try await c
            featured = try await f
            latest = try await l
        } catch {
            self.error = APIClient.friendly(error)
        }
        loading = false
    }
}
