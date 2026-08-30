package br.com.jpminimal.ui.product

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import br.com.jpminimal.LocalApp
import br.com.jpminimal.data.CartLine
import br.com.jpminimal.data.CatalogRepository
import br.com.jpminimal.data.ProductCardDto
import br.com.jpminimal.data.ProductColorDto
import br.com.jpminimal.data.ProductDto
import br.com.jpminimal.data.friendlyNetworkError
import br.com.jpminimal.ui.components.ErrorBlock
import br.com.jpminimal.ui.components.JpButton
import br.com.jpminimal.ui.components.JpFilterChip
import br.com.jpminimal.ui.components.LoadingBlock
import br.com.jpminimal.ui.components.ProductCard
import br.com.jpminimal.ui.components.ProductVisualBox
import br.com.jpminimal.ui.components.parseHex
import br.com.jpminimal.ui.session.SessionViewModel
import br.com.jpminimal.ui.theme.Gold
import br.com.jpminimal.ui.theme.Ink
import br.com.jpminimal.ui.theme.Line
import br.com.jpminimal.ui.theme.Mist
import br.com.jpminimal.util.formatBRL
import kotlinx.coroutines.launch

class ProductViewModel(private val catalog: CatalogRepository, private val id: String) : ViewModel() {
    var loading by mutableStateOf(true); private set
    var error by mutableStateOf<String?>(null); private set
    var product by mutableStateOf<ProductDto?>(null); private set
    var related by mutableStateOf<List<ProductCardDto>>(emptyList()); private set
    var size by mutableStateOf<String?>(null)
    var color by mutableStateOf<ProductColorDto?>(null)

    init { refresh() }

    fun refresh() {
        viewModelScope.launch {
            loading = true
            error = null
            runCatching {
                val p = catalog.product(id)
                val r = catalog.related(id)
                p to r
            }.onSuccess { (p, r) ->
                product = p
                related = r
                if (color == null) color = p.colors.firstOrNull()
                if (size == null) size = p.sizes.firstOrNull()
            }.onFailure { error = friendlyNetworkError(it) }
            loading = false
        }
    }

    companion object {
        fun factory(catalog: CatalogRepository, id: String) = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T = ProductViewModel(catalog, id) as T
        }
    }
}

@Composable
fun ProductScreen(
    idOrSlug: String,
    session: SessionViewModel,
    onProduct: (String) -> Unit,
) {
    val app = LocalApp.current
    val vm: ProductViewModel = viewModel(
        key = idOrSlug,
        factory = ProductViewModel.factory(app.catalog, idOrSlug),
    )
    val snack = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val favs by session.favoriteIds.collectAsState()
    val p = vm.product

    Box(Modifier.fillMaxSize()) {
        when {
            vm.loading && p == null -> LoadingBlock()
            vm.error != null && p == null -> ErrorBlock(vm.error ?: "", vm::refresh)
            p != null -> Column(Modifier.verticalScroll(rememberScrollState()).padding(16.dp)) {
                ProductVisualBox(
                    motif = p.visual,
                    colorHex = vm.color?.hex ?: p.colors.firstOrNull()?.hex ?: "#111111",
                    modifier = Modifier.fillMaxWidth().aspectRatio(1f),
                )
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f).padding(top = 16.dp)) {
                        Text(
                            p.categoryName.uppercase(),
                            style = MaterialTheme.typography.labelSmall,
                            color = Mist,
                        )
                        Text(p.name, style = MaterialTheme.typography.headlineMedium)
                    }
                    IconButton(onClick = { session.toggleFavorite(p.id) }) {
                        Icon(
                            if (p.id in favs) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                            contentDescription = "Favoritar",
                            tint = Gold,
                        )
                    }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
                    Text(formatBRL(p.price), style = MaterialTheme.typography.titleLarge)
                    p.compareAtPrice?.takeIf { it > p.price }?.let {
                        Text(formatBRL(it), color = Mist)
                    }
                    p.discountPct?.let { Text("$it% off", color = Gold) }
                }
                Text(p.description, modifier = Modifier.padding(top = 12.dp), color = Mist)
                if (p.colors.isNotEmpty()) {
                    Text("Cor", style = MaterialTheme.typography.labelLarge, modifier = Modifier.padding(top = 16.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier
                            .padding(top = 8.dp)
                            .horizontalScroll(rememberScrollState()),
                    ) {
                        p.colors.forEach { c ->
                            Box(
                                Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .background(parseHex(c.hex))
                                    .border(2.dp, if (vm.color == c) Ink else Line, CircleShape)
                                    .clickable { vm.color = c },
                            )
                        }
                    }
                }
                if (p.sizes.isNotEmpty()) {
                    Text("Tamanho", style = MaterialTheme.typography.labelLarge, modifier = Modifier.padding(top = 16.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier
                            .padding(top = 8.dp)
                            .horizontalScroll(rememberScrollState()),
                    ) {
                        p.sizes.forEach { s ->
                            JpFilterChip(selected = vm.size == s, onClick = { vm.size = s }, label = s)
                        }
                    }
                }
                Spacer(Modifier.height(16.dp))
                JpButton(
                    text = if (p.stock > 0) "Adicionar à sacola" else "Esgotado",
                    enabled = p.stock > 0 && (p.sizes.size <= 1 || vm.size != null),
                    onClick = {
                        session.addToBag(
                            CartLine(
                                productId = p.id,
                                name = p.name,
                                slug = p.slug,
                                price = p.price,
                                compareAtPrice = p.compareAtPrice,
                                visual = p.visual,
                                colorName = vm.color?.name ?: "",
                                colorHex = vm.color?.hex ?: "#111111",
                                size = vm.size ?: p.sizes.firstOrNull() ?: "Único",
                                quantity = 1,
                                stock = p.stock,
                            ),
                        )
                        scope.launch { snack.showSnackbar("Adicionado à sacola") }
                    },
                    modifier = Modifier.fillMaxWidth(),
                )
                if (vm.related.isNotEmpty()) {
                    Text("Quem viu, viu também", style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(top = 24.dp, bottom = 12.dp))
                    vm.related.take(4).forEach { rel ->
                        ProductCard(rel, onClick = { onProduct(rel.slug) }, modifier = Modifier.padding(bottom = 12.dp))
                    }
                }
            }
        }
        SnackbarHost(snack, modifier = Modifier.align(Alignment.BottomCenter))
    }
}
