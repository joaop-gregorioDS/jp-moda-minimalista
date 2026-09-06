package br.com.jpminimal.ui.bag

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import br.com.jpminimal.LocalApp
import br.com.jpminimal.ui.components.JpButton
import br.com.jpminimal.ui.components.ProductVisualBox
import br.com.jpminimal.ui.theme.Mist
import br.com.jpminimal.util.formatBRL
import kotlinx.coroutines.launch

@Composable
fun BagScreen(
    onCheckout: () -> Unit,
    onCatalog: () -> Unit,
) {
    val app = LocalApp.current
    val items by app.bag.items.collectAsState(initial = emptyList())
    val scope = rememberCoroutineScope()
    val subtotal = items.sumOf { it.price * it.quantity }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Sacola", style = MaterialTheme.typography.headlineMedium)
        if (items.isEmpty()) {
            Text("Sua sacola está vazia.", color = Mist, modifier = Modifier.padding(top = 24.dp))
            JpButton("Ver catálogo", onCatalog, Modifier.fillMaxWidth().padding(top = 16.dp))
        } else {
            LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(items, key = { it.key }) { line ->
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                        ProductVisualBox(line.visual, line.colorHex, Modifier.size(72.dp))
                        Column(Modifier.weight(1f).padding(horizontal = 12.dp)) {
                            Text(line.name, style = MaterialTheme.typography.titleMedium)
                            Text("${line.size} · ${line.colorName}", color = Mist)
                            Text(formatBRL(line.price * line.quantity))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                TextButton(onClick = { scope.launch { app.bag.setQty(line.key, line.quantity - 1) } }) { Text("−") }
                                Text("${line.quantity}")
                                TextButton(onClick = { scope.launch { app.bag.setQty(line.key, line.quantity + 1) } }) { Text("+") }
                            }
                        }
                        IconButton(onClick = { scope.launch { app.bag.remove(line.key) } }) {
                            Icon(Icons.Outlined.Delete, contentDescription = "Remover")
                        }
                    }
                }
            }
            Text("Subtotal ${formatBRL(subtotal)}", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(vertical = 12.dp))
            JpButton("Checkout", onCheckout, Modifier.fillMaxWidth())
        }
    }
}
