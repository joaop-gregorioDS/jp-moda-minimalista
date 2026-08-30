package br.com.jpminimal.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import br.com.jpminimal.data.ProductCardDto
import br.com.jpminimal.ui.theme.Gold
import br.com.jpminimal.ui.theme.Ink
import br.com.jpminimal.ui.theme.Line
import br.com.jpminimal.ui.theme.Mist
import br.com.jpminimal.ui.theme.Paper
import br.com.jpminimal.ui.theme.Sand
import br.com.jpminimal.util.formatBRL
import br.com.jpminimal.visual.getProductEmoji

fun parseHex(hex: String): Color = runCatching {
    Color("#${hex.removePrefix("#")}".toColorInt())
}.getOrDefault(Ink)

@Composable
fun ProductVisualBox(
    motif: String,
    colorHex: String,
    modifier: Modifier = Modifier,
) {
    val visual = getProductEmoji(motif)
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(parseHex(colorHex)),
        contentAlignment = Alignment.Center,
    ) {
        Text(text = visual.emoji, fontSize = (42 * visual.scale).sp)
    }
}

@Composable
fun ProductCard(
    product: ProductCardDto,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(Color.White.copy(alpha = 0.7f))
            .clickable(onClick = onClick)
            .padding(bottom = 12.dp),
    ) {
        Box(Modifier.fillMaxWidth().aspectRatio(5f / 5.5f)) {
            ProductVisualBox(
                motif = product.visual,
                colorHex = product.colorHex,
                modifier = Modifier.fillMaxSize(),
            )
            Row(
                Modifier.padding(10.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                product.discountPct?.let {
                    BadgeChip("$it% off")
                }
                if (!product.inStock) BadgeChip("Esgotado", filled = false)
            }
        }
        Text(
            product.categoryName.uppercase(),
            style = MaterialTheme.typography.labelSmall,
            color = Mist,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
        )
        Text(
            product.name,
            style = MaterialTheme.typography.titleMedium,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.padding(horizontal = 12.dp),
        )
        Spacer(Modifier.height(4.dp))
        Row(
            Modifier.padding(horizontal = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(formatBRL(product.price), style = MaterialTheme.typography.bodyMedium)
            product.compareAtPrice?.takeIf { it > product.price }?.let {
                Text(formatBRL(it), color = Mist, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
fun BadgeChip(text: String, filled: Boolean = true) {
    Text(
        text = text.uppercase(),
        color = if (filled) Paper else Ink,
        fontSize = 10.sp,
        modifier = Modifier
            .clip(RoundedCornerShape(50))
            .background(if (filled) Ink else Paper.copy(alpha = 0.9f))
            .padding(horizontal = 8.dp, vertical = 4.dp),
    )
}

@Composable
fun LoadingBlock(label: String = "Carregando…") {
    Column(
        Modifier.fillMaxWidth().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        CircularProgressIndicator(color = Gold)
        Spacer(Modifier.height(12.dp))
        Text(label, color = Mist)
    }
}

@Composable
fun ErrorBlock(message: String, onRetry: () -> Unit) {
    Column(
        Modifier.fillMaxWidth().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(message, color = Mist)
        Spacer(Modifier.height(8.dp))
        TextButton(onClick = onRetry) { Text("Tentar de novo", color = Gold) }
    }
}

@Composable
fun JpFilterChip(
    selected: Boolean,
    onClick: () -> Unit,
    label: String,
    modifier: Modifier = Modifier,
) {
    FilterChip(
        selected = selected,
        onClick = onClick,
        modifier = modifier,
        label = {
            Text(
                label,
                maxLines = 1,
                overflow = TextOverflow.Clip,
                softWrap = false,
                color = if (selected) Paper else Ink,
            )
        },
        colors = FilterChipDefaults.filterChipColors(
            containerColor = Paper,
            labelColor = Ink,
            selectedContainerColor = Ink,
            selectedLabelColor = Paper,
        ),
        border = FilterChipDefaults.filterChipBorder(
            enabled = true,
            selected = selected,
            borderColor = Line,
            selectedBorderColor = Ink,
        ),
    )
}

@Composable
fun JpButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.height(48.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Ink, contentColor = Paper),
        shape = RoundedCornerShape(50),
    ) {
        Text(
            text.uppercase(),
            style = MaterialTheme.typography.labelLarge,
            color = Paper,
            maxLines = 1,
        )
    }
}

@Composable
fun DemoBanner() {
    Box(
        Modifier
            .fillMaxWidth()
            .background(Sand)
            .padding(horizontal = 16.dp, vertical = 8.dp),
    ) {
        Text(
            "Loja de portfólio — pagamentos simulados",
            style = MaterialTheme.typography.labelSmall,
            color = Mist,
        )
    }
}
