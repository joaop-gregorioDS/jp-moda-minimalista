package br.com.jpminimal.ui.navigation

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.sp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.ShoppingBag
import androidx.compose.material.icons.outlined.Storefront
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import br.com.jpminimal.LocalApp
import br.com.jpminimal.ui.account.AccountScreen
import br.com.jpminimal.ui.account.FavoritesScreen
import br.com.jpminimal.ui.account.LoginScreen
import br.com.jpminimal.ui.account.OrdersScreen
import br.com.jpminimal.ui.account.RegisterScreen
import br.com.jpminimal.ui.bag.BagScreen
import br.com.jpminimal.ui.catalog.CatalogScreen
import br.com.jpminimal.ui.checkout.CheckoutScreen
import br.com.jpminimal.ui.components.DemoBanner
import br.com.jpminimal.ui.home.HomeScreen
import br.com.jpminimal.ui.product.ProductScreen
import br.com.jpminimal.ui.search.SearchScreen
import br.com.jpminimal.ui.session.SessionViewModel
import br.com.jpminimal.ui.theme.Gold
import br.com.jpminimal.ui.theme.Ink
import br.com.jpminimal.ui.theme.Paper

private data class Tab(val route: String, val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)

private val tabs = listOf(
    Tab("home", "Início", Icons.Outlined.Home),
    Tab("catalog", "Catálogo", Icons.Outlined.Storefront),
    Tab("bag", "Sacola", Icons.Outlined.ShoppingBag),
    Tab("account", "Conta", Icons.Outlined.AccountCircle),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JpApp() {
    val app = LocalApp.current
    val session: SessionViewModel = viewModel(factory = SessionViewModel.factory(app))
    val nav = rememberNavController()
    val backStack by nav.currentBackStackEntryAsState()
    val current = backStack?.destination?.route.orEmpty()
    val bag by session.bag.collectAsState()
    val showBar = tabs.any { current.startsWith(it.route) }

    fun goTab(route: String) {
        nav.navigate(route) {
            popUpTo(nav.graph.findStartDestination().id) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    Scaffold(
        containerColor = Paper,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("JP", fontWeight = FontWeight.Black, color = Gold, fontSize = 20.sp, letterSpacing = 1.sp)
                        Text("  MINIMAL", fontWeight = FontWeight.Black, color = Ink, fontSize = 20.sp, letterSpacing = 1.sp)
                    }
                },
                actions = {
                    IconButton(onClick = { nav.navigate("search") }) {
                        Icon(Icons.Outlined.Search, contentDescription = "Buscar", tint = Ink)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Paper),
            )
        },
        bottomBar = {
            if (showBar) {
                NavigationBar(containerColor = Paper) {
                    tabs.forEach { tab ->
                        NavigationBarItem(
                            selected = current.startsWith(tab.route),
                            onClick = { goTab(tab.route) },
                            icon = {
                                if (tab.route == "bag") {
                                    BadgedBox(badge = {
                                        if (bag.isNotEmpty()) Badge { Text("${bag.sumOf { it.quantity }}") }
                                    }) {
                                        Icon(tab.icon, contentDescription = tab.label)
                                    }
                                } else {
                                    Icon(tab.icon, contentDescription = tab.label)
                                }
                            },
                            label = { Text(tab.label) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Ink,
                                selectedTextColor = Ink,
                                indicatorColor = Gold.copy(alpha = 0.35f),
                            ),
                        )
                    }
                }
            }
        },
    ) { padding ->
        Column(Modifier.padding(padding)) {
            DemoBanner()
            NavHost(navController = nav, startDestination = "home") {
                composable("home") {
                    HomeScreen(
                        onProduct = { nav.navigate("product/$it") },
                        onCategory = { nav.navigate("catalog?category=$it") },
                    )
                }
                composable("catalog") {
                    CatalogScreen(
                        initialCategory = null,
                        onProduct = { nav.navigate("product/$it") },
                    )
                }
                composable(
                    "catalog?category={category}",
                    arguments = listOf(navArgument("category") {
                        type = NavType.StringType
                        nullable = true
                        defaultValue = null
                    }),
                ) { entry ->
                    CatalogScreen(
                        initialCategory = entry.arguments?.getString("category"),
                        onProduct = { nav.navigate("product/$it") },
                    )
                }
                composable("bag") {
                    BagScreen(
                        onCheckout = { nav.navigate("checkout") },
                        onCatalog = { goTab("catalog") },
                    )
                }
                composable("account") {
                    AccountScreen(
                        session = session,
                        onLogin = { nav.navigate("login") },
                        onOrders = { nav.navigate("orders") },
                        onFavorites = { nav.navigate("favorites") },
                    )
                }
                composable(
                    "product/{id}",
                    arguments = listOf(navArgument("id") { type = NavType.StringType }),
                ) { entry ->
                    ProductScreen(
                        idOrSlug = entry.arguments?.getString("id").orEmpty(),
                        session = session,
                        onProduct = { nav.navigate("product/$it") },
                    )
                }
                composable("search") { SearchScreen(onProduct = { nav.navigate("product/$it") }) }
                composable("checkout") {
                    CheckoutScreen(session = session, onDone = { nav.navigate("orders") })
                }
                composable("login") {
                    LoginScreen(
                        session = session,
                        onRegister = { nav.navigate("register") },
                        onDone = { nav.popBackStack() },
                    )
                }
                composable("register") {
                    RegisterScreen(session = session, onDone = { nav.popBackStack() })
                }
                composable("orders") { OrdersScreen(session = session, onLogin = { nav.navigate("login") }) }
                composable("favorites") { FavoritesScreen(onProduct = { nav.navigate("product/$it") }) }
            }
        }
    }
}
