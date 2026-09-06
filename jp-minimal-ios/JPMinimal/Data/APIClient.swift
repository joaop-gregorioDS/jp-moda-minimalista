import Foundation

enum APIError: LocalizedError {
    case invalidURL
    case invalidResponse
    case message(String)

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "URL da API inválida."
        case .invalidResponse: return "Resposta inválida da API."
        case .message(let text): return text
        }
    }
}

final class APIClient: @unchecked Sendable {
    let baseURL: URL
    private let session: URLSession
    private let lock = NSLock()
    private var _token: String?

    var token: String? {
        get {
            lock.lock()
            defer { lock.unlock() }
            return _token
        }
        set {
            lock.lock()
            _token = newValue
            lock.unlock()
        }
    }

    init(baseURL: URL? = nil) {
        let raw = baseURL?.absoluteString
            ?? (Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String)
            ?? "https://jp-moda-minimalista.onrender.com"
        let trimmed = raw.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        self.baseURL = URL(string: trimmed) ?? URL(string: "https://jp-moda-minimalista.onrender.com")!

        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 60
        config.timeoutIntervalForResource = 75
        config.httpAdditionalHeaders = [
            "Accept": "application/json",
        ]
        self.session = URLSession(configuration: config)
    }

    func health() async throws -> HealthResponse {
        try await get("api/health")
    }

    func categories() async throws -> [Category] {
        let res: CategoriesResponse = try await get("api/categories")
        return res.categories
    }

    func products(
        q: String? = nil,
        category: String? = nil,
        size: String? = nil,
        order: String? = nil,
        featured: String? = nil,
        page: Int? = 1,
        pageSize: Int? = 24
    ) async throws -> ProductPage {
        try await get("api/products", query: [
            "q": q,
            "category": category,
            "size": size,
            "order": order,
            "featured": featured,
            "page": page.map(String.init),
            "pageSize": pageSize.map(String.init),
        ])
    }

    func featured(limit: Int = 8) async throws -> [ProductCard] {
        let res: ProductCardsResponse = try await get("api/products/featured", query: ["limit": String(limit)])
        return res.products
    }

    func latest(limit: Int = 8) async throws -> [ProductCard] {
        let res: ProductCardsResponse = try await get("api/products/latest", query: ["limit": String(limit)])
        return res.products
    }

    func search(_ q: String) async throws -> [ProductCard] {
        let res: SearchResponse = try await get("api/products/search", query: ["q": q])
        return res.results
    }

    func byIds(_ ids: [Int]) async throws -> [ProductCard] {
        guard !ids.isEmpty else { return [] }
        let res: ProductCardsResponse = try await get(
            "api/products/by-ids",
            query: ["ids": ids.map(String.init).joined(separator: ",")]
        )
        return res.products
    }

    func product(_ idOrSlug: String) async throws -> Product {
        let res: ProductResponse = try await get("api/products/\(idOrSlug)")
        if let product = res.product { return product }
        throw APIError.message(res.error ?? "Produto não encontrado.")
    }

    func related(_ idOrSlug: String, limit: Int = 8) async throws -> [ProductCard] {
        let res: ProductCardsResponse = try await get(
            "api/products/\(idOrSlug)/related",
            query: ["limit": String(limit)]
        )
        return res.products
    }

    func login(email: String, password: String) async throws -> (token: String, user: User) {
        let payload = try JSONCoders.encoder.encode(LoginBody(email: email, password: password))
        let (data, status) = try await send(method: "POST", path: "api/auth/login", bodyData: payload)
        let parsed = try? JSONCoders.decoder.decode(AuthResponse.self, from: data)
        guard (200..<300).contains(status), let token = parsed?.token, let user = parsed?.user else {
            throw APIError.message(Self.parseError(data, fallback: parsed?.error ?? "Não foi possível entrar."))
        }
        self.token = token
        return (token, user)
    }

    func register(name: String, email: String, password: String, phone: String?) async throws -> (token: String, user: User) {
        let body = RegisterBody(name: name, email: email, password: password, phone: phone)
        let payload = try JSONCoders.encoder.encode(body)
        let (data, status) = try await send(method: "POST", path: "api/auth/register", bodyData: payload)
        let parsed = try? JSONCoders.decoder.decode(AuthResponse.self, from: data)
        guard (200..<300).contains(status), let token = parsed?.token, let user = parsed?.user else {
            throw APIError.message(Self.parseError(data, fallback: parsed?.error ?? "Não foi possível cadastrar."))
        }
        self.token = token
        return (token, user)
    }

    func me() async throws -> User {
        let (data, status) = try await send(method: "GET", path: "api/auth/me")
        let parsed = try? JSONCoders.decoder.decode(MeResponse.self, from: data)
        guard (200..<300).contains(status), let user = parsed?.user else {
            throw APIError.message(Self.parseError(data, fallback: parsed?.error ?? "Sessão inválida."))
        }
        return user
    }

