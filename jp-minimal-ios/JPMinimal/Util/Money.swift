import Foundation

enum Money {
    static let freeShippingThreshold = 299.0
    static let shippingFixed = 24.90

    private static let formatter: NumberFormatter = {
        let f = NumberFormatter()
        f.numberStyle = .currency
        f.locale = Locale(identifier: "pt_BR")
        f.currencyCode = "BRL"
        return f
    }()

    static func formatBRL(_ value: Double) -> String {
        formatter.string(from: NSNumber(value: value)) ?? "R$ 0,00"
    }

    static func shippingFor(subtotal: Double, pickup: Bool) -> Double {
        if pickup || subtotal >= freeShippingThreshold { return 0 }
        return shippingFixed
    }

    static func paymentDiscount(subtotal: Double, payment: String, pickup: Bool) -> Double {
        if pickup { return 0 }
        if payment == "pix" || payment == "boleto" {
            return (subtotal * 0.05 * 100).rounded() / 100
        }
        return 0
    }
}
