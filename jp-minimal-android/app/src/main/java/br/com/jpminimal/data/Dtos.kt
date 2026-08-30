package br.com.jpminimal.data

import kotlinx.serialization.Serializable

@Serializable
data class ErrorBody(val error: String? = null)

@Serializable
data class CategoryDto(
    val id: Int,
    val slug: String,
    val name: String,
    val description: String? = null,
    val accent: String = "#c6a87c",
    val sortOrder: Int = 0,
)

@Serializable
data class CategoriesResponse(val categories: List<CategoryDto> = emptyList())

@Serializable
data class ProductCardDto(
    val id: Int,
    val slug: String,
    val name: String,
    val price: Double,
    val compareAtPrice: Double? = null,
    val discountPct: Int? = null,
    val visual: String = "tee",
    val colorHex: String = "#111111",
    val categoryName: String = "",
    val categorySlug: String = "",
    val inStock: Boolean = true,
    val sizes: List<String> = emptyList(),
)

@Serializable
data class ProductPageDto(
    val products: List<ProductCardDto> = emptyList(),
    val total: Int = 0,
    val page: Int = 1,
    val pageSize: Int = 24,
    val totalPages: Int = 1,
)

@Serializable
data class ProductCardsResponse(val products: List<ProductCardDto> = emptyList())

@Serializable
data class SearchResponse(val results: List<ProductCardDto> = emptyList())

@Serializable
data class ProductColorDto(
    val name: String,
    val hex: String,
)

@Serializable
data class ProductDto(
    val id: Int,
    val slug: String,
    val sku: String = "",
    val name: String,
    val description: String = "",
    val price: Double,
    val compareAtPrice: Double? = null,
    val categoryId: Int? = null,
    val categoryName: String = "",
    val categorySlug: String = "",
    val stock: Int = 0,
    val featured: Boolean = false,
    val sizes: List<String> = emptyList(),
    val visual: String = "tee",
    val colors: List<ProductColorDto> = emptyList(),
    val discountPct: Int? = null,
)

@Serializable
data class ProductResponse(val product: ProductDto? = null, val error: String? = null)

@Serializable
data class UserDto(
    val id: Int,
    val name: String,
    val email: String,
    val phone: String? = null,
)

@Serializable
data class AuthResponse(
    val token: String? = null,
    val user: UserDto? = null,
    val error: String? = null,
)

@Serializable
data class MeResponse(val user: UserDto? = null, val error: String? = null)

@Serializable
data class LoginBody(val email: String, val password: String)

@Serializable
data class RegisterBody(
    val name: String,
    val email: String,
    val password: String,
    val phone: String? = null,
)

@Serializable
data class OrderAddressDto(
    val street: String,
    val number: String = "",
    val complement: String? = null,
    val city: String = "",
    val state: String = "",
    val zip: String = "",
)

@Serializable
data class OrderItemDto(
    val productId: Int? = null,
    val productName: String,
    val price: Double,
    val quantity: Int,
    val color: String? = null,
    val size: String? = null,
    val visual: String = "tee",
)

@Serializable
data class PlaceOrderBody(
    val name: String,
    val email: String,
    val items: List<OrderItemDto>,
    val address: OrderAddressDto,
    val subtotal: Double,
    val shipping: Double,
    val discount: Double,
)

@Serializable
data class OrderDto(
    val id: Int,
    val customerName: String = "",
    val customerEmail: String = "",
    val address: OrderAddressDto = OrderAddressDto(street = ""),
    val subtotal: Double = 0.0,
    val shipping: Double = 0.0,
    val discount: Double = 0.0,
    val total: Double = 0.0,
    val status: String = "pendente",
    val createdAt: String? = null,
    val items: List<OrderItemDto> = emptyList(),
)

@Serializable
data class OrderResponse(val order: OrderDto? = null, val error: String? = null)

@Serializable
data class OrdersResponse(val orders: List<OrderDto> = emptyList(), val error: String? = null)

@Serializable
data class CartLine(
    val productId: Int,
    val name: String,
    val slug: String,
    val price: Double,
    val compareAtPrice: Double? = null,
    val visual: String,
    val colorName: String,
    val colorHex: String,
    val size: String,
    val quantity: Int,
    val stock: Int,
) {
    val key: String get() = "$productId|$size|$colorHex"
}
