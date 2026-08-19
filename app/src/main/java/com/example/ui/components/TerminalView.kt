package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

@Composable
fun TerminalView(
    terminalOutput: String,
    cpuUsage: Float,
    ramUsage: Float,
    isExecuting: Boolean,
    onExecuteCommand: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var cmdInput by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()

    LaunchedEffect(terminalOutput) {
        scrollState.animateScrollTo(scrollState.maxValue)
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate950)
            .border(1.dp, Slate800)
    ) {
        // Terminal Top Bar with Resource Gauges
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate900)
                .border(1.dp, Slate850)
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Icon(Icons.Default.Terminal, contentDescription = null, modifier = Modifier.size(14.dp), tint = ElectricBlue)
                Text(
                    text = "SANDBOX RUNTIME",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = CodeFontFamily,
                        letterSpacing = 1.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    color = Slate300
                )
                IdeBadge(
                    text = "ISOLATED",
                    backgroundColor = EmeraldDark.copy(alpha = 0.4f),
                    textColor = EmeraldLight,
                    borderColor = EmeraldGreen.copy(alpha = 0.3f)
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text("CPU", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 9.sp), color = Slate500)
                    Text(
                        String.format("%.1f%%", cpuUsage),
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                        color = if (cpuUsage > 50f) AmberWarning else CyanAccent
                    )
                }
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text("RAM", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 9.sp), color = Slate500)
                    Text(
                        String.format("%.1f MB", ramUsage),
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                        color = ElectricBlue
                    )
                }
            }
        }

        // Quick Command Shortcuts
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate950)
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 8.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            val quickCommands = listOf("npm run build", "npm test", "git status", "git diff", "ls")
            for (qc in quickCommands) {
                Surface(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .border(1.dp, Slate800, RoundedCornerShape(4.dp)),
                    color = Slate900,
                    onClick = { onExecuteCommand(qc) }
                ) {
                    Text(
                        text = qc,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                        color = Slate400
                    )
                }
            }
        }

        // Terminal Output Stream
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .verticalScroll(scrollState)
                .padding(horizontal = 10.dp, vertical = 6.dp)
        ) {
            Text(
                text = terminalOutput,
                style = TextStyle(
                    fontFamily = CodeFontFamily,
                    fontSize = 11.sp,
                    lineHeight = 18.sp,
                    color = Slate300
                )
            )
        }

        // CLI Prompt Input
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate900)
                .border(1.dp, Slate800)
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(
                text = "$",
                style = MaterialTheme.typography.labelMedium.copy(
                    fontFamily = CodeFontFamily,
                    fontWeight = FontWeight.Bold
                ),
                color = ElectricBlue
            )

            BasicTextField(
                value = cmdInput,
                onValueChange = { cmdInput = it },
                textStyle = TextStyle(
                    fontFamily = CodeFontFamily,
                    fontSize = 12.sp,
                    color = Slate100
                ),
                cursorBrush = SolidColor(ElectricBlue),
                modifier = Modifier.weight(1f),
                singleLine = true
            )

            if (isExecuting) {
                CircularProgressIndicator(modifier = Modifier.size(14.dp), strokeWidth = 2.dp, color = ElectricBlue)
            } else {
                IconButton(
                    onClick = {
                        if (cmdInput.isNotBlank()) {
                            val c = cmdInput
                            cmdInput = ""
                            onExecuteCommand(c)
                        }
                    },
                    modifier = Modifier.size(26.dp)
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = "Run", modifier = Modifier.size(16.dp), tint = ElectricBlue)
                }
            }
        }
    }
}
