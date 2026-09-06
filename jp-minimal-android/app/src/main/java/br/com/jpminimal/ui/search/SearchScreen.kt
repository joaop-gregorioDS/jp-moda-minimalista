package br.com.jpminimal.ui.search

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import br.com.jpminimal.LocalApp
import br.com.jpminimal.data.CatalogRepository
import br.com.jpminimal.data.ProductCardDto
import br.com.jpminimal.ui.components.ProductVisualBox
import br.com.jpminimal.ui.theme.Mist
import br.com.jpminimal.util.formatBRL
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SearchViewModel(private val catalog: CatalogRepository) : ViewModel() {
    var query by mutableStateOf("")
    var results by mutableStateOf<List<ProductCardDto>>(emptyList())
        private set
    private var job: Job? = null

    fun onQuery(value: String) {
        query = value
        job?.cancel()
        if (value.trim().length < 2) {
            results = emptyList()
            return
        }
        job = viewModelScope.launch {
            delay(300)
            results = runCatching { catalog.search(value.trim()) }.getOrDefault(emptyList())
        }
    }

    companion object {
        fun factory(catalog: CatalogRepository) = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T = SearchViewModel(catalog) as T
        }
    }
}

@Composable
fun SearchScreen(onProduct: (String) -> Unit) {
    val app = LocalApp.current
    val vm: SearchViewModel = viewModel(factory = SearchViewModel.factory(app.catalog))
    LaunchedEffect(Unit) { }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        OutlinedTextField(
            value = vm.query,
            onValueChange = vm::onQuery,
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            placeholder = { Text("Buscar peças…") },
        )
        if (vm.query.length in 1..1) {
            Text("Digite ao menos 2 letras", color = Mist, modifier = Modifier.padding(top = 12.dp))
        }
        LazyColumn(Modifier.padding(top = 12.dp)) {
            items(vm.results, key = { it.id }) { p ->
                Row(
                    Modifier
                        .fillMaxWidth()
                        .clickable { onProduct(p.slug) }
                        .padding(vertical = 8.dp),
                ) {
                    ProductVisualBox(p.visual, p.colorHex, Modifier.size(56.dp))
                    Column(Modifier.padding(start = 12.dp)) {
                        Text(p.name)
                        Text(formatBRL(p.price), color = Mist)
                    }
                }
            }
        }
    }
}
