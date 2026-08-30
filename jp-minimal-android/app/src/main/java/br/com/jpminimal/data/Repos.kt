package br.com.jpminimal.data

class CatalogRepository(private val api: ApiService) {
    suspend fun categories() = api.categories().categories
    suspend fun products(
        q: String? = null,
        category: String? = null,
        size: String? = null,
        order: String? = null,
        page: Int = 1,
    ) = api.products(q = q, category = category, size = size, order = order, page = page, pageSize = 24)

    suspend fun featured() = api.featured().products
    suspend fun latest() = api.latest().products
    suspend fun search(q: String) = api.search(q).results
    suspend fun byIds(ids: List<Int>): List<ProductCardDto> {
        if (ids.isEmpty()) return emptyList()
        return api.byIds(ids.joinToString(",")).products
    }
    suspend fun product(idOrSlug: String): ProductDto {
        val res = api.product(idOrSlug)
        return res.product ?: throw IllegalStateException(res.error ?: "Produto não encontrado.")
    }
    suspend fun related(idOrSlug: String) = api.related(idOrSlug).products
}

class AuthRepository(
    private val api: ApiService,
    private val session: SessionStore,
) {
    suspend fun restore(): UserDto? {
        session.hydrate()
        if (session.currentToken().isNullOrBlank()) return null
        val res = runCatching { api.me() }.getOrNull() ?: return null
        if (res.isSuccessful) return res.body()?.user
        session.setToken(null)
        return null
    }

    suspend fun login(email: String, password: String): UserDto {
        val res = api.login(LoginBody(email.trim(), password))
        val body = res.body()
        if (!res.isSuccessful || body?.token == null || body.user == null) {
            throw IllegalStateException(parseApiError(res.errorBody()?.string(), body?.error ?: "Não foi possível entrar."))
        }
        session.setToken(body.token)
        return body.user
    }

    suspend fun register(name: String, email: String, password: String, phone: String?): UserDto {
        val res = api.register(RegisterBody(name.trim(), email.trim(), password, phone?.ifBlank { null }))
        val body = res.body()
        if (!res.isSuccessful || body?.token == null || body.user == null) {
            throw IllegalStateException(parseApiError(res.errorBody()?.string(), body?.error ?: "Não foi possível cadastrar."))
        }
        session.setToken(body.token)
        return body.user
    }

    suspend fun logout() = session.setToken(null)
}

class OrderRepository(private val api: ApiService) {
    suspend fun list(): List<OrderDto> {
        val res = api.orders()
        if (!res.isSuccessful) {
            throw IllegalStateException(parseApiError(res.errorBody()?.string(), "Não foi possível carregar os pedidos."))
        }
        return res.body()?.orders.orEmpty()
    }

    suspend fun place(body: PlaceOrderBody): OrderDto {
        val res = api.placeOrder(body)
        val parsed = res.body()
        if (!res.isSuccessful || parsed?.order == null) {
            throw IllegalStateException(parseApiError(res.errorBody()?.string(), parsed?.error ?: "Não foi possível finalizar o pedido."))
        }
        return parsed.order
    }
}
