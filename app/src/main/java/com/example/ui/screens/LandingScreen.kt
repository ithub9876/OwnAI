package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.IdeBadge
import com.example.ui.components.StatusDot
import com.example.ui.theme.*

@Composable
fun LandingScreen(
    onNavigateToAuth: () -> Unit,
    onNavigateToWorkspace: () -> Unit,
    onNavigateToRouting: () -> Unit,
    onNavigateToProjects: () -> Unit
) {
    val scrollState = rememberScrollState()

    Scaffold(
        containerColor = Slate950,
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Slate950.copy(alpha = 0.95f))
                    .border(1.dp, Slate850)
                    .padding(horizontal = 20.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(ElectricBlue),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Terminal, contentDescription = null, modifier = Modifier.size(18.dp), tint = Color.White)
                    }
                    Text(
                        text = "OwnAI",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontFamily = CodeFontFamily,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 0.5.sp
                        ),
                        color = Slate100
                    )
                    IdeBadge(text = "BYOK AGENT", backgroundColor = Slate900, textColor = ElectricBlue)
                }

                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(onClick = onNavigateToRouting) {
                        Text("AI Routes", style = MaterialTheme.typography.labelMedium.copy(fontFamily = CodeFontFamily), color = Slate300)
                    }
                    Button(
                        onClick = onNavigateToWorkspace,
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue),
                        shape = RoundedCornerShape(6.dp),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text("Launch Workspace", style = MaterialTheme.typography.labelMedium)
                    }
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(scrollState)
                .padding(horizontal = 20.dp, vertical = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Hero Tag
            Surface(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .border(1.dp, ElectricBlue.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                color = ElectricBlue.copy(alpha = 0.1f)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 5.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    StatusDot(isActive = true, activeColor = ElectricBlue)
                    Text(
                        text = "Bring Your Own Keys • True Autonomous Coding Agent",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 11.sp),
                        color = BlueLight
                    )
                }
            }

            Spacer(Modifier.height(20.dp))

            // Main Hero Headline
            Text(
                text = "Build software with your own models.",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = (-0.5).sp,
                    fontSize = 32.sp
                ),
                color = Slate100,
                modifier = Modifier.widthIn(max = 600.dp)
            )

            Spacer(Modifier.height(12.dp))

            Text(
                text = "OwnAI is not a chatbot. It is a full autonomous software engineer that inspects projects, plans file changes, runs container builds in isolated sandboxes, executes tests, and verifies code with your own API keys.",
                style = MaterialTheme.typography.bodyLarge.copy(lineHeight = 24.sp),
                color = Slate400,
                modifier = Modifier.widthIn(max = 580.dp)
            )

            Spacer(Modifier.height(24.dp))

            // Call to Action Buttons
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(
                    onClick = onNavigateToWorkspace,
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp)
                ) {
                    Icon(Icons.Default.Code, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Open IDE Workspace", style = MaterialTheme.typography.labelLarge)
                }

                OutlinedButton(
                    onClick = onNavigateToRouting,
                    shape = RoundedCornerShape(8.dp),
                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(Slate700)),
                    contentPadding = PaddingValues(horizontal = 18.dp, vertical = 12.dp)
                ) {
                    Icon(Icons.Default.Key, contentDescription = null, modifier = Modifier.size(18.dp), tint = Slate300)
                    Spacer(Modifier.width(8.dp))
                    Text("Manage BYOK Keys", style = MaterialTheme.typography.labelLarge, color = Slate200)
                }
            }

            Spacer(Modifier.height(36.dp))

            // Interactive Live IDE Simulation Card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 750.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .border(1.dp, Slate800, RoundedCornerShape(12.dp)),
                color = Slate900
            ) {
                Column {
                    // Simulated IDE Window Top Bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate950)
                            .border(1.dp, Slate850)
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(modifier = Modifier.size(10.dp).clip(RoundedCornerShape(5.dp)).background(CrimsonError))
                            Box(modifier = Modifier.size(10.dp).clip(RoundedCornerShape(5.dp)).background(AmberWarning))
                            Box(modifier = Modifier.size(10.dp).clip(RoundedCornerShape(5.dp)).background(EmeraldGreen))
                        }
                        Text(
                            text = "jarvis-portfolio — OwnAI Autonomous IDE",
                            style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                            color = Slate400
                        )
                        IdeBadge(text = "SANDBOX ACTIVE", backgroundColor = EmeraldDark.copy(alpha = 0.3f), textColor = EmeraldLight, borderColor = EmeraldGreen.copy(alpha = 0.4f))
                    }

                    // Simulated Code & Agent Progression
                    Row(modifier = Modifier.fillMaxWidth().height(260.dp)) {
                        // Left Mini File Tree
                        Column(
                            modifier = Modifier
                                .width(140.dp)
                                .fillMaxHeight()
                                .background(Slate950)
                                .border(1.dp, Slate850)
                                .padding(8.dp)
                        ) {
                            Text("EXPLORER", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 9.sp), color = Slate500)
                            Spacer(Modifier.height(6.dp))
                            Text("▾ app/", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = Slate400)
                            Text("    page.tsx", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = ElectricBlue)
                            Text("▾ components/", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = Slate400)
                            Text("    Hero.tsx", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = EmeraldLight)
                            Text("    ContactForm.tsx", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = Slate300)
                            Text("  package.json", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = AmberLight)
                        }

                        // Center Code Preview
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight()
                                .background(Slate900)
                                .padding(10.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text("Hero.tsx", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = Slate200)
                                IdeBadge(text = "+42 -18", backgroundColor = EmeraldDark.copy(alpha = 0.3f), textColor = EmeraldLight)
                            }
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = "1  export default function Hero() {\n2    return (\n3      <section className=\"py-24 max-w-5xl mx-auto\">\n4        <div className=\"bg-blue-500/10 text-blue-400\">\n5          <Sparkles size={14} /> OwnAI Agent\n6        </div>\n7        <h1 className=\"text-5xl font-bold\">\n8          Autonomous Intelligence\n9        </h1>\n10     </section>\n11   );\n12 }",
                                style = TextStyle(fontFamily = CodeFontFamily, fontSize = 10.sp, lineHeight = 16.sp, color = Slate300)
                            )
                        }
                    }

                    // Simulated Bottom Terminal Step Stream
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Slate950)
                            .border(1.dp, Slate850)
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(14.dp), tint = EmeraldGreen)
                            Text("Step 7/7: Production build verified (0 errors in container)", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = EmeraldLight)
                        }
                        Text("320ms via NVIDIA NIM", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp), color = Slate500)
                    }
                }
            }

            Spacer(Modifier.height(40.dp))

            // 4 Pillars Feature Cards
            Column(
                modifier = Modifier.fillMaxWidth().widthIn(max = 750.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                FeatureCard(
                    icon = Icons.Default.Key,
                    title = "1. Bring Your Own Keys (BYOK)",
                    desc = "Use your own API keys for NVIDIA NIM, Anthropic Claude, OpenAI, Google Gemini, Groq LPU, OpenRouter, and Local Custom endpoints. Keys are encrypted client-side with AES-GCM."
                )

                FeatureCard(
                    icon = Icons.Default.AltRoute,
                    title = "2. Priority Routing & Dynamic Fallback",
                    desc = "Define prioritized model fallback chains (e.g. DeepSeek R1 → Claude 3.5 Sonnet → GPT-4o). When a route hits 429 Rate Limit or 500 errors, the engine automatically fails over to the next route seamlessly."
                )

                FeatureCard(
                    icon = Icons.Default.DataObject,
                    title = "3. Real Autonomous Tool Pipeline",
                    desc = "OwnAI executes tools for listing files, reading source code, creating & editing files, running builds, analyzing diagnostics, and auto-fixing compilation bugs."
                )

                FeatureCard(
                    icon = Icons.Default.Dns,
                    title = "4. Isolated Sandbox Execution & ZIP Export",
                    desc = "Run real commands, production builds, and test suites in an isolated sandbox environment with CPU/RAM metrics, and export complete project ZIP archives with one click."
                )
            }

            Spacer(Modifier.height(30.dp))

            // Footer info
            Text(
                text = "© 2026 OwnAI • Built for developers who own their models and workflow.",
                style = MaterialTheme.typography.bodySmall.copy(fontFamily = CodeFontFamily),
                color = Slate600
            )
        }
    }
}

@Composable
private fun FeatureCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    desc: String
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .border(1.dp, Slate800, RoundedCornerShape(8.dp)),
        color = Slate900
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(ElectricBlue.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, modifier = Modifier.size(20.dp), tint = ElectricBlue)
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100)
                Spacer(Modifier.height(4.dp))
                Text(desc, style = MaterialTheme.typography.bodyMedium.copy(lineHeight = 20.sp), color = Slate400)
            }
        }
    }
}
