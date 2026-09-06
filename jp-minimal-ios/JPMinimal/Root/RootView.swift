import SwiftUI

struct RootView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        @Bindable var model = model
        NavigationStack(path: $model.path) {
            tabRoot
                .background(Palette.paper)
                .jpToolbar { model.openSearch() }
                .safeAreaInset(edge: .top, spacing: 0) { DemoBanner() }
                .safeAreaInset(edge: .bottom, spacing: 0) {
                    if model.showsTabBar {
                        JPTabBar(tab: $model.selectedTab, bagCount: model.bag.quantityTotal)
                    }
                }
                .navigationDestination(for: Route.self) { route in
                    destination(route)
                }
        }
        .tint(Palette.ink)
        .toolbarBackground(Palette.paper, for: .navigationBar)
    }

    @ViewBuilder
    private var tabRoot: some View {
        switch model.selectedTab {
        case .home: HomeView()
        case .catalog: CatalogView()
        case .bag: BagView()
        case .account: AccountView()
        }
    }

    @ViewBuilder
    private func destination(_ route: Route) -> some View {
        switch route {
        case .product(let id):
            ProductView(idOrSlug: id)
                .jpToolbar { model.openSearch() }
        case .search:
            SearchView()
                .jpToolbar(showSearch: false) {}
        case .checkout:
            CheckoutView()
                .jpToolbar { model.openSearch() }
        case .login:
            LoginView()
                .jpToolbar { model.openSearch() }
        case .register:
            RegisterView()
                .jpToolbar { model.openSearch() }
        case .orders:
            OrdersView()
                .jpToolbar { model.openSearch() }
        case .favorites:
            FavoritesView()
                .jpToolbar { model.openSearch() }
        }
    }
}

struct JPTabBar: View {
    @Binding var tab: AppTab
    var bagCount: Int

    var body: some View {
        HStack(spacing: 0) {
            ForEach(AppTab.allCases) { item in
                Button {
                    tab = item
                } label: {
                    VStack(spacing: 4) {
                        ZStack {
                            Capsule()
                                .fill(tab == item ? Palette.gold.opacity(0.35) : Color.clear)
                                .frame(width: 56, height: 32)
                            Image(systemName: item.icon)
                                .font(.system(size: 18, weight: .medium))
                                .foregroundStyle(tab == item ? Palette.ink : Palette.mist)
                            if item == .bag, bagCount > 0 {
                                Text("\(bagCount)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundStyle(Palette.paper)
                                    .padding(.horizontal, 5)
                                    .padding(.vertical, 2)
                                    .background(Palette.ink, in: Capsule())
                                    .offset(x: 14, y: -10)
                            }
                        }
                        Text(item.title)
                            .font(.system(size: 11, weight: tab == item ? .semibold : .regular))
                            .foregroundStyle(tab == item ? Palette.ink : Palette.mist)
                    }
                    .frame(maxWidth: .infinity)
                }
                .buttonStyle(.plain)
                .tint(Palette.ink)
                .accessibilityLabel(item.title)
            }
        }
        .padding(.top, 8)
        .padding(.bottom, 6)
        .padding(.horizontal, 8)
        .background(Palette.paper)
        .overlay(alignment: .top) {
            Rectangle().fill(Palette.line).frame(height: 1)
        }
    }
}
