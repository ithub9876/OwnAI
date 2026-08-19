package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.example.data.entity.ProjectFileEntity
import com.example.ui.theme.*

// Tree representation data class
data class FolderTreeNode(
    val fullPath: String,
    val name: String,
    val subfolders: MutableMap<String, FolderTreeNode> = mutableMapOf(),
    val files: MutableList<ProjectFileEntity> = mutableListOf()
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FileExplorerView(
    files: List<ProjectFileEntity>,
    activeFilePath: String?,
    onFileClick: (String) -> Unit,
    onCreateFileClick: () -> Unit,
    onCreateFolderClick: (() -> Unit)? = null,
    onDeleteFileClick: (String) -> Unit,
    onRenameFileClick: ((String, String) -> Unit)? = null,
    onDuplicateFileClick: ((String) -> Unit)? = null,
    onUploadAttachmentClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    val collapsedFolders = remember { mutableStateMapOf<String, Boolean>() }

    var fileToRename by remember { mutableStateOf<ProjectFileEntity?>(null) }
    var renameInput by remember { mutableStateOf("") }
    var contextMenuFile by remember { mutableStateOf<ProjectFileEntity?>(null) }

    // Build hierarchical tree
    val root = remember(files, searchQuery) {
        val rootNode = FolderTreeNode(fullPath = "", name = "root")
        val activeList = if (searchQuery.isBlank()) files else files.filter {
            it.path.contains(searchQuery, ignoreCase = true)
        }

        for (file in activeList) {
            val parts = file.path.split("/").filter { it.isNotBlank() }
            if (parts.size <= 1) {
                rootNode.files.add(file)
            } else {
                var current = rootNode
                var currentPath = ""
                for (i in 0 until parts.size - 1) {
                    val folderName = parts[i]
                    currentPath = if (currentPath.isEmpty()) folderName else "$currentPath/$folderName"
                    current = current.subfolders.getOrPut(folderName) {
                        FolderTreeNode(fullPath = currentPath, name = folderName)
                    }
                }
                current.files.add(file)
            }
        }
        rootNode
    }

    val totalLines = remember(files) { files.sumOf { it.linesCount } }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate900)
            .border(1.dp, Slate800)
    ) {
        // Explorer Header & Action Icons
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate950)
                .padding(horizontal = 10.dp, vertical = 7.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Icon(Icons.Default.FolderOpen, contentDescription = null, modifier = Modifier.size(15.dp), tint = ElectricBlue)
                Text(
                    text = "EXPLORER",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = CodeFontFamily,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    ),
                    color = Slate300
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                IconButton(onClick = onCreateFileClick, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Default.NoteAdd, contentDescription = "New File", modifier = Modifier.size(15.dp), tint = ElectricBlue)
                }
                if (onCreateFolderClick != null) {
                    IconButton(onClick = onCreateFolderClick, modifier = Modifier.size(24.dp)) {
                        Icon(Icons.Default.CreateNewFolder, contentDescription = "New Folder", modifier = Modifier.size(15.dp), tint = AmberWarning)
                    }
                }
                IconButton(onClick = onUploadAttachmentClick, modifier = Modifier.size(24.dp)) {
                    Icon(Icons.Default.AttachFile, contentDescription = "Attach File", modifier = Modifier.size(15.dp), tint = Slate400)
                }
                IconButton(
                    onClick = {
                        val allCollapsed = collapsedFolders.values.all { it }
                        if (allCollapsed) collapsedFolders.clear() else {
                            // collapse all
                            root.subfolders.forEach { (name, node) ->
                                collapsedFolders[node.fullPath] = true
                            }
                        }
                    },
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(Icons.Default.UnfoldLess, contentDescription = "Toggle Folders", modifier = Modifier.size(15.dp), tint = Slate500)
                }
            }
        }

        // Quick File Search Input
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Filter tree...", style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp), color = Slate500) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(13.dp), tint = Slate500) },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }, modifier = Modifier.size(18.dp)) {
                        Icon(Icons.Default.Close, contentDescription = "Clear", modifier = Modifier.size(12.dp), tint = Slate400)
                    }
                }
            },
            singleLine = true,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 6.dp, vertical = 4.dp),
            textStyle = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 11.sp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = ElectricBlue,
                unfocusedBorderColor = Slate800,
                focusedContainerColor = Slate950,
                unfocusedContainerColor = Slate950
            ),
            shape = RoundedCornerShape(4.dp)
        )

        Divider(color = Slate800, thickness = 1.dp)

        // Nested Files & Folder Tree
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 4.dp, vertical = 4.dp)
        ) {
            // Render subfolders
            for ((folderName, subfolderNode) in root.subfolders) {
                item(key = "folder_${subfolderNode.fullPath}") {
                    FolderNodeItem(
                        node = subfolderNode,
                        level = 0,
                        activeFilePath = activeFilePath,
                        collapsedFolders = collapsedFolders,
                        onFileClick = onFileClick,
                        onDeleteFileClick = onDeleteFileClick,
                        onFileContextClick = { contextMenuFile = it }
                    )
                }
            }

            // Render root level files
            items(root.files, key = { it.id }) { file ->
                FileNodeItem(
                    file = file,
                    displayName = file.name.ifBlank { file.path },
                    level = 0,
                    isSelected = file.path == activeFilePath,
                    onFileClick = { onFileClick(file.path) },
                    onDeleteFileClick = { onDeleteFileClick(file.path) },
                    onFileContextClick = { contextMenuFile = file }
                )
            }
        }

        // Explorer Bottom Status Footer
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, Slate800),
            color = Slate950
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 5.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Icon(Icons.Default.Terminal, contentDescription = null, modifier = Modifier.size(11.dp), tint = EmeraldLight)
                    Text(
                        text = "${files.size} files",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                        color = Slate400
                    )
                    Text("•", style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp), color = Slate600)
                    Text(
                        text = "$totalLines lines",
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                        color = Slate400
                    )
                }

                IdeBadge(
                    text = "GIT: MAIN",
                    backgroundColor = Slate900,
                    textColor = CyanAccent,
                    borderColor = Slate800
                )
            }
        }
    }

    // Context Menu Sheet / Dialog
    if (contextMenuFile != null) {
        val target = contextMenuFile!!
        AlertDialog(
            onDismissRequest = { contextMenuFile = null },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    Icon(Icons.Default.InsertDriveFile, contentDescription = null, tint = ElectricBlue, modifier = Modifier.size(18.dp))
                    Text(target.path, style = MaterialTheme.typography.titleSmall.copy(fontFamily = CodeFontFamily), color = Slate100)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text("Lines: ${target.linesCount} • Language: ${target.language} • Status: ${target.gitStatus.name}", style = MaterialTheme.typography.bodySmall, color = Slate400)
                    Spacer(Modifier.height(10.dp))

                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(4.dp))
                            .clickable {
                                renameInput = target.path
                                fileToRename = target
                                contextMenuFile = null
                            },
                        color = Slate900
                    ) {
                        Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.DriveFileRenameOutline, contentDescription = null, modifier = Modifier.size(16.dp), tint = CyanAccent)
                            Text("Rename File", style = MaterialTheme.typography.bodySmall, color = Slate200)
                        }
                    }

                    if (onDuplicateFileClick != null) {
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(4.dp))
                                .clickable {
                                    onDuplicateFileClick(target.path)
                                    contextMenuFile = null
                                },
                            color = Slate900
                        ) {
                            Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp), tint = EmeraldLight)
                                Text("Duplicate File", style = MaterialTheme.typography.bodySmall, color = Slate200)
                            }
                        }
                    }

                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(4.dp))
                            .clickable {
                                onDeleteFileClick(target.path)
                                contextMenuFile = null
                            },
                        color = Slate900
                    ) {
                        Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.Delete, contentDescription = null, modifier = Modifier.size(16.dp), tint = CrimsonLight)
                            Text("Delete File", style = MaterialTheme.typography.bodySmall, color = CrimsonLight)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { contextMenuFile = null }) {
                    Text("Close", color = Slate400)
                }
            },
            containerColor = Slate950
        )
    }

    // Rename Dialog
    if (fileToRename != null) {
        AlertDialog(
            onDismissRequest = { fileToRename = null },
            title = { Text("Rename File", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("New file path:", style = MaterialTheme.typography.bodySmall, color = Slate400)
                    OutlinedTextField(
                        value = renameInput,
                        onValueChange = { renameInput = it },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        textStyle = MaterialTheme.typography.labelMedium.copy(fontFamily = CodeFontFamily)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        onRenameFileClick?.invoke(fileToRename!!.path, renameInput.trim())
                        fileToRename = null
                    },
                    enabled = renameInput.isNotBlank(),
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)
                ) {
                    Text("Rename")
                }
            },
            dismissButton = {
                TextButton(onClick = { fileToRename = null }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = Slate950
        )
    }
}

