package br.com.jpminimal.data

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

private val Context.dataStore by preferencesDataStore("jp_minimal")

private val KEY_TOKEN = stringPreferencesKey("token")
private val KEY_BAG = stringPreferencesKey("bag")
private val KEY_FAVS = stringSetPreferencesKey("favorites")

private val json = Json { ignoreUnknownKeys = true }

class SessionStore(private val context: Context, private val tokenHolder: TokenHolder) {
    val token: Flow<String?> = context.dataStore.data.map { it[KEY_TOKEN] }

    fun currentToken(): String? = tokenHolder.token

    suspend fun hydrate() {
        tokenHolder.token = context.dataStore.data.first()[KEY_TOKEN]
    }

    suspend fun setToken(value: String?) {
        tokenHolder.token = value
        context.dataStore.edit { prefs ->
            if (value.isNullOrBlank()) prefs.remove(KEY_TOKEN) else prefs[KEY_TOKEN] = value
        }
    }
}

class BagStore(private val context: Context) {
    val items: Flow<List<CartLine>> = context.dataStore.data.map { prefs ->
        val raw = prefs[KEY_BAG] ?: return@map emptyList()
        runCatching { json.decodeFromString<List<CartLine>>(raw) }.getOrDefault(emptyList())
    }

    suspend fun set(items: List<CartLine>) {
        context.dataStore.edit { it[KEY_BAG] = json.encodeToString(items) }
    }

    suspend fun add(line: CartLine) {
        val current = items.first().toMutableList()
        val idx = current.indexOfFirst { it.key == line.key }
        if (idx >= 0) {
            val existing = current[idx]
            current[idx] = existing.copy(quantity = (existing.quantity + line.quantity).coerceAtMost(existing.stock.coerceAtLeast(1)))
        } else {
            current.add(line)
        }
        set(current)
    }

    suspend fun setQty(key: String, qty: Int) {
        val current = items.first().toMutableList()
        val idx = current.indexOfFirst { it.key == key }
        if (idx < 0) return
        if (qty <= 0) current.removeAt(idx)
        else current[idx] = current[idx].copy(quantity = qty.coerceAtMost(current[idx].stock.coerceAtLeast(1)))
        set(current)
    }

    suspend fun remove(key: String) {
        set(items.first().filterNot { it.key == key })
    }

    suspend fun clear() = set(emptyList())
}

class FavoritesStore(private val context: Context) {
    val ids: Flow<Set<Int>> = context.dataStore.data.map { prefs ->
        prefs[KEY_FAVS].orEmpty().mapNotNull { it.toIntOrNull() }.toSet()
    }

    suspend fun toggle(id: Int) {
        context.dataStore.edit { prefs ->
            val cur = prefs[KEY_FAVS].orEmpty().toMutableSet()
            val key = id.toString()
            if (!cur.add(key)) cur.remove(key)
            prefs[KEY_FAVS] = cur
        }
    }
}
