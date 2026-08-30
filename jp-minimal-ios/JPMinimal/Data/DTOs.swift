import Foundation

struct HealthResponse: Decodable {
    var ok: Bool
    var service: String?
    var db: String?
}

struct ErrorBody: Decodable {
    var error: String?
}

struct Category: Decodable, Identifiable, Hashable {
    var id: Int
    var slug: String
    var name: String
    var description: String?
    var accent: String
    var sortOrder: Int

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeFlexibleInt(forKey: .id)
        slug = try c.decode(String.self, forKey: .slug)
        name = try c.decode(String.self, forKey: .name)
        description = try c.decodeIfPresent(String.self, forKey: .description)
        accent = try c.decodeIfPresent(String.self, forKey: .accent) ?? "#c6a87c"
        sortOrder = try c.decodeFlexibleIntIfPresent(forKey: .sortOrder) ?? 0
    }

    private enum CodingKeys: String, CodingKey {
        case id, slug, name, description, accent, sortOrder
    }
}

struct CategoriesResponse: Decodable {
    var categories: [Category]
}

struct ProductCard: Decodable, Identifiable, Hashable {
    var id: Int
    var slug: String
    var name: String
    var price: Double
    var compareAtPrice: Double?
    var discountPct: Int?
    var visual: String
    var colorHex: String
    var categoryName: String
    var categorySlug: String
    var inStock: Bool
    var sizes: [String]

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeFlexibleInt(forKey: .id)
        slug = try c.decode(String.self, forKey: .slug)
        name = try c.decode(String.self, forKey: .name)
        price = try c.decodeFlexibleDouble(forKey: .price)
        compareAtPrice = try c.decodeFlexibleDoubleIfPresent(forKey: .compareAtPrice)
        discountPct = try c.decodeFlexibleIntIfPresent(forKey: .discountPct)
        visual = try c.decodeIfPresent(String.self, forKey: .visual) ?? "tee"
        colorHex = try c.decodeIfPresent(String.self, forKey: .colorHex) ?? "#111111"
        categoryName = try c.decodeIfPresent(String.self, forKey: .categoryName) ?? ""
        categorySlug = try c.decodeIfPresent(String.self, forKey: .categorySlug) ?? ""
        inStock = try c.decodeFlexibleBool(forKey: .inStock, defaultValue: true)
        sizes = try c.decodeIfPresent([String].self, forKey: .sizes) ?? []
    }

    private enum CodingKeys: String, CodingKey {
        case id, slug, name, price, compareAtPrice, discountPct, visual, colorHex
        case categoryName, categorySlug, inStock, sizes
    }
}

struct ProductPage: Decodable {
    var products: [ProductCard]
    var total: Int
    var page: Int
    var pageSize: Int
    var totalPages: Int

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        products = try c.decodeIfPresent([ProductCard].self, forKey: .products) ?? []
        total = try c.decodeFlexibleIntIfPresent(forKey: .total) ?? 0
        page = try c.decodeFlexibleIntIfPresent(forKey: .page) ?? 1
        pageSize = try c.decodeFlexibleIntIfPresent(forKey: .pageSize) ?? 24
        totalPages = try c.decodeFlexibleIntIfPresent(forKey: .totalPages) ?? 1
    }

    private enum CodingKeys: String, CodingKey {
        case products, total, page, pageSize, totalPages
    }
}

struct ProductCardsResponse: Decodable {
    var products: [ProductCard]
}

struct SearchResponse: Decodable {
    var results: [ProductCard]
}

struct ProductColor: Decodable, Hashable {
    var name: String
    var hex: String
}

struct Product: Decodable, Identifiable, Hashable {
    var id: Int
    var slug: String
    var sku: String
    var name: String
    var description: String
    var price: Double
    var compareAtPrice: Double?
    var categoryId: Int?
    var categoryName: String
    var categorySlug: String
    var stock: Int
    var featured: Bool
    var sizes: [String]
    var visual: String
    var colors: [ProductColor]
    var discountPct: Int?

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeFlexibleInt(forKey: .id)
        slug = try c.decode(String.self, forKey: .slug)
        sku = try c.decodeIfPresent(String.self, forKey: .sku) ?? ""
        name = try c.decode(String.self, forKey: .name)
        description = try c.decodeIfPresent(String.self, forKey: .description) ?? ""
        price = try c.decodeFlexibleDouble(forKey: .price)
        compareAtPrice = try c.decodeFlexibleDoubleIfPresent(forKey: .compareAtPrice)
        categoryId = try c.decodeFlexibleIntIfPresent(forKey: .categoryId)
        categoryName = try c.decodeIfPresent(String.self, forKey: .categoryName) ?? ""
        categorySlug = try c.decodeIfPresent(String.self, forKey: .categorySlug) ?? ""
        stock = try c.decodeFlexibleIntIfPresent(forKey: .stock) ?? 0
        featured = try c.decodeFlexibleBool(forKey: .featured, defaultValue: false)
        sizes = try c.decodeIfPresent([String].self, forKey: .sizes) ?? []
        visual = try c.decodeIfPresent(String.self, forKey: .visual) ?? "tee"
        colors = try c.decodeIfPresent([ProductColor].self, forKey: .colors) ?? []
        discountPct = try c.decodeFlexibleIntIfPresent(forKey: .discountPct)
    }

    private enum CodingKeys: String, CodingKey {
        case id, slug, sku, name, description, price, compareAtPrice, categoryId
        case categoryName, categorySlug, stock, featured, sizes, visual, colors, discountPct
    }
}

