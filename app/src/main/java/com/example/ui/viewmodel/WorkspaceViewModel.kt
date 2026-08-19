package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.agent.AgentTools
import com.example.agent.CodingAgentEngine
import com.example.archive.ProjectArchiveManager
import com.example.data.db.OwnAiDatabase
import com.example.data.entity.*
import com.example.router.AiRouter
import com.example.sandbox.SandboxEnvironment
import com.example.sandbox.SandboxExecutionResult
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID

data class WorkspaceUiState(
    val selectedProjectId: String? = "project_jarvis_demo",
    val activeFilePath: String? = "app/page.tsx",
    val openFiles: List<String> = listOf("app/page.tsx", "components/Hero.tsx", "components/ContactForm.tsx"),
    val activeTab: WorkspaceTab = WorkspaceTab.EDITOR,
    val isAgentRunning: Boolean = false,
    val currentRunningStep: String = "",
    val activeTaskId: String? = null,
    val terminalOutput: String = "OwnAI Isolated Sandbox Shell (v2.4.1)\nType 'npm run build', 'npm test', 'git status', 'ls' or any command below.\n$",
    val terminalInput: String = "",
    val isExecutingCommand: Boolean = false,
    val fileSearchQuery: String = "",
    val isCreatingFileDialog: Boolean = false,
    val isCreatingProjectDialog: Boolean = false,
    val isDiffModalOpen: Boolean = false,
    val diffTargetFilePath: String? = null,
    val feedbackMessage: String? = null,
    val currentCpuUsage: Float = 12.4f,
    val currentRamUsage: Float = 94.2f
)

enum class WorkspaceTab {
    EDITOR,
    EXPLORER,
    DIFF_INSPECTOR,
    LIVE_PREVIEW,
    TERMINAL,
    ATTACHMENTS
}

class WorkspaceViewModel(application: Application) : AndroidViewModel(application) {
    private val db = OwnAiDatabase.getInstance(application)
    private val projectDao = db.projectDao()
    private val projectFileDao = db.projectFileDao()
    private val attachmentDao = db.attachmentDao()
    private val agentTaskDao = db.agentTaskDao()
    private val executionLogDao = db.executionLogDao()
    private val aiRouteDao = db.aiRouteDao()
    private val apiKeyDao = db.apiKeyDao()

    private val sandbox = SandboxEnvironment(projectFileDao, executionLogDao)
    private val agentTools = AgentTools(projectFileDao, projectDao, attachmentDao, sandbox)
    private val aiRouter = AiRouter(aiRouteDao, apiKeyDao)
    private val agentEngine = CodingAgentEngine(agentTools, agentTaskDao, projectDao, projectFileDao, aiRouter)
    private val archiveManager = ProjectArchiveManager(application, projectDao, projectFileDao)

    private val _uiState = MutableStateFlow(WorkspaceUiState())
    val uiState: StateFlow<WorkspaceUiState> = _uiState.asStateFlow()

