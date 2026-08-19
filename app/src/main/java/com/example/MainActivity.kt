package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.ui.screens.*
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.Slate950
import com.example.ui.viewmodel.AuthViewModel
import com.example.ui.viewmodel.RoutingViewModel
import com.example.ui.viewmodel.WorkspaceViewModel

object Routes {
    const val LANDING = "landing"
    const val WORKSPACE = "workspace"
    const val ROUTING = "routing"
    const val PROJECTS = "projects"
    const val AUTH = "auth"
    const val SETTINGS = "settings"
}

class MainActivity : ComponentActivity() {
    private val authViewModel: AuthViewModel by viewModels()
    private val workspaceViewModel: WorkspaceViewModel by viewModels()
    private val routingViewModel: RoutingViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Slate950
                ) {
                    OwnAiApp(
                        authViewModel = authViewModel,
                        workspaceViewModel = workspaceViewModel,
                        routingViewModel = routingViewModel
                    )
                }
            }
        }
    }
}

@Composable
fun OwnAiApp(
    authViewModel: AuthViewModel,
    workspaceViewModel: WorkspaceViewModel,
    routingViewModel: RoutingViewModel
) {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.LANDING
    ) {
        composable(Routes.LANDING) {
            LandingScreen(
                onNavigateToAuth = { navController.navigate(Routes.AUTH) },
                onNavigateToWorkspace = { navController.navigate(Routes.WORKSPACE) },
                onNavigateToRouting = { navController.navigate(Routes.ROUTING) },
                onNavigateToProjects = { navController.navigate(Routes.PROJECTS) }
            )
        }

        composable(Routes.WORKSPACE) {
            WorkspaceScreen(
                workspaceViewModel = workspaceViewModel,
                routingViewModel = routingViewModel,
                onNavigateToRouting = { navController.navigate(Routes.ROUTING) },
                onNavigateToProjects = { navController.navigate(Routes.PROJECTS) },
                onNavigateToSettings = { navController.navigate(Routes.SETTINGS) }
            )
        }

        composable(Routes.ROUTING) {
            KeysAndRoutingScreen(
                viewModel = routingViewModel,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Routes.PROJECTS) {
            ProjectsDashboardScreen(
                viewModel = workspaceViewModel,
                onOpenProject = { projectId ->
                    workspaceViewModel.selectProject(projectId)
                    navController.navigate(Routes.WORKSPACE)
                },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Routes.AUTH) {
            AuthScreen(
                viewModel = authViewModel,
                onAuthSuccess = { navController.navigate(Routes.WORKSPACE) },
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Routes.SETTINGS) {
            SettingsScreen(
                authViewModel = authViewModel,
                onNavigateBack = { navController.popBackStack() },
                onSignOut = {
                    navController.navigate(Routes.LANDING) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
    }
}
