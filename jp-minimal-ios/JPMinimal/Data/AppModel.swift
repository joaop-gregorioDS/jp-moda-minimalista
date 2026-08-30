import SwiftUI
import Observation

enum AppTab: Int, CaseIterable, Identifiable, Hashable {
    case home, catalog, bag, account

    var id: Int { rawValue }

    var title: String {
        switch self {
        case .home: "Início"
        case .catalog: "Catálogo"
        case .bag: "Sacola"
        case .account: "Conta"
        }
    }

    var icon: String {
        switch self {
        case .home: "house"
        case .catalog: "storefront"
        case .bag: "bag"
        case .account: "person.crop.circle"
        }
    }
}

enum Route: Hashable {
    case product(String)
    case search
    case checkout
    case login
    case register
    case orders
    case favorites
}

@Observable
@MainActor
final class AppModel {
    let api: APIClient
    let bag: BagStore
    let favorites: FavoritesStore
    let session: SessionStore

    var selectedTab: AppTab = .home
    var catalogCategory: String?
    var path = NavigationPath()

    var showsTabBar: Bool { path.isEmpty }

    init() {
        let api = APIClient()
        self.api = api
        self.bag = BagStore()
        self.favorites = FavoritesStore()
        self.session = SessionStore(api: api)
    }

    func bootstrap() async {
        await session.restore()
    }

    func openSearch() {
        path.append(Route.search)
    }

    func openProduct(_ slug: String) {
        path.append(Route.product(slug))
    }

    func openCatalog(category: String?) {
        if let category {
            catalogCategory = category
        }
        path = NavigationPath()
        selectedTab = .catalog
    }

    func openCheckout() {
        path.append(Route.checkout)
    }

    func openLogin() {
        path.append(Route.login)
    }

    func openRegister() {
        path.append(Route.register)
    }

    func openOrders() {
        path.append(Route.orders)
    }

    func openFavorites() {
        path.append(Route.favorites)
    }

    func pop() {
        if !path.isEmpty { path.removeLast() }
    }
}