    val allProjects: StateFlow<List<ProjectEntity>> = projectDao.getAllProjects()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val currentProjectFiles: StateFlow<List<ProjectFileEntity>> = _uiState
        .flatMapLatest { state ->
            val pid = state.selectedProjectId ?: ""
            if (pid.isBlank()) flowOf(emptyList()) else projectFileDao.getFilesForProject(pid)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val currentProjectMessages: StateFlow<List<ConversationMessageEntity>> = _uiState
        .flatMapLatest { state ->
            val pid = state.selectedProjectId ?: ""
            if (pid.isBlank()) flowOf(emptyList()) else agentTaskDao.getMessagesForProject(pid)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val currentProjectTasks: StateFlow<List<AgentTaskEntity>> = _uiState
        .flatMapLatest { state ->
            val pid = state.selectedProjectId ?: ""
            if (pid.isBlank()) flowOf(emptyList()) else agentTaskDao.getTasksForProject(pid)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val currentTaskSteps: StateFlow<List<AgentStepEntity>> = _uiState
        .flatMapLatest { state ->
            val tid = state.activeTaskId ?: ""
            if (tid.isBlank()) flowOf(emptyList()) else agentTaskDao.getStepsForTask(tid)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val currentProjectAttachments: StateFlow<List<AttachmentEntity>> = _uiState
        .flatMapLatest { state ->
            val pid = state.selectedProjectId ?: ""
            if (pid.isBlank()) flowOf(emptyList()) else attachmentDao.getAttachmentsForProject(pid)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val currentExecutionLogs: StateFlow<List<ExecutionLogEntity>> = _uiState
        .flatMapLatest { state ->
            val pid = state.selectedProjectId ?: ""
            if (pid.isBlank()) flowOf(emptyList()) else executionLogDao.getLogsForProject(pid)
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun selectProject(projectId: String) {
        viewModelScope.launch {
            val files = projectFileDao.getAllSourceFiles(projectId)
            val firstFile = files.firstOrNull()?.path ?: "package.json"
            _uiState.value = _uiState.value.copy(
                selectedProjectId = projectId,
                activeFilePath = firstFile,
                openFiles = listOf(firstFile),
                activeTaskId = null
            )
        }
    }

    fun selectFile(path: String) {
        val currentOpen = _uiState.value.openFiles.toMutableList()
        if (!currentOpen.contains(path)) {
            currentOpen.add(path)
        }
        _uiState.value = _uiState.value.copy(
            activeFilePath = path,
            openFiles = currentOpen,
            activeTab = WorkspaceTab.EDITOR
        )
    }

    fun closeFileTab(path: String) {
        val currentOpen = _uiState.value.openFiles.toMutableList()
        currentOpen.remove(path)
        val newActive = if (_uiState.value.activeFilePath == path) {
            currentOpen.lastOrNull()
        } else {
            _uiState.value.activeFilePath
        }
        _uiState.value = _uiState.value.copy(
            openFiles = currentOpen,
            activeFilePath = newActive
        )
    }

    fun saveActiveFileContent(newContent: String) {
        val pid = _uiState.value.selectedProjectId ?: return
        val path = _uiState.value.activeFilePath ?: return
        viewModelScope.launch {
            agentTools.writeFile(pid, path, newContent)
            _uiState.value = _uiState.value.copy(feedbackMessage = "Saved '$path'")
        }
    }

    fun createNewFile(path: String, content: String = "") {
        val pid = _uiState.value.selectedProjectId ?: return
        if (path.isBlank()) return
        viewModelScope.launch {
            agentTools.createFile(pid, path.trim(), content)
            selectFile(path.trim())
            _uiState.value = _uiState.value.copy(
                isCreatingFileDialog = false,
                feedbackMessage = "File '${path.trim()}' created."
            )
        }
    }

    fun deleteFile(path: String) {
        val pid = _uiState.value.selectedProjectId ?: return
        viewModelScope.launch {
            agentTools.deleteFile(pid, path)
            closeFileTab(path)
            _uiState.value = _uiState.value.copy(feedbackMessage = "Deleted '$path'")
        }
    }

    fun renameFile(oldPath: String, newPath: String) {
        val pid = _uiState.value.selectedProjectId ?: return
        if (newPath.isBlank() || oldPath == newPath) return
        viewModelScope.launch {
            val file = projectFileDao.getFileByPath(pid, oldPath)
            if (file != null) {
                projectFileDao.deleteFile(pid, oldPath)
                projectFileDao.insertFile(
                    file.copy(
                        id = UUID.randomUUID().toString(),
                        path = newPath.trim(),
                        name = newPath.trim().substringAfterLast('/'),
                        updatedAt = System.currentTimeMillis()
                    )
                )
                closeFileTab(oldPath)
                selectFile(newPath.trim())
                _uiState.value = _uiState.value.copy(feedbackMessage = "Renamed '$oldPath' to '$newPath'")
            }
        }
    }

    fun duplicateFile(path: String) {
        val pid = _uiState.value.selectedProjectId ?: return
        viewModelScope.launch {
            val file = projectFileDao.getFileByPath(pid, path)
            if (file != null) {
                val ext = if (path.contains('.')) "." + path.substringAfterLast('.') else ""
                val base = if (path.contains('.')) path.substringBeforeLast('.') else path
                val newPath = "${base}_copy$ext"
                agentTools.createFile(pid, newPath, file.content)
                selectFile(newPath)
                _uiState.value = _uiState.value.copy(feedbackMessage = "Duplicated as '$newPath'")
            }
        }
    }

    fun createFolder(folderPath: String) {
        val pid = _uiState.value.selectedProjectId ?: return
        if (folderPath.isBlank()) return
        val normalized = folderPath.trim().removeSuffix("/") + "/.gitkeep"
        viewModelScope.launch {
            agentTools.createFile(pid, normalized, "# Directory placeholder")
            _uiState.value = _uiState.value.copy(feedbackMessage = "Created directory '$folderPath'")
        }
    }

    fun createProject(
        name: String,
        description: String,
        template: String
    ) {
        if (name.isBlank()) return
        viewModelScope.launch {
            val projectId = "proj_" + UUID.randomUUID().toString().take(8)
            val entity = ProjectEntity(
                id = projectId,
                name = name.trim(),
                description = description.trim(),
                framework = template,
                templateType = "web",
                filesCount = 3,
                totalLines = 150,
                isStarred = false
            )
            projectDao.insertProject(entity)

            // Seed template files based on type
            seedProjectTemplateFiles(projectId, template, name)

            selectProject(projectId)
            _uiState.value = _uiState.value.copy(
                isCreatingProjectDialog = false,
                feedbackMessage = "Project '$name' created and ready in workspace."
            )
        }
    }

    fun deleteProject(projectId: String) {
        viewModelScope.launch {
            projectDao.deleteProject(projectId)
            val remaining = projectDao.getAllProjects().firstOrNull()
            val next = remaining?.firstOrNull()?.id ?: ""
            if (next.isNotBlank()) selectProject(next)
            _uiState.value = _uiState.value.copy(feedbackMessage = "Project deleted.")
        }
    }

    fun runAgentTask(userPrompt: String) {
        val pid = _uiState.value.selectedProjectId ?: return
        if (userPrompt.isBlank() || _uiState.value.isAgentRunning) return

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isAgentRunning = true,
                currentRunningStep = "Planning..."
            )

            val task = agentEngine.executeTask(
                projectId = pid,
                userPrompt = userPrompt.trim(),
                onStepUpdate = { step ->
                    _uiState.value = _uiState.value.copy(
                        currentRunningStep = "${step.stepType}: ${step.description}",
                        activeTaskId = step.taskId
                    )
                }
            )

            // Auto-open changed file in editor
            val modified = projectFileDao.getModifiedFiles(pid)
            val primaryChanged = modified.firstOrNull()?.path ?: _uiState.value.activeFilePath

            _uiState.value = _uiState.value.copy(
                isAgentRunning = false,
                currentRunningStep = "Ready",
                activeTaskId = task.id,
                activeFilePath = primaryChanged,
                activeTab = WorkspaceTab.EDITOR,
                feedbackMessage = "Agent task verified and completed."
            )
        }
    }

    fun executeTerminalCommand(cmd: String) {
        val pid = _uiState.value.selectedProjectId ?: return
        val trimmed = cmd.trim()
        if (trimmed.isBlank()) return

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isExecutingCommand = true,
                terminalInput = ""
            )

            val result = sandbox.executeCommand(pid, _uiState.value.activeTaskId, trimmed)
            val newOutput = buildString {
                append(_uiState.value.terminalOutput)
                appendLine()
                appendLine("$ $trimmed")
                if (result.stdout.isNotBlank()) appendLine(result.stdout)
                if (result.stderr.isNotBlank()) appendLine("[stderr] ${result.stderr}")
                append("$")
            }

            _uiState.value = _uiState.value.copy(
                isExecutingCommand = false,
                terminalOutput = newOutput,
                currentCpuUsage = result.cpuUsagePct,
                currentRamUsage = result.ramUsageMb
            )
        }
    }

    fun addAttachment(name: String, mimeType: String, data: String, isVision: Boolean = false) {
        val pid = _uiState.value.selectedProjectId ?: return
        viewModelScope.launch {
            val entity = AttachmentEntity(
                id = UUID.randomUUID().toString(),
                projectId = pid,
                name = name,
                mimeType = mimeType,
                sizeBytes = data.toByteArray().size.toLong(),
                dataOrUri = data,
                isVisionSupported = isVision
            )
            attachmentDao.insertAttachment(entity)
            _uiState.value = _uiState.value.copy(feedbackMessage = "Attachment '$name' uploaded.")
        }
    }

    fun deleteAttachment(id: String) {
        viewModelScope.launch {
            attachmentDao.deleteAttachment(id)
        }
    }

    fun exportProjectZip() {
        val pid = _uiState.value.selectedProjectId ?: return
        viewModelScope.launch {
            try {
                archiveManager.shareProjectZip(pid)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(feedbackMessage = "Export error: ${e.message}")
            }
        }
    }

    fun setWorkspaceTab(tab: WorkspaceTab) {
        _uiState.value = _uiState.value.copy(activeTab = tab)
    }

    fun openDiffModal(filePath: String?) {
        _uiState.value = _uiState.value.copy(
            isDiffModalOpen = true,
            diffTargetFilePath = filePath ?: _uiState.value.activeFilePath
        )
    }

    fun closeDiffModal() {
        _uiState.value = _uiState.value.copy(isDiffModalOpen = false)
    }

    fun toggleCreatingFileDialog(open: Boolean) {
        _uiState.value = _uiState.value.copy(isCreatingFileDialog = open)
    }

    fun toggleCreatingProjectDialog(open: Boolean) {
        _uiState.value = _uiState.value.copy(isCreatingProjectDialog = open)
    }

    fun clearFeedback() {
        _uiState.value = _uiState.value.copy(feedbackMessage = null)
    }

    private suspend fun seedProjectTemplateFiles(projectId: String, template: String, projectName: String) {
        when {
            template.contains("Python", ignoreCase = true) -> {
                val files = listOf(
                    ProjectFileEntity(
                        id = UUID.randomUUID().toString(),
                        projectId = projectId,
                        path = "main.py",
                        name = "main.py",
                        content = """from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="$projectName", version="1.0.0")

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = None

@app.get("/")
def read_root():
    return {"status": "online", "system": "$projectName", "engine": "OwnAI"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
""",
                        language = "python",
                        sizeBytes = 400
                    ),
                    ProjectFileEntity(
                        id = UUID.randomUUID().toString(),
                        projectId = projectId,
                        path = "requirements.txt",
                        name = "requirements.txt",
                        content = "fastapi==0.111.0\nuvicorn==0.30.1\npydantic==2.8.2\npytest==8.2.2",
                        language = "text",
                        sizeBytes = 80
                    ),
                    ProjectFileEntity(
                        id = UUID.randomUUID().toString(),
                        projectId = projectId,
                        path = "tests/test_main.py",
                        name = "test_main.py",
                        content = """from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"
""",
                        language = "python",
                        sizeBytes = 250
                    )
                )
                projectFileDao.insertFiles(files)
            }
            else -> {
                val files = listOf(
                    ProjectFileEntity(
                        id = UUID.randomUUID().toString(),
                        projectId = projectId,
                        path = "package.json",
                        name = "package.json",
                        content = """{
  "name": "${projectName.lowercase().replace(" ", "-")}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "jest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "14.2.5",
    "lucide-react": "^0.428.0"
  }
}""",
                        language = "json",
                        sizeBytes = 280
                    ),
                    ProjectFileEntity(
                        id = UUID.randomUUID().toString(),
                        projectId = projectId,
                        path = "app/page.tsx",
                        name = "page.tsx",
                        content = """import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen p-12 bg-slate-950 text-white">
      <h1 className="text-4xl font-bold">$projectName</h1>
      <p className="text-slate-400 mt-2">Crafted with OwnAI BYOK Coding Agent.</p>
    </main>
  );
}""",
                        language = "typescript",
                        sizeBytes = 260
                    )
                )
                projectFileDao.insertFiles(files)
            }
        }
    }
}