@Composable
fun FolderNodeItem(
    node: FolderTreeNode,
    level: Int,
    activeFilePath: String?,
    collapsedFolders: MutableMap<String, Boolean>,
    onFileClick: (String) -> Unit,
    onDeleteFileClick: (String) -> Unit,
    onFileContextClick: (ProjectFileEntity) -> Unit
) {
    val isCollapsed = collapsedFolders[node.fullPath] == true

    Column(modifier = Modifier.fillMaxWidth()) {
        // Folder Row
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(4.dp))
                .clickable {
                    collapsedFolders[node.fullPath] = !isCollapsed
                },
            color = Color.Transparent
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = (level * 12 + 4).dp, end = 4.dp, top = 3.dp, bottom = 3.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = if (isCollapsed) Icons.Default.ChevronRight else Icons.Default.KeyboardArrowDown,
                        contentDescription = if (isCollapsed) "Expand" else "Collapse",
                        modifier = Modifier.size(14.dp),
                        tint = Slate400
                    )
                    Icon(
                        imageVector = if (isCollapsed) Icons.Default.Folder else Icons.Default.FolderOpen,
                        contentDescription = null,
                        modifier = Modifier.size(15.dp),
                        tint = AmberWarning
                    )
                    Text(
                        text = node.name,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontFamily = CodeFontFamily,
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 11.sp
                        ),
                        color = Slate200,
                        maxLines = 1
                    )
                }

                // Child count badge
                val totalItems = node.files.size + node.subfolders.size
                Text(
                    text = "$totalItems",
                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 9.sp),
                    color = Slate500,
                    modifier = Modifier.padding(end = 4.dp)
                )
            }
        }

        // Render contents if not collapsed
        AnimatedVisibility(visible = !isCollapsed) {
            Column(modifier = Modifier.fillMaxWidth()) {
                for ((_, subfolder) in node.subfolders) {
                    FolderNodeItem(
                        node = subfolder,
                        level = level + 1,
                        activeFilePath = activeFilePath,
                        collapsedFolders = collapsedFolders,
                        onFileClick = onFileClick,
                        onDeleteFileClick = onDeleteFileClick,
                        onFileContextClick = onFileContextClick
                    )
                }

                for (file in node.files) {
                    FileNodeItem(
                        file = file,
                        displayName = file.name.ifBlank { file.path.substringAfterLast('/') },
                        level = level + 1,
                        isSelected = file.path == activeFilePath,
                        onFileClick = { onFileClick(file.path) },
                        onDeleteFileClick = { onDeleteFileClick(file.path) },
                        onFileContextClick = { onFileContextClick(file) }
                    )
                }
            }
        }
    }
}

