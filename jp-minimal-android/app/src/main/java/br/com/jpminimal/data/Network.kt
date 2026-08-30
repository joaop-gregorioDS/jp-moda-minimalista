package br.com.jpminimal.data

import br.com.jpminimal.BuildConfig
import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import kotlinx.serialization.json.Json
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import java.util.concurrent.TimeUnit

class TokenHolder {
    @Volatile
    var token: String? = null
}

private val json = Json {
    ignoreUnknownKeys = true
    isLenient = true
    explicitNulls = false
}

fun createApiService(tokenHolder: TokenHolder): ApiService {
    val auth = Interceptor { chain ->
        val token = tokenHolder.token
        val req = if (token.isNullOrBlank()) {
            chain.request()
        } else {
            chain.request().newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        }
        chain.proceed(req)
    }
    val logging = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BASIC else HttpLoggingInterceptor.Level.NONE
    }
    val wakeRetry = Interceptor { chain ->
        var lastError: java.io.IOException? = null
        repeat(2) { attempt ->
            try {
                val res = chain.proceed(chain.request())
                if (res.code in 502..504 && attempt == 0) {
                    res.close()
                    Thread.sleep(2_000)
                } else {
                    return@Interceptor res
                }
            } catch (e: java.io.IOException) {
                lastError = e
                if (attempt == 0) Thread.sleep(2_000) else throw e
            }
        }
        throw lastError ?: java.io.IOException("Falha ao falar com a API.")
    }
    val client = OkHttpClient.Builder()
        .connectTimeout(50, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .callTimeout(75, TimeUnit.SECONDS)
        .addInterceptor(auth)
        .addInterceptor(wakeRetry)
        .addInterceptor(logging)
        .build()
    val base = BuildConfig.API_BASE_URL.trimEnd('/') + "/"
    return Retrofit.Builder()
        .baseUrl(base)
        .client(client)
        .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
        .build()
        .create(ApiService::class.java)
}

fun friendlyNetworkError(t: Throwable): String {
    val msg = t.message.orEmpty()
    return when {
        msg.contains("timeout", ignoreCase = true) ||
            msg.contains("timed out", ignoreCase = true) ->
            "Servidor demorou para responder. No Render free a primeira chamada pode levar ~40 s."
        msg.contains("Unable to resolve host", ignoreCase = true) ||
            msg.contains("Failed to connect", ignoreCase = true) ->
            "Não foi possível falar com a API (${BuildConfig.API_BASE_URL}). Confira se ela está no ar e a URL em gradle.properties."
        else -> t.message ?: "Falha de rede."
    }
}

fun parseApiError(raw: String?, fallback: String): String {
    if (raw.isNullOrBlank()) return fallback
    return try {
        json.decodeFromString<ErrorBody>(raw).error ?: fallback
    } catch (_: Exception) {
        fallback
    }
}
