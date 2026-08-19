package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.IdeBadge
import com.example.ui.theme.*
import com.example.ui.viewmodel.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    authViewModel: AuthViewModel,
    onNavigateBack: () -> Unit,
    onSignOut: () -> Unit
) {
    val authState by authViewModel.uiState.collectAsState()

    Scaffold(
        containerColor = Slate950,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Settings, contentDescription = null, tint = ElectricBlue)
                        Text("Security & System Settings", style = MaterialTheme.typography.titleMedium.copy(fontFamily = CodeFontFamily, fontWeight = FontWeight.Bold), color = Slate100)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Slate300)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Slate950)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Profile Card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .border(1.dp, Slate800, RoundedCornerShape(8.dp)),
                color = Slate900
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(ElectricBlue),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = (authState.currentUser?.displayName?.take(1) ?: "A").uppercase(),
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                    color = Color.White
                                )
                            }
                            Column {
                                Text(
                                    text = authState.currentUser?.displayName ?: "Alex Vance (Lead Architect)",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                    color = Slate100
                                )
                                Text(
                                    text = authState.currentUser?.email ?: "developer@ownai.dev",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = Slate400
                                )
                            }
                        }

                        Button(
                            onClick = {
                                authViewModel.signOut()
                                onSignOut()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = CrimsonDark),
                            shape = RoundedCornerShape(6.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                            modifier = Modifier.height(32.dp)
                        ) {
                            Text("Sign Out", style = MaterialTheme.typography.labelSmall, color = CrimsonLight)
                        }
                    }
                }
            }

            // Security & Encryption Card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .border(1.dp, Slate800, RoundedCornerShape(8.dp)),
                color = Slate900
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Shield, contentDescription = null, modifier = Modifier.size(18.dp), tint = EmeraldLight)
                        Text("Security & Key Storage Architecture", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100)
                    }

                    Text(
                        text = "• Cryptographic Standard: AES-256-GCM symmetric authenticated encryption with 128-bit authentication tags.\n" +
                                "• Key Derivation: SHA-256 PBKDF2 hash stretching with hardware-backed initialization vectors.\n" +
                                "• Memory Isolation: API keys are decrypted purely in transient heap memory during provider dispatch and never written unencrypted to disk.\n" +
                                "• Zero Telemetry Leakage: No keystrokes or raw provider secrets are logged to logcat or transmitted to third-party servers.",
                        style = MaterialTheme.typography.bodySmall.copy(lineHeight = 20.sp),
                        color = Slate300
                    )
                }
            }

            // Sandbox Specifications Card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .border(1.dp, Slate800, RoundedCornerShape(8.dp)),
                color = Slate900
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Dns, contentDescription = null, modifier = Modifier.size(18.dp), tint = ElectricBlue)
                        Text("Isolated Container Sandbox Specs", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100)
                    }

                    Text(
                        text = "• Container Environment: Alpine Linux Node.js 20.14 LTS & Python 3.12 Virtual Runtime.\n" +
                                "• Resource Limits: Max 512MB Virtual RAM / 2 vCPU cores per isolated workspace.\n" +
                                "• Filesystem Sandbox: Strict chroot container isolation preventing unauthorized host filesystem access.\n" +
                                "• Automated Verification: Next.js production builds (`npm run build`) and Jest unit test assertions executed prior to task completion.",
                        style = MaterialTheme.typography.bodySmall.copy(lineHeight = 20.sp),
                        color = Slate300
                    )
                }
            }
        }
    }
}
