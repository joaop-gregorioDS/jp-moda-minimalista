package br.com.jpminimal.util

import java.text.NumberFormat
import java.util.Locale

private val BRL: NumberFormat = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("pt-BR"))

fun formatBRL(value: Double): String = BRL.format(value)

const val FREE_SHIPPING_THRESHOLD = 299.0
const val SHIPPING_FIXED = 24.90

fun shippingFor(subtotal: Double, pickup: Boolean): Double {
    if (pickup || subtotal >= FREE_SHIPPING_THRESHOLD) return 0.0
    return SHIPPING_FIXED
}

fun paymentDiscount(subtotal: Double, payment: String, pickup: Boolean): Double {
    if (pickup) return 0.0
    return if (payment == "pix" || payment == "boleto") {
        kotlin.math.round(subtotal * 0.05 * 100.0) / 100.0
    } else {
        0.0
    }
}
