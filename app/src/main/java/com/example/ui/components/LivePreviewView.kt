package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.entity.ProjectEntity
import com.example.data.entity.ProjectFileEntity
import com.example.ui.theme.*

@Composable
fun LivePreviewView(
    project: ProjectEntity?,
    files: List<ProjectFileEntity>,
    modifier: Modifier = Modifier
) {
    var deviceMode by remember { mutableStateOf("desktop") }
    var isRefreshed by remember { mutableStateOf(false) }

    val heroFile = files.find { it.path.contains("Hero") }
    val isEnhancedHero = heroFile?.content?.contains("Precision") == true || heroFile?.content?.contains("Enhanced") == true
    val hasDarkToggle = files.any { it.path.contains("ThemeToggle") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate950)
    ) {
        // Browser Window Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate900)
                .border(1.dp, Slate850)
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Window control dots
            Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                Box(modifier = Modifier.size(9.dp).clip(RoundedCornerShape(4.5.dp)).background(CrimsonError))
                Box(modifier = Modifier.size(9.dp).clip(RoundedCornerShape(4.5.dp)).background(AmberWarning))
                Box(modifier = Modifier.size(9.dp).clip(RoundedCornerShape(4.5.dp)).background(EmeraldGreen))
            }

            // URL address bar
            Surface(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 16.dp)
                    .clip(RoundedCornerShape(4.dp)),
                color = Slate950
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(Icons.Default.Lock, contentDescription = null, modifier = Modifier.size(11.dp), tint = EmeraldLight)
                    Text(
                        text = "http://localhost:3000 (Next.js 14 Dev Preview)",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                        color = Slate400
                    )
                }
            }

            // Device switch
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                IconButton(onClick = { deviceMode = "mobile" }, modifier = Modifier.size(24.dp)) {
                    Icon(
                        Icons.Default.Smartphone,
                        contentDescription = "Mobile",
                        modifier = Modifier.size(14.dp),
                        tint = if (deviceMode == "mobile") ElectricBlue else Slate500
                    )
                }
                IconButton(onClick = { deviceMode = "desktop" }, modifier = Modifier.size(24.dp)) {
                    Icon(
                        Icons.Default.DesktopWindows,
                        contentDescription = "Desktop",
                        modifier = Modifier.size(14.dp),
                        tint = if (deviceMode == "desktop") ElectricBlue else Slate500
                    )
                }
            }
        }

        // Live Render Canvas
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Slate950)
                .padding(if (deviceMode == "mobile") 16.dp else 0.dp),
            contentAlignment = Alignment.TopCenter
        ) {
            val previewModifier = if (deviceMode == "mobile") {
                Modifier
                    .width(360.dp)
                    .fillMaxHeight()
                    .clip(RoundedCornerShape(16.dp))
                    .border(2.dp, Slate800, RoundedCornerShape(16.dp))
                    .background(Slate950)
            } else {
                Modifier
                    .fillMaxSize()
                    .background(Slate950)
            }

            Column(
                modifier = previewModifier.verticalScroll(rememberScrollState())
            ) {
                // Rendered Web Nav
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate950.copy(alpha = 0.9f))
                        .border(1.dp, Slate850)
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Icon(Icons.Default.Terminal, contentDescription = null, modifier = Modifier.size(16.dp), tint = ElectricBlue)
                        Text(
                            text = (project?.name ?: "OwnAI App").lowercase().replace(" ", "") + ".dev",
                            style = MaterialTheme.typography.titleSmall.copy(fontFamily = CodeFontFamily, fontWeight = FontWeight.Bold),
                            color = Slate100
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        if (hasDarkToggle) {
                            Surface(
                                modifier = Modifier.clip(RoundedCornerShape(4.dp)).border(1.dp, Slate800, RoundedCornerShape(4.dp)),
                                color = Slate900
                            ) {
                                Icon(Icons.Default.DarkMode, contentDescription = null, modifier = Modifier.padding(4.dp).size(12.dp), tint = AmberWarning)
                            }
                        }
                        IdeBadge(text = "LIVE", backgroundColor = EmeraldDark.copy(alpha = 0.4f), textColor = EmeraldLight, borderColor = EmeraldGreen.copy(alpha = 0.3f))
                    }
                }

                // Rendered Hero Section
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 32.dp),
                    horizontalAlignment = Alignment.Start
                ) {
                    if (isEnhancedHero) {
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .border(1.dp, EmeraldGreen.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                            color = EmeraldGreen.copy(alpha = 0.1f)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(Icons.Default.Bolt, contentDescription = null, modifier = Modifier.size(12.dp), tint = EmeraldLight)
                                Text("Enhanced Hero v2.0 • Ultra-Responsive Dark Theme", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp), color = EmeraldLight)
                            }
                        }
                        Spacer(Modifier.height(14.dp))
                        Text(
                            text = "Architecting Software with Autonomous Precision.",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.ExtraBold),
                            color = Slate100
                        )
                    } else {
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(16.dp))
                                .border(1.dp, ElectricBlue.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                            color = ElectricBlue.copy(alpha = 0.1f)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(12.dp), tint = ElectricBlue)
                                Text("OwnAI BYOK Agent", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp), color = BlueLight)
                            }
                        }
                        Spacer(Modifier.height(14.dp))
                        Text(
                            text = "Building software with autonomous intelligence.",
                            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                            color = Slate100
                        )
                    }

                    Spacer(Modifier.height(10.dp))
                    Text(
                        text = "Senior Engineer crafting resilient distributed architectures & reactive developer tooling.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Slate400
                    )

                    Spacer(Modifier.height(20.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = {},
                            colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Get in Touch", style = MaterialTheme.typography.labelMedium)
                        }
                        OutlinedButton(
                            onClick = {},
                            shape = RoundedCornerShape(6.dp),
                            border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(Slate700))
                        ) {
                            Text("View GitHub", style = MaterialTheme.typography.labelMedium, color = Slate300)
                        }
                    }
                }

                // Rendered Contact Form
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate900.copy(alpha = 0.3f))
                        .border(1.dp, Slate850)
                        .padding(20.dp)
                ) {
                    Text("Interactive Contact Form", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100)
                    Text("Powered by reactive state management", style = MaterialTheme.typography.bodySmall, color = Slate500)
                    Spacer(Modifier.height(12.dp))

                    var mockName by remember { mutableStateOf("") }
                    var mockEmail by remember { mutableStateOf("") }
                    var mockSent by remember { mutableStateOf(false) }

                    if (mockSent) {
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(6.dp))
                                .border(1.dp, EmeraldGreen.copy(alpha = 0.4f), RoundedCornerShape(6.dp)),
                            color = EmeraldGreen.copy(alpha = 0.1f)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp), tint = EmeraldLight)
                                Text("Message sent successfully! Form state reactive.", style = MaterialTheme.typography.labelSmall, color = EmeraldLight)
                            }
                        }
                    } else {
                        OutlinedTextField(
                            value = mockName,
                            onValueChange = { mockName = it },
                            placeholder = { Text("Your Name", style = MaterialTheme.typography.bodySmall, color = Slate600) },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = Slate950,
                                unfocusedContainerColor = Slate950,
                                focusedBorderColor = ElectricBlue,
                                unfocusedBorderColor = Slate800
                            ),
                            shape = RoundedCornerShape(6.dp)
                        )
                        Spacer(Modifier.height(6.dp))
                        OutlinedTextField(
                            value = mockEmail,
                            onValueChange = { mockEmail = it },
                            placeholder = { Text("Email Address", style = MaterialTheme.typography.bodySmall, color = Slate600) },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = Slate950,
                                unfocusedContainerColor = Slate950,
                                focusedBorderColor = ElectricBlue,
                                unfocusedBorderColor = Slate800
                            ),
                            shape = RoundedCornerShape(6.dp)
                        )
                        Spacer(Modifier.height(10.dp))
                        Button(
                            onClick = { mockSent = true },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Send Message", style = MaterialTheme.typography.labelMedium)
                        }
                    }
                }
            }
        }
    }
}
