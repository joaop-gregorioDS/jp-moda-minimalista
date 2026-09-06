package br.com.jpminimal.ui.checkout

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import br.com.jpminimal.LocalApp
import br.com.jpminimal.data.OrderAddressDto
import br.com.jpminimal.data.OrderItemDto
import br.com.jpminimal.data.PlaceOrderBody
import br.com.jpminimal.data.friendlyNetworkError
import br.com.jpminimal.ui.components.JpButton
import br.com.jpminimal.ui.components.JpFilterChip
import br.com.jpminimal.ui.session.SessionViewModel
import br.com.jpminimal.ui.theme.GoldDark
import br.com.jpminimal.ui.theme.Mist
import br.com.jpminimal.util.formatBRL
import br.com.jpminimal.util.paymentDiscount
import br.com.jpminimal.util.shippingFor
import kotlinx.coroutines.launch

@Composable
fun CheckoutScreen(
    session: SessionViewModel,
    onDone: (Int) -> Unit,
) {
    val app = LocalApp.current
    val items by app.bag.items.collectAsState(initial = emptyList())
    val scope = rememberCoroutineScope()
    val user = session.user

    var name by remember { mutableStateOf(user?.name.orEmpty()) }
    var email by remember { mutableStateOf(user?.email.orEmpty()) }
    var street by remember { mutableStateOf("") }
    var number by remember { mutableStateOf("") }
    var complement by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var state by remember { mutableStateOf("") }
    var zip by remember { mutableStateOf("") }
    var delivery by remember { mutableStateOf("entrega") }
    var payment by remember { mutableStateOf("pix") }
    var cardNumber by remember { mutableStateOf("") }
    var cardName by remember { mutableStateOf("") }
    var cardExpiry by remember { mutableStateOf("") }
    var cardCvv by remember { mutableStateOf("") }
    var placing by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var placedId by remember { mutableStateOf<Int?>(null) }

    LaunchedEffect(user) {
        if (user != null) {
            name = user.name
            email = user.email
        }
    }

    val pickup = delivery == "retirada"
    val subtotal = items.sumOf { it.price * it.quantity }
    val shipping = shippingFor(subtotal, pickup)
    val discount = paymentDiscount(subtotal, payment, pickup)
    val total = (subtotal + shipping - discount).coerceAtLeast(0.0)

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        Text("Checkout", style = MaterialTheme.typography.headlineMedium)
        Text("Pagamento simulado — nenhuma cobrança real.", color = Mist, modifier = Modifier.padding(top = 4.dp, bottom = 16.dp))

        placedId?.let { id ->
            Text("Pedido #$id registrado.", color = GoldDark, style = MaterialTheme.typography.titleLarge)
            if (payment == "pix") {
                Text("Pix (simulado): pix@jpstore.com.br", modifier = Modifier.padding(top = 8.dp))
            }
            if (payment == "boleto") {
                Text("Boleto gerado (simulado). Vencimento em 3 dias.", modifier = Modifier.padding(top = 8.dp))
            }
            JpButton("Ver pedidos", { onDone(id) }, Modifier.fillMaxWidth().padding(top = 16.dp))
            return@Column
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            JpFilterChip(selected = !pickup, onClick = { delivery = "entrega" }, label = "Entrega")
            JpFilterChip(selected = pickup, onClick = { delivery = "retirada" }, label = "Retirada")
        }
        OutlinedTextField(name, { name = it }, label = { Text("Nome") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
        OutlinedTextField(email, { email = it }, label = { Text("E-mail") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
        if (!pickup) {
            OutlinedTextField(zip, { zip = it }, label = { Text("CEP") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
            OutlinedTextField(street, { street = it }, label = { Text("Rua") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
            OutlinedTextField(number, { number = it }, label = { Text("Número") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
            OutlinedTextField(complement, { complement = it }, label = { Text("Complemento") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
            OutlinedTextField(city, { city = it }, label = { Text("Cidade") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
            OutlinedTextField(state, { state = it }, label = { Text("UF") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
        } else {
            Text("Retirada na loja física — São Paulo/SP (demo).", color = Mist, modifier = Modifier.padding(top = 8.dp))
        }

        Text("Pagamento", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 16.dp))
        Row(
            modifier = Modifier.horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            JpFilterChip(selected = payment == "pix", onClick = { payment = "pix" }, label = "Pix 5% off")
            JpFilterChip(selected = payment == "cartao", onClick = { payment = "cartao" }, label = "Cartão")
            JpFilterChip(selected = payment == "boleto", onClick = { payment = "boleto" }, label = "Boleto 5% off")
        }
        if (payment == "cartao") {
            OutlinedTextField(cardNumber, { cardNumber = it }, label = { Text("Número do cartão") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
            OutlinedTextField(cardName, { cardName = it }, label = { Text("Nome no cartão") }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp), singleLine = true)
            Row {
                OutlinedTextField(cardExpiry, { cardExpiry = it }, label = { Text("Validade") }, modifier = Modifier.weight(1f).padding(end = 8.dp), singleLine = true)
                OutlinedTextField(cardCvv, { cardCvv = it }, label = { Text("CVV") }, modifier = Modifier.weight(1f), singleLine = true)
            }
            Text("Dados não são enviados à API.", color = Mist)
        }

        Text("Subtotal ${formatBRL(subtotal)}", modifier = Modifier.padding(top = 16.dp))
        Text("Frete ${if (shipping == 0.0) "Grátis" else formatBRL(shipping)}")
        if (discount > 0) Text("Desconto −${formatBRL(discount)}", color = GoldDark)
        Text("Total ${formatBRL(total)}", style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(top = 4.dp))
        error?.let { Text(it, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(top = 8.dp)) }

        JpButton(
            text = if (placing) "Enviando…" else "Finalizar pedido",
            enabled = !placing && items.isNotEmpty(),
            onClick = {
                placing = true
                error = null
                scope.launch {
                    val address = if (pickup) {
                        OrderAddressDto("Retirada na loja", "", "Loja demo", "São Paulo", "SP", "00000-000")
                    } else {
                        OrderAddressDto(street.trim(), number.trim(), complement.ifBlank { null }, city.trim(), state.trim(), zip.trim())
                    }
                    runCatching {
                        app.orders.place(
                            PlaceOrderBody(
                                name = name.trim(),
                                email = email.trim(),
                                items = items.map {
                                    OrderItemDto(it.productId, it.name, it.price, it.quantity, it.colorName, it.size, it.visual)
                                },
                                address = address,
                                subtotal = subtotal,
                                shipping = shipping,
                                discount = discount,
                            ),
                        )
                    }.onSuccess {
                        app.bag.clear()
                        placedId = it.id
                    }.onFailure { error = it.message ?: friendlyNetworkError(it) }
                    placing = false
                }
            },
            modifier = Modifier.fillMaxWidth().padding(top = 16.dp, bottom = 32.dp),
        )
    }
}