    func orders() async throws -> [Order] {
        let (data, status) = try await send(method: "GET", path: "api/orders")
        let parsed = try? JSONCoders.decoder.decode(OrdersResponse.self, from: data)
        guard (200..<300).contains(status) else {
            throw APIError.message(Self.parseError(data, fallback: parsed?.error ?? "Não foi possível carregar os pedidos."))
        }
        return parsed?.orders ?? []
    }

    func placeOrder(_ body: PlaceOrderBody) async throws -> Order {
        let payload = try JSONCoders.encoder.encode(body)
        let (data, status) = try await send(method: "POST", path: "api/orders", bodyData: payload)
        let parsed = try? JSONCoders.decoder.decode(OrderResponse.self, from: data)
        guard (200..<300).contains(status), let order = parsed?.order else {
            throw APIError.message(Self.parseError(data, fallback: parsed?.error ?? "Não foi possível finalizar o pedido."))
        }
        return order
    }

    private func get<T: Decodable>(_ path: String, query: [String: String?] = [:]) async throws -> T {
        let (data, status) = try await send(method: "GET", path: path, query: query)
        if !(200..<300).contains(status) {
            throw APIError.message(Self.parseError(data, fallback: "Falha na API (\(status))."))
        }
        do {
            return try JSONCoders.decoder.decode(T.self, from: data)
        } catch {
            throw APIError.message("Não foi possível ler a resposta da API.")
        }
    }

    private func send(
        method: String,
        path: String,
        query: [String: String?] = [:],
        bodyData: Data? = nil,
        retry: Bool = true
    ) async throws -> (Data, Int) {
        var root = baseURL.absoluteString
        if root.hasSuffix("/") { root.removeLast() }
        let encodedPath = path.split(separator: "/").map { part in
            String(part).addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? String(part)
        }.joined(separator: "/")
        guard let built = URL(string: "\(root)/\(encodedPath)") else { throw APIError.invalidURL }
        var components = URLComponents(url: built, resolvingAgainstBaseURL: false)
        let items = query.compactMap { key, value -> URLQueryItem? in
            guard let value, !value.isEmpty else { return nil }
            return URLQueryItem(name: key, value: value)
        }
        if !items.isEmpty { components?.queryItems = items }
        guard let url = components?.url else { throw APIError.invalidURL }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        if let token, !token.isEmpty {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let bodyData {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = bodyData
        }

        do {
            let (data, response) = try await session.data(for: request)
            guard let http = response as? HTTPURLResponse else { throw APIError.invalidResponse }
            if (502...504).contains(http.statusCode), retry {
                try await Task.sleep(nanoseconds: 2_000_000_000)
                return try await send(method: method, path: path, query: query, bodyData: bodyData, retry: false)
            }
            return (data, http.statusCode)
        } catch is CancellationError {
            throw CancellationError()
        } catch {
            if retry, Self.isRetriable(error) {
                try await Task.sleep(nanoseconds: 2_000_000_000)
                return try await send(method: method, path: path, query: query, bodyData: bodyData, retry: false)
            }
            throw APIError.message(Self.friendly(error))
        }
    }

    private static func isRetriable(_ error: Error) -> Bool {
        let ns = error as NSError
        if ns.domain == NSURLErrorDomain {
            switch ns.code {
            case NSURLErrorTimedOut, NSURLErrorNetworkConnectionLost, NSURLErrorNotConnectedToInternet,
                 NSURLErrorCannotConnectToHost, NSURLErrorDNSLookupFailed, NSURLErrorCannotFindHost:
                return true
            default:
                return false
            }
        }
        return false
    }

    static func friendly(_ error: Error) -> String {
        if let api = error as? APIError { return api.localizedDescription }
        let msg = error.localizedDescription
        if msg.localizedCaseInsensitiveContains("timeout") || msg.localizedCaseInsensitiveContains("timed out") {
            return "Servidor demorou para responder. No Render free a primeira chamada pode levar ~40 s."
        }
        if msg.localizedCaseInsensitiveContains("hostname") || msg.localizedCaseInsensitiveContains("conectar")
            || msg.localizedCaseInsensitiveContains("Internet") || msg.localizedCaseInsensitiveContains("offline") {
            return "Não foi possível falar com a API. Confira se ela está no ar."
        }
        return msg.isEmpty ? "Falha de rede." : msg
    }

    static func parseError(_ data: Data, fallback: String) -> String {
        if let body = try? JSONCoders.decoder.decode(ErrorBody.self, from: data), let error = body.error, !error.isEmpty {
            return error
        }
        return fallback
    }
}
