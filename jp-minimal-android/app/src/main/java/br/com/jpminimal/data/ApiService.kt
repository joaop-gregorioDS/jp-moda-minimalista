package br.com.jpminimal.data

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {
    @GET("api/health")
    suspend fun health(): Response<Unit>

    @GET("api/categories")
    suspend fun categories(): CategoriesResponse

    @GET("api/products")
    suspend fun products(
        @Query("q") q: String? = null,
        @Query("category") category: String? = null,
        @Query("size") size: String? = null,
        @Query("order") order: String? = null,
        @Query("featured") featured: String? = null,
        @Query("page") page: Int? = null,
        @Query("pageSize") pageSize: Int? = null,
    ): ProductPageDto

    @GET("api/products/featured")
    suspend fun featured(@Query("limit") limit: Int = 8): ProductCardsResponse

    @GET("api/products/latest")
    suspend fun latest(@Query("limit") limit: Int = 8): ProductCardsResponse

    @GET("api/products/search")
    suspend fun search(@Query("q") q: String): SearchResponse

    @GET("api/products/by-ids")
    suspend fun byIds(@Query("ids") ids: String): ProductCardsResponse

    @GET("api/products/{id}")
    suspend fun product(@Path("id") idOrSlug: String): ProductResponse

    @GET("api/products/{id}/related")
    suspend fun related(@Path("id") idOrSlug: String, @Query("limit") limit: Int = 8): ProductCardsResponse

    @POST("api/auth/login")
    suspend fun login(@Body body: LoginBody): Response<AuthResponse>

    @POST("api/auth/register")
    suspend fun register(@Body body: RegisterBody): Response<AuthResponse>

    @GET("api/auth/me")
    suspend fun me(): Response<MeResponse>

    @GET("api/orders")
    suspend fun orders(): Response<OrdersResponse>

    @POST("api/orders")
    suspend fun placeOrder(@Body body: PlaceOrderBody): Response<OrderResponse>
}
