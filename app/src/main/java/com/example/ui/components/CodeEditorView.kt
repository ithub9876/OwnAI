package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.entity.ProjectFileEntity
import com.example.ui.theme.*

@Composable
fun CodeEditorView(
    activeFile: ProjectFileEntity?,
    openFiles: List<String>,
    onSelectFileTab: (String) -> Unit,
    onCloseFileTab: (String) -> Unit,
    onSaveContent: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var editableContent by remember(activeFile?.path, activeFile?.content) {
        mutableStateOf(activeFile?.content ?: "")
    }
    val isModified = editableContent != (activeFile?.content ?: "")
    val clipboardManager = LocalClipboardManager.current

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate950)
    ) {
        // Tab Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate900)
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 4.dp, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (openFiles.isEmpty()) {
                Text(
                    text = "No open files",
                    style = MaterialTheme.typography.bodySmall,
                    color = Slate500,
                    modifier = Modifier.padding(8.dp)
                )
            } else {
                for (filePath in openFiles) {
                    val isActive = filePath == activeFile?.path
                    val fileName = filePath.substringAfterLast("/")
                    Surface(
                        modifier = Modifier
                            .padding(end = 4.dp)
                            .clip(RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp))
                            .clickable { onSelectFileTab(filePath) },
                        color = if (isActive) Slate950 else Slate850,
                        tonalElevation = if (isActive) 2.dp else 0.dp
                    ) {
                        Row(
                            modifier = Modifier
                                .border(
                                    1.dp,
                                    if (isActive) Slate700 else Color.Transparent,
                                    RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp)
                                )
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            val dotColor = when {
                                filePath.endsWith(".tsx") || filePath.endsWith(".ts") -> ElectricBlue
                                filePath.endsWith(".kt") -> PurpleAccent
                                filePath.endsWith(".py") -> AmberWarning
                                filePath.endsWith(".json") -> EmeraldGreen
                                else -> Slate400
                            }
                            Box(modifier = Modifier.size(6.dp).clip(RoundedCornerShape(3.dp)).background(dotColor))

                            Text(
                                text = fileName,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontFamily = CodeFontFamily,
                                    fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Normal
                                ),
                                color = if (isActive) Slate100 else Slate400
                            )

                            if (isActive && isModified) {
                                Box(modifier = Modifier.size(6.dp).clip(RoundedCornerShape(3.dp)).background(AmberWarning))
                            }

                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Close Tab",
                                modifier = Modifier
                                    .size(12.dp)
                                    .clickable { onCloseFileTab(filePath) },
                                tint = Slate500
                            )
                        }
                    }
                }
            }
        }

        // Action Toolbar
        if (activeFile != null) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Slate900.copy(alpha = 0.5f))
                    .border(1.dp, Slate850)
                    .padding(horizontal = 12.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = activeFile.path,
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                        color = Slate400
                    )
                    IdeBadge(
                        text = activeFile.language.uppercase(),
                        backgroundColor = Slate850,
                        textColor = ElectricBlue
                    )
                    Text(
                        text = "${editableContent.lines().size} lines",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                        color = Slate500
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    if (isModified) {
                        Button(
                            onClick = { onSaveContent(editableContent) },
                            colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                            modifier = Modifier.height(28.dp),
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Icon(Icons.Default.Save, contentDescription = null, modifier = Modifier.size(12.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("Save", style = MaterialTheme.typography.labelSmall)
                        }
                    }

                    IconButton(
                        onClick = {
                            clipboardManager.setText(AnnotatedString(editableContent))
                        },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = "Copy code", modifier = Modifier.size(14.dp), tint = Slate400)
                    }
                }
            }
        }

        // Code Editor Canvas (Gutter + Text Field)
        if (activeFile == null) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.Code, contentDescription = null, modifier = Modifier.size(40.dp), tint = Slate700)
                    Spacer(Modifier.height(8.dp))
                    Text("Select a file from the explorer to view & edit code", style = MaterialTheme.typography.bodyMedium, color = Slate500)
                }
            }
        } else {
            val lines = editableContent.lines()
            val verticalScroll = rememberScrollState()
            val horizontalScroll = rememberScrollState()

            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(verticalScroll)
            ) {
                // Line numbers gutter
                Column(
                    modifier = Modifier
                        .background(Slate900)
                        .padding(horizontal = 10.dp, vertical = 8.dp),
                    horizontalAlignment = Alignment.End
                ) {
                    for (i in 1..lines.size) {
                        Text(
                            text = i.toString(),
                            style = TextStyle(
                                fontFamily = CodeFontFamily,
                                fontSize = 12.sp,
                                lineHeight = 20.sp,
                                color = Slate600
                            )
                        )
                    }
                }

                Divider(
                    modifier = Modifier
                        .fillMaxHeight()
                        .width(1.dp),
                    color = Slate800
                )

                // Editable Code Text
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .horizontalScroll(horizontalScroll)
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    BasicTextField(
                        value = editableContent,
                        onValueChange = { editableContent = it },
                        textStyle = TextStyle(
                            fontFamily = CodeFontFamily,
                            fontSize = 12.sp,
                            lineHeight = 20.sp,
                            color = Slate100
                        ),
                        cursorBrush = SolidColor(ElectricBlue),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    }
}
