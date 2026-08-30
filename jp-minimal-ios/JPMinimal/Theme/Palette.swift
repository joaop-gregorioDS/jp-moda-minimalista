import SwiftUI
import UIKit

enum Palette {
    static let ink = Color(hex: "#111111")
    static let inkSoft = Color(hex: "#1C1C1C")
    static let paper = Color(hex: "#FAFAF7")
    static let sand = Color(hex: "#F3F0E9")
    static let gold = Color(hex: "#C6A87C")
    static let goldDark = Color(hex: "#A88758")
    static let goldLight = Color(hex: "#E5D8BF")
    static let mist = Color(hex: "#7A7A74")
    static let line = Color(hex: "#E9E5DC")
    static let error = Color(hex: "#8B2E3A")

    static let uiInk = UIColor(red: 17 / 255, green: 17 / 255, blue: 17 / 255, alpha: 1)
    static let uiPaper = UIColor(red: 250 / 255, green: 250 / 255, blue: 247 / 255, alpha: 1)
    static let uiGold = UIColor(red: 198 / 255, green: 168 / 255, blue: 124 / 255, alpha: 1)
    static let uiMist = UIColor(red: 122 / 255, green: 122 / 255, blue: 116 / 255, alpha: 1)
}

extension Color {
    init(hex: String) {
        var raw = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if raw.hasPrefix("#") { raw.removeFirst() }
        var value: UInt64 = 0
        guard Scanner(string: raw).scanHexInt64(&value) else {
            self = Color(red: 17 / 255, green: 17 / 255, blue: 17 / 255)
            return
        }
        switch raw.count {
        case 6:
            self = Color(
                red: Double((value & 0xFF0000) >> 16) / 255,
                green: Double((value & 0x00FF00) >> 8) / 255,
                blue: Double(value & 0x0000FF) / 255
            )
        case 8:
            self = Color(
                red: Double((value & 0xFF000000) >> 24) / 255,
                green: Double((value & 0x00FF0000) >> 16) / 255,
                blue: Double((value & 0x0000FF00) >> 8) / 255,
                opacity: Double(value & 0x000000FF) / 255
            )
        default:
            self = Color(red: 17 / 255, green: 17 / 255, blue: 17 / 255)
        }
    }
}

enum TypeScale {
    static let headlineLarge = Font.system(size: 32, weight: .black)
    static let headlineMedium = Font.system(size: 24, weight: .bold)
    static let titleLarge = Font.system(size: 20, weight: .semibold)
    static let titleMedium = Font.system(size: 16, weight: .semibold)
    static let bodyLarge = Font.system(size: 16, weight: .regular)
    static let bodyMedium = Font.system(size: 14, weight: .regular)
    static let bodySmall = Font.system(size: 12, weight: .regular)
    static let labelLarge = Font.system(size: 13, weight: .semibold)
    static let labelSmall = Font.system(size: 11, weight: .medium)
    static let wordmark = Font.system(size: 20, weight: .black)
}
