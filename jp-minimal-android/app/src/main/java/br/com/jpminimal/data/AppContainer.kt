package br.com.jpminimal.data

import android.content.Context

class AppContainer(context: Context) {
    val tokenHolder = TokenHolder()
    val session = SessionStore(context, tokenHolder)
    val bag = BagStore(context)
    val favorites = FavoritesStore(context)
    val api: ApiService = createApiService(tokenHolder)
    val catalog = CatalogRepository(api)
    val auth = AuthRepository(api, session)
    val orders = OrderRepository(api)
}
