import Foundation
import Observation

@Observable
@MainActor
final class SessionStore {
    let api: APIClient
    var user: User?
    var ready = false
    var authError: String?
    var busy = false

    init(api: APIClient) {
        self.api = api
    }

    func restore() async {
        let token = KeychainStore.read()
        api.token = token
        guard let token, !token.isEmpty else {
            ready = true
            return
        }
        do {
            user = try await api.me()
        } catch {
            KeychainStore.write(nil)
            api.token = nil
            user = nil
        }
        ready = true
    }

    func login(email: String, password: String) async -> Bool {
        authError = nil
        busy = true
        defer { busy = false }
        do {
            let result = try await api.login(email: email.trimmingCharacters(in: .whitespacesAndNewlines), password: password)
            KeychainStore.write(result.token)
            user = result.user
            return true
        } catch {
            authError = APIClient.friendly(error)
            return false
        }
    }

    func register(name: String, email: String, password: String, phone: String?) async -> Bool {
        authError = nil
        busy = true
        defer { busy = false }
        let trimmedPhone = phone?.trimmingCharacters(in: .whitespacesAndNewlines)
        do {
            let result = try await api.register(
                name: name.trimmingCharacters(in: .whitespacesAndNewlines),
                email: email.trimmingCharacters(in: .whitespacesAndNewlines),
                password: password,
                phone: (trimmedPhone?.isEmpty == false) ? trimmedPhone : nil
            )
            KeychainStore.write(result.token)
            user = result.user
            return true
        } catch {
            authError = APIClient.friendly(error)
            return false
        }
    }

    func logout() {
        KeychainStore.write(nil)
        api.token = nil
        user = nil
        authError = nil
    }
}
