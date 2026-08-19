package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.entity.AiRouteEntity
import com.example.data.entity.ApiKeyEntity
import com.example.data.entity.ApiKeyStatus
import com.example.router.ProviderCatalog
import com.example.ui.components.IdeBadge
import com.example.ui.components.IdeSectionHeader
import com.example.ui.components.StatusDot
import com.example.ui.theme.*
import com.example.ui.viewmodel.RoutingViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun KeysAndRoutingScreen(
    viewModel: RoutingViewModel,
    onNavigateBack: () -> Unit
) {
    val apiKeys by viewModel.apiKeys.collectAsState()
    val routes by viewModel.routes.collectAsState()
    val uiState by viewModel.uiState.collectAsState()

    var isAddKeyDialogOpen by remember { mutableStateOf(false) }
    var isAddRouteDialogOpen by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(uiState.feedbackMessage) {
        uiState.feedbackMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.clearFeedback()
        }
    }

    Scaffold(
        containerColor = Slate950,
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.AltRoute, contentDescription = null, tint = ElectricBlue)
                        Text("BYOK Keys & AI Routing", style = MaterialTheme.typography.titleMedium.copy(fontFamily = CodeFontFamily, fontWeight = FontWeight.Bold), color = Slate100)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Slate300)
                    }
                },
                actions = {
                    Button(
                        onClick = { viewModel.testAllRoutes() },
                        enabled = !uiState.isTestingRoutes,
                        colors = ButtonDefaults.buttonColors(containerColor = Slate800),
                        shape = RoundedCornerShape(6.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        if (uiState.isTestingRoutes) {
                            CircularProgressIndicator(modifier = Modifier.size(12.dp), strokeWidth = 2.dp, color = ElectricBlue)
                        } else {
                            Icon(Icons.Default.Speed, contentDescription = null, modifier = Modifier.size(14.dp), tint = ElectricBlue)
                        }
                        Spacer(Modifier.width(4.dp))
                        Text("Ping All Routes", style = MaterialTheme.typography.labelSmall)
                    }
                    Spacer(Modifier.width(8.dp))
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Slate950)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // SECTION 1: Dynamic Fallback Simulator
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .border(1.dp, Slate800, RoundedCornerShape(8.dp)),
                    color = Slate900
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Icon(Icons.Default.Shield, contentDescription = null, modifier = Modifier.size(16.dp), tint = ElectricBlue)
                                Text("Dynamic Multi-Route Fallback Simulator", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold), color = Slate100)
                            }
                            Button(
                                onClick = { viewModel.simulateFallbackFailure() },
                                enabled = !uiState.isSimulatingFallback,
                                colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue),
                                shape = RoundedCornerShape(6.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                                modifier = Modifier.height(30.dp)
                            ) {
                                Text("Trigger 429 Failover Test", style = MaterialTheme.typography.labelSmall)
                            }
                        }

                        Spacer(Modifier.height(8.dp))
                        Text(
                            text = "Test how OwnAI automatically handles 429 Rate Limits or outage errors by failing over instantly to Priority 2 and Priority 3 routes.",
                            style = MaterialTheme.typography.bodySmall,
                            color = Slate400
                        )

                        if (uiState.isSimulatingFallback || uiState.simulationLogs.isNotEmpty()) {
                            Spacer(Modifier.height(10.dp))
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(6.dp)),
                                color = Slate950
                            ) {
                                Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                    if (uiState.activeSimulationStep.isNotBlank()) {
                                        Text(
                                            text = uiState.activeSimulationStep,
                                            style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontWeight = FontWeight.Bold),
                                            color = CyanAccent
                                        )
                                    }
                                    for (log in uiState.simulationLogs) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                                        ) {
                                            if (log.isSuccess) {
                                                Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(14.dp), tint = EmeraldGreen)
                                                Text(
                                                    text = "Route [${log.routeName}]: Succeeded (${log.latencyMs}ms, 200 OK)",
                                                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                                                    color = EmeraldLight
                                                )
                                            } else {
                                                Icon(Icons.Default.Warning, contentDescription = null, modifier = Modifier.size(14.dp), tint = AmberWarning)
                                                Text(
                                                    text = "Route [${log.routeName}]: HTTP ${log.statusCode} (Rate Limit Exceeded) -> Failover",
                                                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                                                    color = AmberLight
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // SECTION 2: Priority AI Routes
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    IdeSectionHeader(title = "Priority Routing Chain (${routes.size} Routes)", icon = Icons.Default.FormatListNumbered)
                    IconButton(onClick = { isAddRouteDialogOpen = true }, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.AddCircle, contentDescription = "Add Route", tint = ElectricBlue)
                    }
                }
            }

            items(routes.sortedBy { it.priority }) { route ->
                val testRes = uiState.testResults[route.id]
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .border(1.dp, if (route.isEnabled) Slate800 else Slate850, RoundedCornerShape(8.dp)),
                    color = if (route.isEnabled) Slate900 else Slate950
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Surface(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(RoundedCornerShape(6.dp)),
                                color = Slate800
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = "#${route.priority}",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontFamily = CodeFontFamily,
                                            fontWeight = FontWeight.Bold
                                        ),
                                        color = ElectricBlue
                                    )
                                }
                            }

                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Text(
                                        text = route.name,
                                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                                        color = if (route.isEnabled) Slate100 else Slate500
                                    )
                                    IdeBadge(
                                        text = route.provider.uppercase(),
                                        backgroundColor = Slate850,
                                        textColor = if (route.provider == "nvidia") EmeraldLight else ElectricBlue
                                    )
                                }
                                Spacer(Modifier.height(2.dp))
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Text(
                                        text = route.modelId,
                                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                                        color = Slate400
                                    )
                                    if (route.latencyMs > 0) {
                                        Text(
                                            text = "• ${route.latencyMs}ms",
                                            style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                                            color = if (route.latencyMs < 300) EmeraldLight else AmberLight
                                        )
                                    }
                                    if (testRes != null) {
                                        Text(
                                            text = if (testRes.isSuccess) "✓ Tested (${testRes.latencyMs}ms)" else "✕ Fail",
                                            style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                                            color = if (testRes.isSuccess) EmeraldGreen else CrimsonError
                                        )
                                    }
                                }
                            }
                        }

                        // Actions (Move Up, Move Down, Ping, Toggle, Delete)
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                            IconButton(
                                onClick = { viewModel.pingRoute(route.id) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(Icons.Default.Speed, contentDescription = "Ping", modifier = Modifier.size(15.dp), tint = CyanAccent)
                            }
                            IconButton(
                                onClick = { viewModel.moveRoutePriority(route.id, moveUp = true) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(Icons.Default.KeyboardArrowUp, contentDescription = "Move Up", modifier = Modifier.size(16.dp), tint = Slate400)
                            }
                            IconButton(
                                onClick = { viewModel.moveRoutePriority(route.id, moveUp = false) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(Icons.Default.KeyboardArrowDown, contentDescription = "Move Down", modifier = Modifier.size(16.dp), tint = Slate400)
                            }
                            Switch(
                                checked = route.isEnabled,
                                onCheckedChange = { viewModel.toggleRouteEnabled(route) },
                                modifier = Modifier.scale(0.7f),
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = ElectricBlue,
                                    checkedTrackColor = BlueDark
                                )
                            )
                            IconButton(
                                onClick = { viewModel.deleteRoute(route.id) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete", modifier = Modifier.size(14.dp), tint = Slate600)
                            }
                        }
                    }
                }
            }

            // SECTION 3: Stored API Keys
            item {
                Spacer(Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    IdeSectionHeader(title = "Encrypted BYOK Keys (${apiKeys.size})", icon = Icons.Default.Key)
                    Button(
                        onClick = { isAddKeyDialogOpen = true },
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue),
                        shape = RoundedCornerShape(6.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.height(30.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Add API Key", style = MaterialTheme.typography.labelSmall)
                    }
                }
            }

            items(apiKeys) { key ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .border(1.dp, Slate800, RoundedCornerShape(8.dp)),
                    color = Slate900
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(Slate800),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.VpnKey, contentDescription = null, modifier = Modifier.size(16.dp), tint = ElectricBlue)
                            }

                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Text(key.name, style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold), color = Slate100)
                                    IdeBadge(
                                        text = key.status.name,
                                        backgroundColor = if (key.status == ApiKeyStatus.ACTIVE) EmeraldDark.copy(alpha = 0.3f) else AmberDark.copy(alpha = 0.3f),
                                        textColor = if (key.status == ApiKeyStatus.ACTIVE) EmeraldLight else AmberLight
                                    )
                                }
                                Spacer(Modifier.height(2.dp))
                                Text(
                                    text = "${key.maskedKey} • AES-256-GCM Encrypted",
                                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                                    color = Slate400
                                )
                            }
                        }

                        IconButton(
                            onClick = { viewModel.deleteApiKey(key.id) },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete", modifier = Modifier.size(15.dp), tint = Slate500)
                        }
                    }
                }
            }
        }
    }

    // Add API Key Dialog
    if (isAddKeyDialogOpen) {
        var selectedProvider by remember { mutableStateOf("nvidia") }
        var keyLabel by remember { mutableStateOf("") }
        var rawKeyInput by remember { mutableStateOf("") }
        var customBaseUrl by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { isAddKeyDialogOpen = false },
            title = { Text("Add BYOK API Key", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Select Provider:", style = MaterialTheme.typography.labelSmall, color = Slate400)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        val providers = listOf("nvidia", "anthropic", "openai", "gemini", "groq")
                        for (p in providers) {
                            Surface(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(4.dp))
                                    .border(1.dp, if (selectedProvider == p) ElectricBlue else Slate800, RoundedCornerShape(4.dp))
                                    .clickable {
                                        selectedProvider = p
                                        if (keyLabel.isBlank()) keyLabel = "${p.uppercase()} Key"
                                    },
                                color = if (selectedProvider == p) Slate800 else Slate900
                            ) {
                                Box(modifier = Modifier.padding(vertical = 6.dp), contentAlignment = Alignment.Center) {
                                    Text(
                                        text = p.take(4).uppercase(),
                                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 9.sp),
                                        color = if (selectedProvider == p) ElectricBlue else Slate400
                                    )
                                }
                            }
                        }
                    }

                    OutlinedTextField(
                        value = keyLabel,
                        onValueChange = { keyLabel = it },
                        label = { Text("Key Label", style = MaterialTheme.typography.bodySmall) },
                        placeholder = { Text("e.g. My NVIDIA NIM Token") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = Slate900,
                            unfocusedContainerColor = Slate900,
                            focusedBorderColor = ElectricBlue,
                            unfocusedBorderColor = Slate700
                        )
                    )

                    OutlinedTextField(
                        value = rawKeyInput,
                        onValueChange = { rawKeyInput = it },
                        label = { Text("API Key Token (will be AES encrypted)", style = MaterialTheme.typography.bodySmall) },
                        placeholder = { Text("nvapi-... or sk-...") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = Slate900,
                            unfocusedContainerColor = Slate900,
                            focusedBorderColor = ElectricBlue,
                            unfocusedBorderColor = Slate700
                        )
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.addApiKey(keyLabel, selectedProvider, rawKeyInput, customBaseUrl)
                        isAddKeyDialogOpen = false
                    },
                    enabled = rawKeyInput.isNotBlank(),
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)
                ) {
                    Text("Save & Encrypt Key")
                }
            },
            dismissButton = {
                TextButton(onClick = { isAddKeyDialogOpen = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = Slate950
        )
    }

    // Add Route Dialog
    if (isAddRouteDialogOpen) {
        var routeName by remember { mutableStateOf("") }
        var routeProvider by remember { mutableStateOf("nvidia") }
        var modelId by remember { mutableStateOf("deepseek-ai/deepseek-r1") }

        AlertDialog(
            onDismissRequest = { isAddRouteDialogOpen = false },
            title = { Text("Add AI Model Route", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = routeName,
                        onValueChange = { routeName = it },
                        label = { Text("Route Display Name", style = MaterialTheme.typography.bodySmall) },
                        placeholder = { Text("e.g. Claude 3.5 Sonnet Fast") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = modelId,
                        onValueChange = { modelId = it },
                        label = { Text("Model Identifier", style = MaterialTheme.typography.bodySmall) },
                        placeholder = { Text("e.g. claude-3-5-sonnet-20241022 or gpt-4o") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val matchingKey = apiKeys.find { it.provider == routeProvider }?.id
                        viewModel.addRoute(routeName, routeProvider, modelId, matchingKey, true, true)
                        isAddRouteDialogOpen = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)
                ) {
                    Text("Add Route")
                }
            },
            dismissButton = {
                TextButton(onClick = { isAddRouteDialogOpen = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = Slate950
        )
    }
}

private fun Modifier.scale(scale: Float): Modifier = this.then(Modifier.size((48 * scale).dp, (28 * scale).dp))
