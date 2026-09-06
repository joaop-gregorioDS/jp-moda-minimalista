package br.com.jpminimal

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import br.com.jpminimal.data.AppContainer
import br.com.jpminimal.ui.navigation.JpApp
import br.com.jpminimal.ui.theme.JpMinimalTheme

val LocalApp = staticCompositionLocalOf<AppContainer> {
    error("AppContainer não fornecido")
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val app = application as JpMinimalApp
        setContent {
            CompositionLocalProvider(LocalApp provides app.container) {
                JpMinimalTheme {
                    JpApp()
                }
            }
        }
    }
}
