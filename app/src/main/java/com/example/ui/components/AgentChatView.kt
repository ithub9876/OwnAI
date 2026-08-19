package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.example.data.entity.AgentStepEntity
import com.example.data.entity.ConversationMessageEntity
import com.example.data.entity.MessageSender
import com.example.ui.theme.*

@Composable
fun AgentChatView(
    messages: List<ConversationMessageEntity>,
    steps: List<AgentStepEntity>,
    isAgentRunning: Boolean,
    currentStepStatus: String,
    onSendPrompt: (String) -> Unit,
    onViewDiffClick: (String?) -> Unit,
    modifier: Modifier = Modifier
) {
    var promptInput by remember { mutableStateOf("") }
    val listState = rememberLazyListState()
    var isStepsExpanded by remember { mutableStateOf(true) }

    LaunchedEffect(messages.size, steps.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate900)
            .border(1.dp, Slate800)
    ) {
        // Agent Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate950)
                .border(1.dp, Slate850)
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(if (isAgentRunning) AmberWarning else EmeraldGreen)
                )
                Text(
                    text = "OWNAI AGENT",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = CodeFontFamily,
                        letterSpacing = 1.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    color = Slate200
                )
                IdeBadge(
                    text = if (isAgentRunning) "EXECUTING" else "READY",
                    backgroundColor = if (isAgentRunning) AmberWarning.copy(alpha = 0.2f) else EmeraldGreen.copy(alpha = 0.2f),
                    textColor = if (isAgentRunning) AmberLight else EmeraldLight,
                    borderColor = if (isAgentRunning) AmberWarning.copy(alpha = 0.4f) else EmeraldGreen.copy(alpha = 0.4f)
                )
            }

            if (steps.isNotEmpty()) {
                TextButton(
                    onClick = { isStepsExpanded = !isStepsExpanded },
                    contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = if (isStepsExpanded) "Hide Steps" else "Show Steps (${steps.size})",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                        color = ElectricBlue
                    )
                }
            }
        }

        // Live Step Progression Tracker Card
        AnimatedVisibility(visible = isStepsExpanded && (isAgentRunning || steps.isNotEmpty())) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .border(1.dp, if (isAgentRunning) ElectricBlue.copy(alpha = 0.5f) else Slate800, RoundedCornerShape(6.dp)),
                color = Slate950
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            if (isAgentRunning) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(12.dp),
                                    strokeWidth = 2.dp,
                                    color = ElectricBlue
                                )
                            } else {
                                Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(14.dp), tint = EmeraldGreen)
                            }
                            Text(
                                text = if (isAgentRunning) currentStepStatus else "All Tools & Verifications Passed",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontFamily = CodeFontFamily,
                                    fontWeight = FontWeight.SemiBold
                                ),
                                color = if (isAgentRunning) BlueLight else EmeraldLight
                            )
                        }
                    }

                    Spacer(Modifier.height(6.dp))

                    // Step list items
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        for (step in steps.takeLast(5)) {
                            Row(
                                verticalAlignment = Alignment.Top,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                val stepIcon = when (step.stepType) {
                                    "PLAN" -> "📋"
                                    "INSPECT" -> "🔍"
                                    "READ_FILE" -> "📖"
                                    "CREATE_FILE" -> "✨"
                                    "EDIT_FILE" -> "✏️"
                                    "RUN_BUILD" -> "⚡"
                                    "RUN_TEST" -> "🧪"
                                    "AUTO_FIX" -> "🩹"
                                    "VERIFIED" -> "✓"
                                    else -> "•"
                                }
                                Text(stepIcon, style = TextStyle(fontSize = 11.sp))
                                Column {
                                    Text(
                                        text = step.description,
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontFamily = CodeFontFamily,
                                            fontSize = 11.sp
                                        ),
                                        color = if (step.isSuccess) Slate300 else CrimsonLight
                                    )
                                    if (step.toolName.isNotBlank() && step.toolResult.isNotBlank() && !step.toolResult.startsWith("Created file")) {
                                        Text(
                                            text = "tool:${step.toolName} -> ${step.toolResult.take(60)}",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontFamily = CodeFontFamily,
                                                fontSize = 9.sp
                                            ),
                                            color = Slate500
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Messages Thread
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            if (messages.isEmpty()) {
                item {
                    Box(modifier = Modifier.fillMaxWidth().padding(top = 40.dp), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(Icons.Default.Terminal, contentDescription = null, modifier = Modifier.size(36.dp), tint = Slate700)
                            Spacer(Modifier.height(8.dp))
                            Text("OwnAI Coding Agent ready", style = MaterialTheme.typography.bodyMedium, color = Slate400)
                            Text("Give a task: 'Make the hero section better and add dark mode'", style = MaterialTheme.typography.bodySmall, color = Slate600)
                        }
                    }
                }
            } else {
                items(messages) { msg ->
                    val isUser = msg.sender == MessageSender.USER
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 2.dp),
                        horizontalAlignment = if (isUser) Alignment.End else Alignment.Start
                    ) {
                        Surface(
                            modifier = Modifier
                                .widthIn(max = 340.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .border(
                                    1.dp,
                                    if (isUser) ElectricBlue.copy(alpha = 0.4f) else Slate800,
                                    RoundedCornerShape(8.dp)
                                ),
                            color = if (isUser) Slate850 else Slate950
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = if (isUser) Icons.Default.Person else Icons.Default.SmartToy,
                                        contentDescription = null,
                                        modifier = Modifier.size(12.dp),
                                        tint = if (isUser) ElectricBlue else EmeraldGreen
                                    )
                                    Text(
                                        text = if (isUser) "YOU" else "OWNAI AGENT",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontFamily = CodeFontFamily,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 10.sp
                                        ),
                                        color = if (isUser) BlueLight else EmeraldLight
                                    )
                                }

                                Spacer(Modifier.height(4.dp))

                                Text(
                                    text = msg.content,
                                    style = MaterialTheme.typography.bodySmall.copy(lineHeight = 18.sp),
                                    color = Slate200
                                )

                                if (msg.diffSummary.isNotBlank()) {
                                    Spacer(Modifier.height(8.dp))
                                    Surface(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(4.dp))
                                            .border(1.dp, EmeraldGreen.copy(alpha = 0.3f), RoundedCornerShape(4.dp))
                                            .clickable { onViewDiffClick(null) },
                                        color = EmeraldDark.copy(alpha = 0.2f)
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                                Icon(Icons.Default.Compare, contentDescription = null, modifier = Modifier.size(12.dp), tint = EmeraldLight)
                                                Text(
                                                    text = msg.diffSummary,
                                                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                                                    color = EmeraldLight
                                                )
                                            }
                                            Text(
                                                text = "Inspect Diff →",
                                                style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                                                color = EmeraldLight
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

        // Quick Suggestion Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate950)
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 8.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            val suggestions = listOf(
                "Make hero section better and add dark mode",
                "Create a modern portfolio website with contact form",
                "Fix TypeScript & compilation errors",
                "Run test suite & verify build",
                "Add interactive project showcase grid"
            )
            for (suggestion in suggestions) {
                Surface(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .border(1.dp, Slate800, RoundedCornerShape(12.dp)),
                    color = Slate900,
                    onClick = {
                        promptInput = suggestion
                    }
                ) {
                    Text(
                        text = suggestion,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp),
                        color = Slate400
                    )
                }
            }
        }

        // Prompt Input Area
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate950)
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            OutlinedTextField(
                value = promptInput,
                onValueChange = { promptInput = it },
                placeholder = {
                    Text(
                        "Describe what to build or change...",
                        style = MaterialTheme.typography.bodySmall,
                        color = Slate500
                    )
                },
                modifier = Modifier.weight(1f),
                textStyle = MaterialTheme.typography.bodySmall.copy(color = Slate100),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ElectricBlue,
                    unfocusedBorderColor = Slate700,
                    focusedContainerColor = Slate900,
                    unfocusedContainerColor = Slate900
                ),
                shape = RoundedCornerShape(8.dp),
                maxLines = 3
            )

            Button(
                onClick = {
                    if (promptInput.isNotBlank()) {
                        val text = promptInput
                        promptInput = ""
                        onSendPrompt(text)
                    }
                },
                enabled = promptInput.isNotBlank() && !isAgentRunning,
                modifier = Modifier.height(48.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = ElectricBlue,
                    disabledContainerColor = Slate800
                ),
                contentPadding = PaddingValues(horizontal = 14.dp)
            ) {
                Icon(Icons.Default.Send, contentDescription = "Send", modifier = Modifier.size(16.dp))
            }
        }
    }
}
