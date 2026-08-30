package br.com.jpminimal.ui.account

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import br.com.jpminimal.LocalApp
import br.com.jpminimal.data.OrderDto
import br.com.jpminimal.data.ProductCardDto
import br.com.jpminimal.ui.components.JpButton
import br.com.jpminimal.ui.components.ProductCard
import br.com.jpminimal.ui.components.ProductVisualBox
import br.com.jpminimal.ui.session.SessionViewModel
import br.com.jpminimal.ui.theme.Gold
import br.com.jpminimal.ui.theme.Mist
import br.com.jpminimal.util.formatBRL
import kotlinx.coroutines.launch

@Composable
fun AccountScreen(
    session: SessionViewModel,
    onLogin: () -> Unit,
    onOrders: () -> Unit,
    onFavorites: () -> Unit,
) {
    val ctx = LocalContext.current
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Conta", style = MaterialTheme.typography.headlineMedium)
        val user = session.user
        if (user == null) {
            Text("Entre para ver pedidos e dados da conta.", color = Mist)
            JpButton("Entrar", onLogin, Modifier.fillMaxWidth())
        } else {
            Text(user.name, style = MaterialTheme.typography.titleLarge)
            Text(user.email, color = Mist)
            TextButton(onClick = onOrders) { Text("Meus pedidos") }
            TextButton(onClick = onFavorites) { Text("Favoritos") }
            TextButton(onClick = { session.logout() }) { Text("Sair") }
        }
        Text("Sobre a JP Minimal", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 24.dp))
        Text("Loja de portfólio. Pagamentos simulados.", color = Mist)
        Text(
            "joaop.gregorio@outlook.com",
            color = Gold,
            modifier = Modifier.clickable {
                ctx.startActivity(Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:joaop.gregorio@outlook.com")))
            },
        )
        Text(
            "WhatsApp +55 (11) 98388-1984",
            color = Gold,
            modifier = Modifier.clickable {
                ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/5511983881984")))
            },
        )
    }
}

@Composable
fun LoginScreen(
    session: SessionViewModel,
    onRegister: () -> Unit,
    onDone: () -> Unit,
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Entrar", style = MaterialTheme.typography.headlineMedium)
        OutlinedTextField(email, { email = it }, label = { Text("E-mail") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
        OutlinedTextField(
            password,
            { password = it },
            label = { Text("Senha") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
        )
        session.authError?.let { Text(it, color = MaterialTheme.colorScheme.error) }
        JpButton("Entrar", { session.login(email, password, onDone) }, Modifier.fillMaxWidth())
        TextButton(onClick = onRegister) { Text("Criar conta") }
        Text("Demo: demo@jpstore.com.br / demo1234", color = Mist)
    }
}

@Composable
fun RegisterScreen(
    session: SessionViewModel,
    onDone: () -> Unit,
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Cadastro", style = MaterialTheme.typography.headlineMedium)
        OutlinedTextField(name, { name = it }, label = { Text("Nome") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
        OutlinedTextField(email, { email = it }, label = { Text("E-mail") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
        OutlinedTextField(phone, { phone = it }, label = { Text("Telefone") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
        OutlinedTextField(
            password,
            { password = it },
            label = { Text("Senha (mín. 6)") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
        )
        session.authError?.let { Text(it, color = MaterialTheme.colorScheme.error) }
        JpButton("Cadastrar", { session.register(name, email, password, phone, onDone) }, Modifier.fillMaxWidth())
    }
}

@Composable
fun OrdersScreen(session: SessionViewModel, onLogin: () -> Unit) {
    val app = LocalApp.current
    var orders by remember { mutableStateOf<List<OrderDto>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }
    LaunchedEffect(session.user) {
        if (session.user == null) return@LaunchedEffect
        runCatching { app.orders.list() }
            .onSuccess { orders = it }
            .onFailure { error = it.message }
    }
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Pedidos", style = MaterialTheme.typography.headlineMedium)
        if (session.user == null) {
            Text("Entre para ver seus pedidos.", color = Mist, modifier = Modifier.padding(top = 12.dp))
            JpButton("Entrar", onLogin, Modifier.fillMaxWidth().padding(top = 12.dp))
            return@Column
        }
        error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
        if (orders.isEmpty() && error == null) Text("Nenhum pedido ainda.", color = Mist, modifier = Modifier.padding(top = 12.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.padding(top = 12.dp)) {
            items(orders, key = { it.id }) { o ->
                Column {
                    Text("Pedido #${o.id} · ${o.status}", style = MaterialTheme.typography.titleMedium)
                    Text(formatBRL(o.total), color = Mist)
                    o.items.forEach { line ->
                        Row(Modifier.padding(top = 6.dp)) {
                            ProductVisualBox(line.visual, "#111111", Modifier.size(40.dp))
                            Text("${line.quantity}× ${line.productName}", modifier = Modifier.padding(start = 8.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun FavoritesScreen(onProduct: (String) -> Unit) {
    val app = LocalApp.current
    val ids by app.favorites.ids.collectAsState(initial = emptySet())
    var products by remember { mutableStateOf<List<ProductCardDto>>(emptyList()) }
    LaunchedEffect(ids) {
        products = runCatching { app.catalog.byIds(ids.toList()) }.getOrDefault(emptyList())
    }
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Favoritos", style = MaterialTheme.typography.headlineMedium)
        if (products.isEmpty()) {
            Text("Nenhuma peça salva.", color = Mist, modifier = Modifier.padding(top = 12.dp))
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.padding(top = 12.dp),
            ) {
                items(products, key = { it.id }) { p ->
                    ProductCard(p, onClick = { onProduct(p.slug) })
                }
            }
        }
    }
}
