import Foundation

struct EmojiVisual: Hashable {
    let emoji: String
    let scale: CGFloat
    let label: String
}

enum ProductEmoji {
    private static let fallback = EmojiVisual(emoji: "🛍️", scale: 0.9, label: "Peça")

    private static let map: [String: EmojiVisual] = [
        "tee": .init(emoji: "👕", scale: 1, label: "Camiseta"),
        "tee-long": .init(emoji: "👕", scale: 1.06, label: "Camiseta alongada"),
        "shirt": .init(emoji: "👔", scale: 1, label: "Camisa"),
        "shirt-camp": .init(emoji: "👕", scale: 0.96, label: "Camisa camp"),
        "pants": .init(emoji: "👖", scale: 1.08, label: "Calça"),
        "pants-wide": .init(emoji: "👖", scale: 1.14, label: "Calça wide"),
        "pants-tailored": .init(emoji: "👖", scale: 1.04, label: "Calça de alfaiataria"),
        "shorts": .init(emoji: "🩳", scale: 0.88, label: "Bermuda"),
        "shorts-chino": .init(emoji: "🩳", scale: 0.9, label: "Bermuda chino"),
        "sweater": .init(emoji: "🧶", scale: 0.92, label: "Suéter"),
        "cardigan": .init(emoji: "🧥", scale: 1.08, label: "Cardigan"),
        "turtleneck": .init(emoji: "🧣", scale: 0.86, label: "Gola alta"),
        "blazer": .init(emoji: "🤵", scale: 1.12, label: "Blazer"),
        "jacket": .init(emoji: "🧥", scale: 1.16, label: "Jaqueta"),
        "letterman": .init(emoji: "🧥", scale: 1.12, label: "Jaqueta college"),
        "trucker": .init(emoji: "🧥", scale: 1.08, label: "Jaqueta trucker"),
        "coat": .init(emoji: "🧥", scale: 1.22, label: "Casaco"),
        "puffer": .init(emoji: "🧥", scale: 1.18, label: "Puffer"),
        "parka": .init(emoji: "🧥", scale: 1.2, label: "Parka"),
        "dress": .init(emoji: "👗", scale: 1.2, label: "Vestido"),
        "slip": .init(emoji: "👗", scale: 1.14, label: "Vestido slip"),
        "skirt": .init(emoji: "👗", scale: 0.92, label: "Saia"),
        "skirt-full": .init(emoji: "👗", scale: 1.02, label: "Saia evasê"),
        "sneaker": .init(emoji: "👟", scale: 0.86, label: "Tênis"),
        "loafer": .init(emoji: "👞", scale: 0.84, label: "Sapato"),
        "bag": .init(emoji: "👜", scale: 0.78, label: "Bolsa"),
        "belt": .init(emoji: "🪢", scale: 0.64, label: "Cinto"),
        "cap": .init(emoji: "🧢", scale: 0.7, label: "Boné"),
        "scarf": .init(emoji: "🧣", scale: 0.76, label: "Cachecol"),
        "wallet": .init(emoji: "👛", scale: 0.62, label: "Carteira"),
        "watch": .init(emoji: "⌚", scale: 0.58, label: "Relógio"),
    ]

    static func visual(for motif: String) -> EmojiVisual {
        map[motif] ?? fallback
    }
}