@Composable
fun FileNodeItem(
    file: ProjectFileEntity,
    displayName: String,
    level: Int,
    isSelected: Boolean,
    onFileClick: () -> Unit,
    onDeleteFileClick: () -> Unit,
    onFileContextClick: () -> Unit
) {
    val icon = when {
        file.path.endsWith(".tsx") || file.path.endsWith(".ts") -> Icons.Default.Javascript
        file.path.endsWith(".kt") -> Icons.Default.Code
        file.path.endsWith(".py") -> Icons.Default.DataObject
        file.path.endsWith(".json") -> Icons.Default.Settings
        file.path.endsWith(".md") -> Icons.Default.Description
        file.path.endsWith(".css") -> Icons.Default.Palette
        file.path.endsWith(".html") -> Icons.Default.Language
        else -> Icons.Default.InsertDriveFile
    }

    val iconTint = when {
        file.path.endsWith(".tsx") || file.path.endsWith(".ts") -> ElectricBlue
        file.path.endsWith(".kt") -> PurpleAccent
        file.path.endsWith(".py") -> AmberWarning
        file.path.endsWith(".json") -> EmeraldGreen
        file.path.endsWith(".md") -> CyanAccent
        file.path.endsWith(".css") -> BlueLight
        else -> Slate400
    }

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(4.dp))
            .clickable { onFileClick() },
        color = if (isSelected) Slate800 else Color.Transparent
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = (level * 12 + 6).dp, end = 4.dp, top = 3.dp, bottom = 3.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(5.dp),
                modifier = Modifier.weight(1f)
            ) {
                Icon(icon, contentDescription = null, modifier = Modifier.size(14.dp), tint = iconTint)
                Text(
                    text = displayName,
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = CodeFontFamily,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                    ),
                    color = if (isSelected) Slate100 else Slate300,
                    maxLines = 1
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                if (file.gitStatus == GitFileStatus.MODIFIED) {
                    Surface(
                        modifier = Modifier.clip(RoundedCornerShape(2.dp)),
                        color = AmberDark.copy(alpha = 0.5f)
                    ) {
                        Text("M", modifier = Modifier.padding(horizontal = 3.dp, vertical = 1.dp), style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 8.sp, fontWeight = FontWeight.Bold), color = AmberLight)
                    }
                } else if (file.gitStatus == GitFileStatus.UNTRACKED) {
                    Surface(
                        modifier = Modifier.clip(RoundedCornerShape(2.dp)),
                        color = EmeraldDark.copy(alpha = 0.5f)
                    ) {
                        Text("U", modifier = Modifier.padding(horizontal = 3.dp, vertical = 1.dp), style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 8.sp, fontWeight = FontWeight.Bold), color = EmeraldLight)
                    }
                }

                IconButton(
                    onClick = onFileContextClick,
                    modifier = Modifier.size(20.dp)
                ) {
                    Icon(Icons.Default.MoreVert, contentDescription = "More", modifier = Modifier.size(13.dp), tint = Slate500)
                }
            }
        }
    }
}
