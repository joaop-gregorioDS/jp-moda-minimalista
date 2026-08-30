package br.com.jpminimal.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import br.com.jpminimal.LocalApp
import br.com.jpminimal.data.CatalogRepository
import br.com.jpminimal.data.CategoryDto
import br.com.jpminimal.data.ProductCardDto
import br.com.jpminimal.data.friendlyNetworkError
import br.com.jpminimal.ui.components.ErrorBlock
import br.com.jpminimal.ui.components.LoadingBlock
import br.com.jpminimal.ui.components.ProductCard
import br.com.jpminimal.ui.theme.Gold
import br.com.jpminimal.ui.theme.Ink
import br.com.jpminimal.ui.theme.Paper
import br.com.jpminimal.ui.theme.Sand
import kotlinx.coroutines.async
import kotlinx.coroutines.launch

class HomeViewModel(private val catalog: CatalogRepository) : ViewModel() {
    var loading by mutableStateOf(true)
        private set
    var error by mutableStateOf<String?>(null)
        private set
    var categories by mutableStateOf<List<CategoryDto>>(emptyList())
        private set
    var featured by mutableStateOf<List<ProductCardDto>>(emptyList())
        private set
    var latest by mutableStateOf<List<ProductCardDto>>(emptyList())
        private set

    init { refresh() }

    fun refresh() {
        viewModelScope.launch {
            loading = true
            error = null
            runCatching {
                val c = async { catalog.categories() }
                val f = async { catalog.featured() }
                val l = async { catalog.latest() }
                Triple(c.await(), f.await(), l.await())
            }.onSuccess { (c, f, l) ->
                categories = c
                featured = f
                latest = l
            }.onFailure { error = friendlyNetworkError(it) }
            loading = false
        }
    }

    companion object {
        fun factory(catalog: CatalogRepository) = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T = HomeViewModel(catalog) as T
        }
    }
}

@Composable
fun HomeScreen(
    onProduct: (String) -> Unit,
    onCategory: (String) -> Unit,
) {
    val app = LocalApp.current
    val vm: HomeViewModel = viewModel(factory = HomeViewModel.factory(app.catalog))
    LaunchedEffect(Unit) { /* already refreshing */ }

    when {
        vm.loading && vm.featured.isEmpty() -> LoadingBlock("Acordando o servidor…")
        vm.error != null && vm.featured.isEmpty() -> ErrorBlock(vm.error ?: "", vm::refresh)
        else -> {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                item(span = { GridItemSpan(2) }) {
                    Column(
                        Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(Ink)
                            .padding(24.dp),
                    ) {
                        Text("JP", color = Gold, style = MaterialTheme.typography.headlineLarge)
                        Text("MINIMAL", color = Gold, style = MaterialTheme.typography.labelSmall)
                        Text(
                            "Moda minimalista em tons sóbrios com toques de dourado.",
                            color = Paper.copy(alpha = 0.8f),
                            modifier = Modifier.padding(top = 12.dp),
                        )
                    }
                }
                if (vm.categories.isNotEmpty()) {
                    item(span = { GridItemSpan(2) }) {
                        Row(
                            Modifier.horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                        ) {
                            vm.categories.forEach { cat ->
                                Text(
                                    cat.name,
                                    color = Ink,
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(50))
                                        .background(Sand)
                                        .clickable { onCategory(cat.slug) }
                                        .padding(horizontal = 14.dp, vertical = 8.dp),
                                )
                            }
                        }
                    }
                }
                item(span = { GridItemSpan(2) }) {
                    Text("Destaques", style = MaterialTheme.typography.titleLarge)
                }
                items(vm.featured, key = { "f${it.id}" }) { p ->
                    ProductCard(p, onClick = { onProduct(p.slug) })
                }
                item(span = { GridItemSpan(2) }) {
                    Text("Novidades", style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(top = 8.dp))
                }
                items(vm.latest, key = { "l${it.id}" }) { p ->
                    ProductCard(p, onClick = { onProduct(p.slug) })
                }
            }
        }
    }
}
