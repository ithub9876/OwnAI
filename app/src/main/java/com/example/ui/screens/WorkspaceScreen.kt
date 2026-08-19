package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.example.data.entity.GitFileStatus
import com.example.ui.components.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.RoutingViewModel
import com.example.ui.viewmodel.WorkspaceTab
import com.example.ui.viewmodel.WorkspaceViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkspaceScreen(
    workspaceViewModel: WorkspaceViewModel,
    routingViewModel: RoutingViewModel,
    onNavigateToRouting: () -> Unit,
    onNavigateToProjects: () -> Unit,
    onNavigateToSettings: () -> Unit
) {
    val uiState by workspaceViewModel.uiState.collectAsState()
    val allProjects by workspaceViewModel.allProjects.collectAsState()
    val files by workspaceViewModel.currentProjectFiles.collectAsState()
    val messages by workspaceViewModel.currentProjectMessages.collectAsState()
    val steps by workspaceViewModel.currentTaskSteps.collectAsState()
    val routes by routingViewModel.routes.collectAsState()

    val currentProject = allProjects.find { it.id == uiState.selectedProjectId }
    val activeFile = files.find { it.path == uiState.activeFilePath }
    val modifiedFiles = files.filter { it.gitStatus == GitFileStatus.MODIFIED || it.gitStatus == GitFileStatus.UNTRACKED }

    var isProjectDropdownExpanded by remember { mutableStateOf(false) }
    var isNewFileDialogOpen by remember { mutableStateOf(false) }
    var isNewFolderDialogOpen by remember { mutableStateOf(false) }
    var isAttachDialogOpen by remember { mutableStateOf(false) }

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(uiState.feedbackMessage) {
        uiState.feedbackMessage?.let {
            snackbarHostState.showSnackbar(it)
            workspaceViewModel.clearFeedback()
        }
    }

    val primaryRoute = routes.sortedBy { it.priority }.firstOrNull { it.isEnabled }

    Scaffold(
        containerColor = Slate950,
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            // Main IDE Navigation Header
            Column(modifier = Modifier.fillMaxWidth().background(Slate950).border(1.dp, Slate850)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Left: Project Dropdown & Route Chip
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .border(1.dp, Slate700, RoundedCornerShape(6.dp))
                                .clickable { isProjectDropdownExpanded = true },
                            color = Slate900
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(Icons.Default.Folder, contentDescription = null, modifier = Modifier.size(14.dp), tint = ElectricBlue)
                                Text(
                                    text = currentProject?.name ?: "Select Project",
                                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontWeight = FontWeight.Bold),
                                    color = Slate100
                                )
                                Icon(Icons.Default.ArrowDropDown, contentDescription = null, modifier = Modifier.size(16.dp), tint = Slate400)
                            }
                        }

                        DropdownMenu(
                            expanded = isProjectDropdownExpanded,
                            onDismissRequest = { isProjectDropdownExpanded = false },
                            modifier = Modifier.background(Slate900)
                        ) {
                            for (p in allProjects) {
                                DropdownMenuItem(
                                    text = {
                                        Text(p.name, style = MaterialTheme.typography.bodySmall.copy(fontFamily = CodeFontFamily), color = Slate200)
                                    },
                                    onClick = {
                                        workspaceViewModel.selectProject(p.id)
                                        isProjectDropdownExpanded = false
                                    }
                                )
                            }
                            Divider(color = Slate800)
                            DropdownMenuItem(
                                text = {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        Icon(Icons.Default.Dashboard, contentDescription = null, modifier = Modifier.size(14.dp), tint = ElectricBlue)
                                        Text("All Projects Dashboard", style = MaterialTheme.typography.bodySmall, color = ElectricBlue)
                                    }
                                },
                                onClick = {
                                    isProjectDropdownExpanded = false
                                    onNavigateToProjects()
                                }
                            )
                        }

                        // Active AI Priority Route Chip
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .border(1.dp, Slate800, RoundedCornerShape(6.dp))
                                .clickable { onNavigateToRouting() },
                            color = Slate900
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                StatusDot(isActive = true, activeColor = if (primaryRoute?.provider == "nvidia") EmeraldGreen else ElectricBlue)
                                Text(
                                    text = primaryRoute?.name ?: "Built-in Autonomous Engine",
                                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                                    color = Slate300
                                )
                                if (primaryRoute != null && primaryRoute.latencyMs > 0) {
                                    Text(
                                        text = "${primaryRoute.latencyMs}ms",
                                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 9.sp),
                                        color = EmeraldLight
                                    )
                                }
                            }
                        }
                    }

                    // Right: Actions
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        IconButton(onClick = { workspaceViewModel.exportProjectZip() }, modifier = Modifier.size(30.dp)) {
                            Icon(Icons.Default.Download, contentDescription = "Export ZIP", modifier = Modifier.size(16.dp), tint = Slate300)
                        }
                        IconButton(onClick = { onNavigateToRouting() }, modifier = Modifier.size(30.dp)) {
                            Icon(Icons.Default.Key, contentDescription = "BYOK Keys", modifier = Modifier.size(16.dp), tint = Slate300)
                        }
                        IconButton(onClick = { onNavigateToSettings() }, modifier = Modifier.size(30.dp)) {
                            Icon(Icons.Default.Settings, contentDescription = "Settings", modifier = Modifier.size(16.dp), tint = Slate300)
                        }
                    }
                }

                // Workspace Mode Tab Strip
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate950)
                        .padding(horizontal = 12.dp, vertical = 2.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val tabs = listOf(
                        WorkspaceTab.EXPLORER to "Explorer (${files.size})",
                        WorkspaceTab.EDITOR to "Code Editor",
                        WorkspaceTab.DIFF_INSPECTOR to "Diffs (${modifiedFiles.size})",
                        WorkspaceTab.LIVE_PREVIEW to "Live Preview",
                        WorkspaceTab.TERMINAL to "Sandbox Terminal"
                    )

                    for ((tab, label) in tabs) {
                        val isSelected = uiState.activeTab == tab
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .border(1.dp, if (isSelected) ElectricBlue else Color.Transparent, RoundedCornerShape(4.dp))
                                .clickable { workspaceViewModel.setWorkspaceTab(tab) },
                            color = if (isSelected) Slate850 else Color.Transparent
                        ) {
                            Text(
                                text = label,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontFamily = CodeFontFamily,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                ),
                                color = if (isSelected) Slate100 else Slate400
                            )
                        }
                    }
                }
            }
        }
    ) { padding ->
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // LEFT PANE: File Explorer (Hierarchical Tree)
            FileExplorerView(
                files = files,
                activeFilePath = uiState.activeFilePath,
                onFileClick = {
                    workspaceViewModel.selectFile(it)
                    if (uiState.activeTab == WorkspaceTab.EXPLORER) {
                        workspaceViewModel.setWorkspaceTab(WorkspaceTab.EDITOR)
                    }
                },
                onCreateFileClick = { isNewFileDialogOpen = true },
                onCreateFolderClick = { isNewFolderDialogOpen = true },
                onDeleteFileClick = { workspaceViewModel.deleteFile(it) },
                onRenameFileClick = { oldPath, newPath -> workspaceViewModel.renameFile(oldPath, newPath) },
                onDuplicateFileClick = { workspaceViewModel.duplicateFile(it) },
                onUploadAttachmentClick = { isAttachDialogOpen = true },
                modifier = Modifier.width(190.dp)
            )

            // CENTER PANE: Active Workspace Tab (Explorer / Editor / Diff / Preview / Terminal)
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
            ) {
                when (uiState.activeTab) {
                    WorkspaceTab.EXPLORER -> {
                        FileExplorerView(
                            files = files,
                            activeFilePath = uiState.activeFilePath,
                            onFileClick = {
                                workspaceViewModel.selectFile(it)
                                workspaceViewModel.setWorkspaceTab(WorkspaceTab.EDITOR)
                            },
                            onCreateFileClick = { isNewFileDialogOpen = true },
                            onCreateFolderClick = { isNewFolderDialogOpen = true },
                            onDeleteFileClick = { workspaceViewModel.deleteFile(it) },
                            onRenameFileClick = { oldPath, newPath -> workspaceViewModel.renameFile(oldPath, newPath) },
                            onDuplicateFileClick = { workspaceViewModel.duplicateFile(it) },
                            onUploadAttachmentClick = { isAttachDialogOpen = true },
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    WorkspaceTab.EDITOR -> {
                        CodeEditorView(
                            activeFile = activeFile,
                            openFiles = uiState.openFiles,
                            onSelectFileTab = { workspaceViewModel.selectFile(it) },
                            onCloseFileTab = { workspaceViewModel.closeFileTab(it) },
                            onSaveContent = { workspaceViewModel.saveActiveFileContent(it) },
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    WorkspaceTab.DIFF_INSPECTOR -> {
                        val targetDiffFile = files.find { it.path == (uiState.diffTargetFilePath ?: activeFile?.path) } ?: activeFile
                        VisualDiffView(
                            file = targetDiffFile,
                            allModifiedFiles = modifiedFiles,
                            onSelectDiffFile = { workspaceViewModel.selectFile(it) },
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    WorkspaceTab.LIVE_PREVIEW -> {
                        LivePreviewView(
                            project = currentProject,
                            files = files,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    WorkspaceTab.TERMINAL -> {
                        TerminalView(
                            terminalOutput = uiState.terminalOutput,
                            cpuUsage = uiState.currentCpuUsage,
                            ramUsage = uiState.currentRamUsage,
                            isExecuting = uiState.isExecutingCommand,
                            onExecuteCommand = { workspaceViewModel.executeTerminalCommand(it) },
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    else -> {}
                }
            }

            // RIGHT PANE: Agent Chat & Progress Panel
            AgentChatView(
                messages = messages,
                steps = steps,
                isAgentRunning = uiState.isAgentRunning,
                currentStepStatus = uiState.currentRunningStep,
                onSendPrompt = { workspaceViewModel.runAgentTask(it) },
                onViewDiffClick = {
                    workspaceViewModel.setWorkspaceTab(WorkspaceTab.DIFF_INSPECTOR)
                },
                modifier = Modifier.width(310.dp)
            )
        }
    }

    // New File Dialog
    if (isNewFileDialogOpen) {
        var filePathInput by remember { mutableStateOf("") }
        AlertDialog(
            onDismissRequest = { isNewFileDialogOpen = false },
            title = { Text("Create File in Workspace", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Enter relative file path:", style = MaterialTheme.typography.bodySmall, color = Slate400)
                    OutlinedTextField(
                        value = filePathInput,
                        onValueChange = { filePathInput = it },
                        placeholder = { Text("e.g. components/Card.tsx or api/chat.py") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        workspaceViewModel.createNewFile(filePathInput)
                        isNewFileDialogOpen = false
                    },
                    enabled = filePathInput.isNotBlank(),
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)
                ) {
                    Text("Create File")
                }
            },
            dismissButton = {
                TextButton(onClick = { isNewFileDialogOpen = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = Slate950
        )
    }

    // New Folder Dialog
    if (isNewFolderDialogOpen) {
        var folderPathInput by remember { mutableStateOf("") }
        AlertDialog(
            onDismissRequest = { isNewFolderDialogOpen = false },
            title = { Text("Create Folder in Workspace", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Enter folder path:", style = MaterialTheme.typography.bodySmall, color = Slate400)
                    OutlinedTextField(
                        value = folderPathInput,
                        onValueChange = { folderPathInput = it },
                        placeholder = { Text("e.g. lib/utils or components/ui") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        workspaceViewModel.createFolder(folderPathInput)
                        isNewFolderDialogOpen = false
                    },
                    enabled = folderPathInput.isNotBlank(),
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)
                ) {
                    Text("Create Folder")
                }
            },
            dismissButton = {
                TextButton(onClick = { isNewFolderDialogOpen = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = Slate950
        )
    }

    // Attach File Dialog
    if (isAttachDialogOpen) {
        var name by remember { mutableStateOf("design_mockup.txt") }
        var content by remember { mutableStateOf("UI Design Spec: Include dark mode toggle and card hover effects.") }
        AlertDialog(
            onDismissRequest = { isAttachDialogOpen = false },
            title = { Text("Attach File or Design Spec", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Attachment Name") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = content,
                        onValueChange = { content = it },
                        label = { Text("Content / Notes") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 4
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        workspaceViewModel.addAttachment(name, "text/plain", content)
                        isAttachDialogOpen = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)
                ) {
                    Text("Attach to Project")
                }
            },
            dismissButton = {
                TextButton(onClick = { isAttachDialogOpen = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = Slate950
        )
    }
}
