package com.example.ui.screens

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
import com.example.data.entity.ProjectEntity
import com.example.ui.components.IdeBadge
import com.example.ui.theme.*
import com.example.ui.viewmodel.WorkspaceViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProjectsDashboardScreen(
    viewModel: WorkspaceViewModel,
    onOpenProject: (String) -> Unit,
    onNavigateBack: () -> Unit
) {
    val projects by viewModel.allProjects.collectAsState()
    var isNewProjectDialogOpen by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = Slate950,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Folder, contentDescription = null, tint = ElectricBlue)
                        Text("Project Workspaces", style = MaterialTheme.typography.titleMedium.copy(fontFamily = CodeFontFamily, fontWeight = FontWeight.Bold), color = Slate100)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Slate300)
                    }
                },
                actions = {
                    Button(
                        onClick = { isNewProjectDialogOpen = true },
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue),
                        shape = RoundedCornerShape(6.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        modifier = Modifier.height(34.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("New Project", style = MaterialTheme.typography.labelSmall)
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
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(projects) { project ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .border(1.dp, Slate800, RoundedCornerShape(8.dp))
                        .clickable { onOpenProject(project.id) },
                    color = Slate900
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Icon(Icons.Default.Terminal, contentDescription = null, modifier = Modifier.size(20.dp), tint = ElectricBlue)
                                Text(
                                    text = project.name,
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                    color = Slate100
                                )
                                IdeBadge(text = project.framework, backgroundColor = Slate850, textColor = CyanAccent)
                            }

                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                IconButton(
                                    onClick = {
                                        viewModel.selectProject(project.id)
                                        viewModel.exportProjectZip()
                                    },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Default.Download, contentDescription = "Export ZIP", modifier = Modifier.size(16.dp), tint = Slate400)
                                }
                                IconButton(
                                    onClick = { viewModel.deleteProject(project.id) },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Default.Delete, contentDescription = "Delete", modifier = Modifier.size(16.dp), tint = Slate500)
                                }
                            }
                        }

                        Spacer(Modifier.height(6.dp))
                        Text(
                            text = project.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = Slate400
                        )

                        Spacer(Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                Text(
                                    text = "${project.filesCount} files",
                                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                                    color = Slate500
                                )
                                Text(
                                    text = "${project.totalLines} lines of code",
                                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                                    color = Slate500
                                )
                            }

                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text("Open in Workspace", style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily), color = ElectricBlue)
                                Icon(Icons.Default.ChevronRight, contentDescription = null, modifier = Modifier.size(14.dp), tint = ElectricBlue)
                            }
                        }
                    }
                }
            }
        }
    }

    if (isNewProjectDialogOpen) {
        var name by remember { mutableStateOf("") }
        var description by remember { mutableStateOf("") }
        var selectedFramework by remember { mutableStateOf("Next.js (App Router)") }

        AlertDialog(
            onDismissRequest = { isNewProjectDialogOpen = false },
            title = { Text("Create New Project", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold), color = Slate100) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Project Name") },
                        placeholder = { Text("e.g. Acme Portfolio") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("Description") },
                        placeholder = { Text("e.g. Modern developer landing page") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 2
                    )

                    Text("Framework Architecture:", style = MaterialTheme.typography.labelSmall, color = Slate400)
                    val frameworks = listOf("Next.js (App Router)", "React + Vite", "Python (FastAPI)", "Modern HTML5")
                    for (f in frameworks) {
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(6.dp))
                                .border(1.dp, if (selectedFramework == f) ElectricBlue else Slate800, RoundedCornerShape(6.dp))
                                .clickable { selectedFramework = f },
                            color = if (selectedFramework == f) Slate800 else Slate900
                        ) {
                            Text(
                                text = f,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                                style = MaterialTheme.typography.bodySmall,
                                color = if (selectedFramework == f) Slate100 else Slate400
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.createProject(name, description, selectedFramework)
                        isNewProjectDialogOpen = false
                    },
                    enabled = name.isNotBlank(),
                    colors = ButtonDefaults.buttonColors(containerColor = ElectricBlue)
                ) {
                    Text("Create Project")
                }
            },
            dismissButton = {
                TextButton(onClick = { isNewProjectDialogOpen = false }) {
                    Text("Cancel", color = Slate400)
                }
            },
            containerColor = Slate950
        )
    }
}
