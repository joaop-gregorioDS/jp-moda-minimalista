import SwiftUI
import UIKit

@main
struct JPMinimalApp: App {
    @State private var model = AppModel()

    init() {
        let nav = UINavigationBarAppearance()
        nav.configureWithOpaqueBackground()
        nav.backgroundColor = Palette.uiPaper
        nav.shadowColor = .clear
        nav.titleTextAttributes = [.foregroundColor: Palette.uiInk]
        UINavigationBar.appearance().standardAppearance = nav
        UINavigationBar.appearance().scrollEdgeAppearance = nav
        UINavigationBar.appearance().compactAppearance = nav
        UINavigationBar.appearance().tintColor = Palette.uiInk
        UITextField.appearance().tintColor = Palette.uiGold
        UIView.appearance(whenContainedInInstancesOf: [UIAlertController.self]).tintColor = Palette.uiInk
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(model)
                .preferredColorScheme(.light)
                .tint(Palette.gold)
                .task { await model.bootstrap() }
        }
    }
}
