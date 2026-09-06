import Foundation
import Observation

@Observable
@MainActor
final class BagStore {
    private let key = "jp_minimal.bag"
    private var persistEnabled = false
    var items: [CartLine] = []

    var quantityTotal: Int { items.reduce(0) { $0 + $1.quantity } }
    var subtotal: Double { items.reduce(0) { $0 + $1.price * Double($1.quantity) } }

    init() {
        load()
        persistEnabled = true
    }

    func add(_ line: CartLine) {
        if let idx = items.firstIndex(where: { $0.key == line.key }) {
            var existing = items[idx]
            let cap = max(existing.stock, 1)
            existing.quantity = min(existing.quantity + line.quantity, cap)
            items[idx] = existing
        } else {
            items.append(line)
        }
        persist()
    }

    func setQty(key: String, qty: Int) {
        guard let idx = items.firstIndex(where: { $0.key == key }) else { return }
        if qty <= 0 {
            items.remove(at: idx)
        } else {
            var line = items[idx]
            line.quantity = min(qty, max(line.stock, 1))
            items[idx] = line
        }
        persist()
    }

    func remove(key: String) {
        items.removeAll { $0.key == key }
        persist()
    }

    func clear() {
        items = []
        persist()
    }

    private func load() {
        guard let data = UserDefaults.standard.data(forKey: key) else { return }
        items = (try? JSONCoders.decoder.decode([CartLine].self, from: data)) ?? []
    }

    private func persist() {
        guard persistEnabled else { return }
        if let data = try? JSONCoders.encoder.encode(items) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }
}
