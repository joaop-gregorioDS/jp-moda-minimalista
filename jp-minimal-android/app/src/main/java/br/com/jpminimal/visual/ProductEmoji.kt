package br.com.jpminimal.visual

data class EmojiVisual(
    val emoji: String,
    val scale: Float,
    val label: String,
)

private val FALLBACK = EmojiVisual("🛍️", 0.9f, "Peça")

private val MAP = mapOf(
    "tee" to EmojiVisual("👕", 1f, "Camiseta"),
    "tee-long" to EmojiVisual("👕", 1.06f, "Camiseta alongada"),
    "shirt" to EmojiVisual("👔", 1f, "Camisa"),
    "shirt-camp" to EmojiVisual("👕", 0.96f, "Camisa camp"),
    "pants" to EmojiVisual("👖", 1.08f, "Calça"),
    "pants-wide" to EmojiVisual("👖", 1.14f, "Calça wide"),
    "pants-tailored" to EmojiVisual("👖", 1.04f, "Calça de alfaiataria"),
    "shorts" to EmojiVisual("🩳", 0.88f, "Bermuda"),
    "shorts-chino" to EmojiVisual("🩳", 0.9f, "Bermuda chino"),
    "sweater" to EmojiVisual("🧶", 0.92f, "Suéter"),
    "cardigan" to EmojiVisual("🧥", 1.08f, "Cardigan"),
    "turtleneck" to EmojiVisual("🧣", 0.86f, "Gola alta"),
    "blazer" to EmojiVisual("🤵", 1.12f, "Blazer"),
    "jacket" to EmojiVisual("🧥", 1.16f, "Jaqueta"),
    "letterman" to EmojiVisual("🧥", 1.12f, "Jaqueta college"),
    "trucker" to EmojiVisual("🧥", 1.08f, "Jaqueta trucker"),
    "coat" to EmojiVisual("🧥", 1.22f, "Casaco"),
    "puffer" to EmojiVisual("🧥", 1.18f, "Puffer"),
    "parka" to EmojiVisual("🧥", 1.2f, "Parka"),
    "dress" to EmojiVisual("👗", 1.2f, "Vestido"),
    "slip" to EmojiVisual("👗", 1.14f, "Vestido slip"),
    "skirt" to EmojiVisual("👗", 0.92f, "Saia"),
    "skirt-full" to EmojiVisual("👗", 1.02f, "Saia evasê"),
    "sneaker" to EmojiVisual("👟", 0.86f, "Tênis"),
    "loafer" to EmojiVisual("👞", 0.84f, "Sapato"),
    "bag" to EmojiVisual("👜", 0.78f, "Bolsa"),
    "belt" to EmojiVisual("🪢", 0.64f, "Cinto"),
    "cap" to EmojiVisual("🧢", 0.7f, "Boné"),
    "scarf" to EmojiVisual("🧣", 0.76f, "Cachecol"),
    "wallet" to EmojiVisual("👛", 0.62f, "Carteira"),
    "watch" to EmojiVisual("⌚", 0.58f, "Relógio"),
)

fun getProductEmoji(motif: String): EmojiVisual = MAP[motif] ?: FALLBACK
