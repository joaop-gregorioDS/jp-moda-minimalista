import Foundation

extension KeyedDecodingContainer {
    func decodeFlexibleDouble(forKey key: Key) throws -> Double {
        if let v = try? decode(Double.self, forKey: key) { return v }
        if let v = try? decode(Int.self, forKey: key) { return Double(v) }
        if let v = try? decode(String.self, forKey: key), let d = Double(v) { return d }
        throw DecodingError.dataCorruptedError(forKey: key, in: self, debugDescription: "Expected number for \(key.stringValue)")
    }

    func decodeFlexibleDoubleIfPresent(forKey key: Key) throws -> Double? {
        if !contains(key) { return nil }
        if try decodeNil(forKey: key) { return nil }
        return try decodeFlexibleDouble(forKey: key)
    }

    func decodeFlexibleInt(forKey key: Key) throws -> Int {
        if let v = try? decode(Int.self, forKey: key) { return v }
        if let v = try? decode(Double.self, forKey: key) { return Int(v) }
        if let v = try? decode(String.self, forKey: key), let i = Int(v) { return i }
        throw DecodingError.dataCorruptedError(forKey: key, in: self, debugDescription: "Expected int for \(key.stringValue)")
    }

    func decodeFlexibleIntIfPresent(forKey key: Key) throws -> Int? {
        if !contains(key) { return nil }
        if try decodeNil(forKey: key) { return nil }
        return try decodeFlexibleInt(forKey: key)
    }

    func decodeFlexibleBool(forKey key: Key, defaultValue: Bool) throws -> Bool {
        if let v = try? decode(Bool.self, forKey: key) { return v }
        if let v = try? decode(Int.self, forKey: key) { return v != 0 }
        return defaultValue
    }
}

enum JSONCoders {
    static let decoder: JSONDecoder = {
        let d = JSONDecoder()
        return d
    }()

    static let encoder: JSONEncoder = {
        let e = JSONEncoder()
        return e
    }()
}
