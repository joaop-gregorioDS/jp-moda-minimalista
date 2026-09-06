package br.com.jpminimal.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Ink = Color(0xFF111111)
val InkSoft = Color(0xFF1C1C1C)
val Paper = Color(0xFFFAFAF7)
val Sand = Color(0xFFF3F0E9)
val Gold = Color(0xFFC6A87C)
val GoldDark = Color(0xFFA88758)
val GoldLight = Color(0xFFE5D8BF)
val Mist = Color(0xFF7A7A74)
val Line = Color(0xFFE9E5DC)

private val JpColors = lightColorScheme(
    primary = Gold,
    onPrimary = Ink,
    primaryContainer = GoldLight,
    onPrimaryContainer = Ink,
    secondary = Ink,
    onSecondary = Paper,
    secondaryContainer = Ink,
    onSecondaryContainer = Paper,
    tertiary = GoldDark,
    onTertiary = Paper,
    tertiaryContainer = GoldLight,
    onTertiaryContainer = Ink,
    background = Paper,
    onBackground = Ink,
    surface = Paper,
    onSurface = Ink,
    surfaceVariant = Sand,
    onSurfaceVariant = Mist,
    outline = Line,
    outlineVariant = GoldLight,
    error = Color(0xFF8B2E3A),
    onError = Paper,
)

private val JpTypography = Typography(
    headlineLarge = TextStyle(fontWeight = FontWeight.Black, fontSize = 32.sp, letterSpacing = (-0.5).sp),
    headlineMedium = TextStyle(fontWeight = FontWeight.Bold, fontSize = 24.sp),
    titleLarge = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 20.sp),
    titleMedium = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 16.sp, letterSpacing = 0.2.sp),
    bodyLarge = TextStyle(fontSize = 16.sp),
    bodyMedium = TextStyle(fontSize = 14.sp),
    labelLarge = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 13.sp, letterSpacing = 1.4.sp),
    labelSmall = TextStyle(fontWeight = FontWeight.Medium, fontSize = 11.sp, letterSpacing = 1.6.sp),
)

@Composable
fun JpMinimalTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = JpColors,
        typography = JpTypography,
        content = content,
    )
}
