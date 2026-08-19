package com.example.agent

import com.example.data.dao.AttachmentDao
import com.example.data.dao.ProjectDao
import com.example.data.dao.ProjectFileDao
import com.example.data.entity.GitFileStatus
import com.example.data.entity.ProjectFileEntity
import com.example.sandbox.SandboxEnvironment
import com.example.sandbox.SandboxExecutionResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.UUID

data class ToolResult(
    val toolName: String,
    val isSuccess: Boolean,
    val output: String,
    val affectedFiles: List<String> = emptyList(),
    val linesAdded: Int = 0,
    val linesRemoved: Int = 0
)

class AgentTools(
    private val projectFileDao: ProjectFileDao,
    private val projectDao: ProjectDao,
    private val attachmentDao: AttachmentDao,
    private val sandbox: SandboxEnvironment
) {
    suspend fun listFiles(projectId: String, path: String = ""): ToolResult = withContext(Dispatchers.IO) {
        val files = projectFileDao.getAllSourceFiles(projectId)
        val filtered = if (path.isBlank()) files else files.filter { it.path.startsWith(path) }
        val output = filtered.joinToString("\n") {
            "[${it.language.uppercase()}] ${it.path} (${it.sizeBytes} bytes, ${it.gitStatus})"
        }
        ToolResult(
            toolName = "list_files",
            isSuccess = true,
            output = if (output.isBlank()) "No files found in path '$path'" else output
        )
    }

    suspend fun readFile(projectId: String, path: String): ToolResult = withContext(Dispatchers.IO) {
        val file = projectFileDao.getFileByPath(projectId, path)
            ?: return@withContext ToolResult("read_file", false, "Error: File not found at path '$path'")

        ToolResult(
            toolName = "read_file",
            isSuccess = true,
            output = file.content,
            affectedFiles = listOf(path)
        )
    }

    suspend fun searchFiles(projectId: String, query: String): ToolResult = withContext(Dispatchers.IO) {
        val results = projectFileDao.searchFiles(projectId, query)
        val output = buildString {
            appendLine("Found ${results.size} matches for '$query':")
            for (f in results) {
                appendLine("File: ${f.path}")
                val matchingLines = f.content.lines().mapIndexedNotNull { idx, line ->
                    if (line.contains(query, ignoreCase = true)) "  Line ${idx + 1}: ${line.trim()}" else null
                }.take(5)
                matchingLines.forEach { appendLine(it) }
            }
        }
        ToolResult("search_files", true, output)
    }

    suspend fun createFile(projectId: String, path: String, content: String): ToolResult = withContext(Dispatchers.IO) {
        val existing = projectFileDao.getFileByPath(projectId, path)
        val name = path.substringAfterLast("/")
        val parent = if (path.contains("/")) path.substringBeforeLast("/") else ""
        val lang = detectLanguage(path)
        val lines = content.lines().size

        val entity = ProjectFileEntity(
            id = existing?.id ?: UUID.randomUUID().toString(),
            projectId = projectId,
            path = path,
            name = name,
            content = content,
            language = lang,
            isDirectory = false,
            parentPath = parent,
            sizeBytes = content.toByteArray().size.toLong(),
            originalContent = existing?.originalContent ?: "",
            gitStatus = if (existing == null) GitFileStatus.UNTRACKED else GitFileStatus.MODIFIED,
            updatedAt = System.currentTimeMillis()
        )
        projectFileDao.insertFile(entity)
        updateProjectStats(projectId)

        ToolResult(
            toolName = "create_file",
            isSuccess = true,
            output = "Created file '$path' ($lines lines, $lang).",
            affectedFiles = listOf(path),
            linesAdded = lines,
            linesRemoved = 0
        )
    }

    suspend fun editFile(
        projectId: String,
        path: String,
        targetContent: String,
        replacementContent: String
    ): ToolResult = withContext(Dispatchers.IO) {
        val existing = projectFileDao.getFileByPath(projectId, path)
            ?: return@withContext ToolResult("edit_file", false, "Error: File not found at path '$path'")

        val original = existing.content
        if (!original.contains(targetContent)) {
            return@withContext ToolResult("edit_file", false, "Target content snippet not found in '$path'.")
        }

        val newContent = original.replace(targetContent, replacementContent)
        val addedLines = replacementContent.lines().size
        val removedLines = targetContent.lines().size

        val updated = existing.copy(
            content = newContent,
            sizeBytes = newContent.toByteArray().size.toLong(),
            originalContent = if (existing.originalContent.isEmpty()) original else existing.originalContent,
            gitStatus = GitFileStatus.MODIFIED,
            updatedAt = System.currentTimeMillis()
        )
        projectFileDao.updateFile(updated)
        updateProjectStats(projectId)

        ToolResult(
            toolName = "edit_file",
            isSuccess = true,
            output = "Edited '$path' (+$addedLines, -$removedLines lines).",
            affectedFiles = listOf(path),
            linesAdded = addedLines,
            linesRemoved = removedLines
        )
    }

    suspend fun writeFile(projectId: String, path: String, fullContent: String): ToolResult = withContext(Dispatchers.IO) {
        val existing = projectFileDao.getFileByPath(projectId, path)
        val lang = detectLanguage(path)
        val name = path.substringAfterLast("/")
        val parent = if (path.contains("/")) path.substringBeforeLast("/") else ""
        val newLines = fullContent.lines().size
        val oldLines = existing?.content?.lines()?.size ?: 0

        val entity = ProjectFileEntity(
            id = existing?.id ?: UUID.randomUUID().toString(),
            projectId = projectId,
            path = path,
            name = name,
            content = fullContent,
            language = lang,
            isDirectory = false,
            parentPath = parent,
            sizeBytes = fullContent.toByteArray().size.toLong(),
            originalContent = existing?.originalContent ?: (existing?.content ?: ""),
            gitStatus = if (existing == null) GitFileStatus.UNTRACKED else GitFileStatus.MODIFIED,
            updatedAt = System.currentTimeMillis()
        )
        projectFileDao.insertFile(entity)
        updateProjectStats(projectId)

        ToolResult(
            toolName = "write_file",
            isSuccess = true,
            output = "Wrote '$path' ($newLines lines).",
            affectedFiles = listOf(path),
            linesAdded = if (newLines > oldLines) newLines - oldLines else 0,
            linesRemoved = if (oldLines > newLines) oldLines - newLines else 0
        )
    }

    suspend fun deleteFile(projectId: String, path: String): ToolResult = withContext(Dispatchers.IO) {
        val existing = projectFileDao.getFileByPath(projectId, path)
            ?: return@withContext ToolResult("delete_file", false, "Error: File not found at '$path'")

        projectFileDao.deleteFile(projectId, path)
        updateProjectStats(projectId)
        ToolResult(
            toolName = "delete_file",
            isSuccess = true,
            output = "Deleted file '$path'.",
            affectedFiles = listOf(path),
            linesRemoved = existing.content.lines().size
        )
    }

    suspend fun inspectProject(projectId: String): ToolResult = withContext(Dispatchers.IO) {
        val project = projectDao.getProjectById(projectId)
            ?: return@withContext ToolResult("inspect_project", false, "Project not found")
        val files = projectFileDao.getAllSourceFiles(projectId)
        val totalLines = files.sumOf { it.content.lines().size }
        val frameworks = detectFramework(files)

        val output = buildString {
            appendLine("Project: ${project.name}")
            appendLine("Description: ${project.description}")
            appendLine("Framework Detected: $frameworks")
            appendLine("Files Count: ${files.size}")
            appendLine("Total Lines of Code: $totalLines")
            appendLine("Entry Points:")
            val entries = files.filter { it.path.contains("main") || it.path.contains("App") || it.path.contains("index") || it.path.contains("page") }
            entries.forEach { appendLine(" - ${it.path}") }
        }

        ToolResult("inspect_project", true, output)
    }

    suspend fun runBuild(projectId: String, taskId: String?): ToolResult {
        val result = sandbox.executeCommand(projectId, taskId, "npm run build")
        return ToolResult(
            toolName = "run_build",
            isSuccess = result.isSuccess,
            output = if (result.isSuccess) result.stdout else "${result.stdout}\n${result.stderr}"
        )
    }

    suspend fun runTests(projectId: String, taskId: String?): ToolResult {
        val result = sandbox.executeCommand(projectId, taskId, "npm test")
        return ToolResult(
            toolName = "run_tests",
            isSuccess = result.isSuccess,
            output = if (result.isSuccess) result.stdout else "${result.stdout}\n${result.stderr}"
        )
    }

    suspend fun runCommand(projectId: String, taskId: String?, command: String): ToolResult {
        val result = sandbox.executeCommand(projectId, taskId, command)
        return ToolResult(
            toolName = "run_command",
            isSuccess = result.isSuccess,
            output = if (result.isSuccess) result.stdout else "${result.stdout}\n${result.stderr}"
        )
    }

    suspend fun viewChangedFiles(projectId: String): ToolResult = withContext(Dispatchers.IO) {
        val modified = projectFileDao.getModifiedFiles(projectId)
        val output = buildString {
            appendLine("${modified.size} files changed:")
            for (f in modified) {
                val curLines = f.content.lines().size
                val origLines = f.originalContent.lines().size
                val diff = curLines - origLines
                appendLine(" • ${f.path} [${f.gitStatus}] (${if (diff >= 0) "+$diff" else "$diff"} lines)")
            }
        }
        ToolResult("view_changed_files", true, output, affectedFiles = modified.map { it.path })
    }

    suspend fun readAttachment(attachmentId: String): ToolResult = withContext(Dispatchers.IO) {
        val att = attachmentDao.getAttachmentById(attachmentId)
            ?: return@withContext ToolResult("read_attachment", false, "Attachment not found")
        ToolResult(
            toolName = "read_attachment",
            isSuccess = true,
            output = "Attachment '${att.name}' (${att.mimeType}, ${att.sizeBytes} bytes):\n${att.dataOrUri}"
        )
    }

    private fun detectFramework(files: List<ProjectFileEntity>): String {
        val paths = files.map { it.path }
        return when {
            paths.any { it.contains("app/page.tsx") || it.contains("next.config") } -> "Next.js (App Router)"
            paths.any { it.contains("src/App.tsx") || it.contains("src/App.jsx") } -> "React + Vite"
            paths.any { it.contains("MainActivity.kt") || it.contains("build.gradle") } -> "Android (Kotlin Compose)"
            paths.any { it.contains("main.py") || it.contains("app/main.py") } -> "Python (FastAPI)"
            paths.any { it.contains("src/App.vue") } -> "Vue 3"
            else -> "Modern Web (HTML5/ES6/TypeScript)"
        }
    }

    private fun detectLanguage(path: String): String {
        return when {
            path.endsWith(".ts") || path.endsWith(".tsx") -> "typescript"
            path.endsWith(".js") || path.endsWith(".jsx") || path.endsWith(".mjs") -> "javascript"
            path.endsWith(".kt") || path.endsWith(".kts") -> "kotlin"
            path.endsWith(".py") -> "python"
            path.endsWith(".html") || path.endsWith(".htm") -> "html"
            path.endsWith(".css") || path.endsWith(".scss") -> "css"
            path.endsWith(".json") -> "json"
            path.endsWith(".md") -> "markdown"
            else -> "text"
        }
    }

    private suspend fun updateProjectStats(projectId: String) {
        val files = projectFileDao.getAllSourceFiles(projectId)
        val totalLines = files.sumOf { it.content.lines().size }
        val project = projectDao.getProjectById(projectId)
        if (project != null) {
            projectDao.updateProject(
                project.copy(
                    filesCount = files.size,
                    totalLines = totalLines,
                    updatedAt = System.currentTimeMillis()
                )
            )
        }
    }
}
