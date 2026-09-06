import Foundation
import Observation

@Observable
@MainActor
final class FavoritesStore {
    private let key = "jp_minimal.favorites"
    private var persistEnabled = false
    var ids: Set<Int> = []

    init() {
        load()
        persistEnabled = true
    }

    func contains(_ id: Int) -> Bool { ids.contains(id) }

    func toggle(_ id: Int) {
        var next = ids
        if next.contains(id) { next.remove(id) } else { next.insert(id) }
        ids = next
        persist()
    }

    private func load() {
        if let data = UserDefaults.standard.data(forKey: key),
           let decoded = try? JSONCoders.decoder.decode([Int].self, from: data) {
            ids = Set(decoded)
            return
        }
        if let strings = UserDefaults.standard.stringArray(forKey: key) {
            ids = Set(strings.compactMap(Int.init))
        }
    }

    private func persist() {
        guard persistEnabled else { return }
        if let data = try? JSONCoders.encoder.encode(Array(ids)) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }
}
