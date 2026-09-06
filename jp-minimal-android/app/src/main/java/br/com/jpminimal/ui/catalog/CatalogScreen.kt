package br.com.jpminimal.ui.catalog

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items as gridItems
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import br.com.jpminimal.ui.components.JpFilterChip
import br.com.jpminimal.ui.theme.Mist
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
import kotlinx.coroutines.launch

class CatalogViewModel(private val catalog: CatalogRepository) : ViewModel() {
    var loading by mutableStateOf(true); private set
    var error by mutableStateOf<String?>(null); private set
    var products by mutableStateOf<List<ProductCardDto>>(emptyList()); private set
    var total by mutableIntStateOf(0); private set
    var categories by mutableStateOf<List<CategoryDto>>(emptyList()); private set
    var category by mutableStateOf<String?>(null)
    var size by mutableStateOf<String?>(null)
    var order by mutableStateOf("newest")

    fun load(initialCategory: String?) {
        if (initialCategory != null) category = initialCategory
        refresh()
        viewModelScope.launch {
            categories = runCatching { catalog.categories() }.getOrDefault(emptyList())
        }
    }

    fun refresh() {
        viewModelScope.launch {
            loading = true
            error = null
            runCatching {
                catalog.products(category = category, size = size, order = order, page = 1)
            }.onSuccess {
                products = it.products
                total = it.total
            }.onFailure { error = friendlyNetworkError(it) }
            loading = false
        }
    }

    companion object {
        fun factory(catalog: CatalogRepository) = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T = CatalogViewModel(catalog) as T
        }
    }
}

private val SIZES = listOf("PP", "P", "M", "G", "GG", "Único")
private val ORDERS = listOf(
    "newest" to "Novidades",
    "price-asc" to "Menor preço",
    "price-desc" to "Maior preço",
    "sale" to "Promoção",
    "name" to "Nome",
)

@Composable
fun CatalogScreen(
    initialCategory: String?,
    onProduct: (String) -> Unit,
) {
    val app = LocalApp.current
    val vm: CatalogViewModel = viewModel(factory = CatalogViewModel.factory(app.catalog))
    LaunchedEffect(initialCategory) { vm.load(initialCategory) }

    var sizeOpen by remember { mutableStateOf(false) }
    var orderOpen by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize()) {
        LazyRow(
            modifier = Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(vm.categories, key = { it.slug }) { cat ->
                JpFilterChip(
                    selected = vm.category == cat.slug,
                    onClick = {
                        vm.category = if (vm.category == cat.slug) null else cat.slug
                        vm.refresh()
                    },
                    label = cat.name,
                )
            }
        }
        Row(
            Modifier.fillMaxWidth().padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box {
                TextButton(onClick = { sizeOpen = true }) { Text(vm.size ?: "Tamanho") }
                DropdownMenu(expanded = sizeOpen, onDismissRequest = { sizeOpen = false }) {
                    DropdownMenuItem(text = { Text("Todos") }, onClick = { vm.size = null; sizeOpen = false; vm.refresh() })
                    SIZES.forEach { s ->
                        DropdownMenuItem(text = { Text(s) }, onClick = { vm.size = s; sizeOpen = false; vm.refresh() })
                    }
                }
            }
            Box {
                TextButton(onClick = { orderOpen = true }) {
                    Text(ORDERS.firstOrNull { it.first == vm.order }?.second ?: "Ordenar")
                }
                DropdownMenu(expanded = orderOpen, onDismissRequest = { orderOpen = false }) {
                    ORDERS.forEach { (id, label) ->
                        DropdownMenuItem(text = { Text(label) }, onClick = { vm.order = id; orderOpen = false; vm.refresh() })
                    }
                }
            }
            Spacer(Modifier.weight(1f))
            Text(
                "${vm.total} peças",
                color = Mist,
                modifier = Modifier.padding(end = 12.dp),
            )
        }
        Box(Modifier.weight(1f).fillMaxWidth()) {
            when {
                vm.loading && vm.products.isEmpty() -> LoadingBlock("Acordando o servidor…")
                vm.error != null && vm.products.isEmpty() -> ErrorBlock(vm.error ?: "", vm::refresh)
                vm.products.isEmpty() -> Text("Nenhuma peça nesta filtragem.", modifier = Modifier.padding(24.dp))
                else -> LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 24.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    gridItems(vm.products, key = { it.id }) { p ->
                        ProductCard(p, onClick = { onProduct(p.slug) })
                    }
                }
            }
        }
    }
}
