package br.com.jpminimal.ui.session

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import br.com.jpminimal.data.AppContainer
import br.com.jpminimal.data.CartLine
import br.com.jpminimal.data.UserDto
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class SessionViewModel(private val app: AppContainer) : ViewModel() {
    var user: UserDto? by mutableStateOf(null)
        private set
    var ready: Boolean by mutableStateOf(false)
        private set
    var authError: String? by mutableStateOf(null)
        private set

    val bag: StateFlow<List<CartLine>> = app.bag.items.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        emptyList(),
    )
    val favoriteIds: StateFlow<Set<Int>> = app.favorites.ids.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5_000),
        emptySet(),
    )

    init {
        viewModelScope.launch {
            user = runCatching { app.auth.restore() }.getOrNull()
            ready = true
        }
    }

    fun login(email: String, password: String, onOk: () -> Unit) {
        viewModelScope.launch {
            authError = null
            runCatching { app.auth.login(email, password) }
                .onSuccess { user = it; onOk() }
                .onFailure { authError = it.message }
        }
    }

    fun register(name: String, email: String, password: String, phone: String?, onOk: () -> Unit) {
        viewModelScope.launch {
            authError = null
            runCatching { app.auth.register(name, email, password, phone) }
                .onSuccess { user = it; onOk() }
                .onFailure { authError = it.message }
        }
    }

    fun logout() {
        viewModelScope.launch {
            app.auth.logout()
            user = null
        }
    }

    fun toggleFavorite(id: Int) {
        viewModelScope.launch { app.favorites.toggle(id) }
    }

    fun addToBag(line: CartLine) {
        viewModelScope.launch { app.bag.add(line) }
    }

    companion object {
        fun factory(app: AppContainer) = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T = SessionViewModel(app) as T
        }
    }
}