struct ProductResponse: Decodable {
    var product: Product?
    var error: String?
}

struct User: Decodable, Hashable {
    var id: Int
    var name: String
    var email: String
    var phone: String?

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeFlexibleInt(forKey: .id)
        name = try c.decode(String.self, forKey: .name)
        email = try c.decode(String.self, forKey: .email)
        phone = try c.decodeIfPresent(String.self, forKey: .phone)
    }

    private enum CodingKeys: String, CodingKey {
        case id, name, email, phone
    }
}

struct AuthResponse: Decodable {
    var token: String?
    var user: User?
    var error: String?
}

struct MeResponse: Decodable {
    var user: User?
    var error: String?
}

struct LoginBody: Encodable {
    var email: String
    var password: String
}

struct RegisterBody: Encodable {
    var name: String
    var email: String
    var password: String
    var phone: String?
}

struct OrderAddress: Codable, Hashable {
    var street: String
    var number: String
    var complement: String?
    var city: String
    var state: String
    var zip: String

    init(street: String, number: String = "", complement: String? = nil, city: String = "", state: String = "", zip: String = "") {
        self.street = street
        self.number = number
        self.complement = complement
        self.city = city
        self.state = state
        self.zip = zip
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        street = try c.decodeIfPresent(String.self, forKey: .street) ?? ""
        number = try c.decodeIfPresent(String.self, forKey: .number) ?? ""
        complement = try c.decodeIfPresent(String.self, forKey: .complement)
        city = try c.decodeIfPresent(String.self, forKey: .city) ?? ""
        state = try c.decodeIfPresent(String.self, forKey: .state) ?? ""
        zip = try c.decodeIfPresent(String.self, forKey: .zip) ?? ""
    }
}

struct OrderItem: Codable, Hashable, Identifiable {
    var productId: Int?
    var productName: String
    var price: Double
    var quantity: Int
    var color: String?
    var size: String?
    var visual: String

    var id: String { "\(productId ?? 0)-\(productName)-\(size ?? "")-\(color ?? "")" }

    init(productId: Int?, productName: String, price: Double, quantity: Int, color: String?, size: String?, visual: String) {
        self.productId = productId
        self.productName = productName
        self.price = price
        self.quantity = quantity
        self.color = color
        self.size = size
        self.visual = visual
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        productId = try c.decodeFlexibleIntIfPresent(forKey: .productId)
        productName = try c.decodeIfPresent(String.self, forKey: .productName) ?? ""
        price = try c.decodeFlexibleDoubleIfPresent(forKey: .price) ?? 0
        quantity = try c.decodeFlexibleIntIfPresent(forKey: .quantity) ?? 1
        color = try c.decodeIfPresent(String.self, forKey: .color)
        size = try c.decodeIfPresent(String.self, forKey: .size)
        visual = try c.decodeIfPresent(String.self, forKey: .visual) ?? "tee"
    }
}

struct PlaceOrderBody: Encodable {
    var name: String
    var email: String
    var items: [OrderItem]
    var address: OrderAddress
    var subtotal: Double
    var shipping: Double
    var discount: Double
}

struct Order: Decodable, Identifiable, Hashable {
    var id: Int
    var customerName: String
    var customerEmail: String
    var address: OrderAddress
    var subtotal: Double
    var shipping: Double
    var discount: Double
    var total: Double
    var status: String
    var createdAt: String?
    var items: [OrderItem]

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeFlexibleInt(forKey: .id)
        customerName = try c.decodeIfPresent(String.self, forKey: .customerName) ?? ""
        customerEmail = try c.decodeIfPresent(String.self, forKey: .customerEmail) ?? ""
        address = try c.decodeIfPresent(OrderAddress.self, forKey: .address) ?? OrderAddress(street: "")
        subtotal = try c.decodeFlexibleDoubleIfPresent(forKey: .subtotal) ?? 0
        shipping = try c.decodeFlexibleDoubleIfPresent(forKey: .shipping) ?? 0
        discount = try c.decodeFlexibleDoubleIfPresent(forKey: .discount) ?? 0
        total = try c.decodeFlexibleDoubleIfPresent(forKey: .total) ?? 0
        status = try c.decodeIfPresent(String.self, forKey: .status) ?? "pendente"
        createdAt = Self.decodeDateString(c, forKey: .createdAt)
        items = try c.decodeIfPresent([OrderItem].self, forKey: .items) ?? []
    }

    private static func decodeDateString(_ c: KeyedDecodingContainer<CodingKeys>, forKey key: CodingKeys) -> String? {
        if let s = try? c.decode(String.self, forKey: key) { return s }
        return nil
    }

    private enum CodingKeys: String, CodingKey {
        case id, customerName, customerEmail, address, subtotal, shipping, discount, total, status, createdAt, items
    }
}

struct OrderResponse: Decodable {
    var order: Order?
    var error: String?
}

struct OrdersResponse: Decodable {
    var orders: [Order]
    var error: String?
}

struct CartLine: Codable, Hashable, Identifiable {
    var productId: Int
    var name: String
    var slug: String
    var price: Double
    var compareAtPrice: Double?
    var visual: String
    var colorName: String
    var colorHex: String
    var size: String
    var quantity: Int
    var stock: Int

    var id: String { key }
    var key: String { "\(productId)|\(size)|\(colorHex)" }
}
