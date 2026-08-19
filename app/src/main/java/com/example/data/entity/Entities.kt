package com.example.data.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val email: String,
    val displayName: String,
    val passwordHash: String,
    val avatarUrl: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

enum class ApiKeyStatus {
    ACTIVE,
    RATE_LIMITED,
    INVALID,
    QUOTA_EXCEEDED
}

@Entity(tableName = "api_keys")
data class ApiKeyEntity(
    @PrimaryKey val id: String,
    val name: String,
    val provider: String, // "anthropic", "openai", "gemini", "nvidia", "groq", "openrouter", "custom"
    val maskedKey: String,
    val encryptedKey: String,
    val baseUrl: String = "",
    val status: ApiKeyStatus = ApiKeyStatus.ACTIVE,
    val rateLimitUntil: Long = 0L,
    val errorDetails: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val lastUsedAt: Long = 0L
)

@Entity(
    tableName = "ai_routes",
    foreignKeys = [
        ForeignKey(
            entity = ApiKeyEntity::class,
            parentColumns = ["id"],
            childColumns = ["apiKeyId"],
            onDelete = ForeignKey.SET_NULL
        )
    ],
    indices = [Index("apiKeyId")]
)
data class AiRouteEntity(
    @PrimaryKey val id: String,
    val priority: Int, // 1 = highest, 2 = second, etc.
    val name: String,
    val provider: String,
    val modelId: String,
    val apiKeyId: String?,
    val temperature: Float = 0.2f,
    val maxTokens: Int = 4096,
    val supportsVision: Boolean = true,
    val supportsTools: Boolean = true,
    val isEnabled: Boolean = true,
    val latencyMs: Long = 0L,
    val lastTestedAt: Long = 0L,
    val lastError: String = ""
)

@Entity(tableName = "projects")
data class ProjectEntity(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val framework: String, // "Next.js", "React", "Android", "Python FastAPI", "Vue", "Node.js", "HTML/CSS/JS"
    val templateType: String = "web",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val isStarred: Boolean = false,
    val filesCount: Int = 0,
    val totalLines: Int = 0
)

enum class GitFileStatus {
    UNTRACKED,
    MODIFIED,
    COMMITTED,
    DELETED
}

@Entity(
    tableName = "project_files",
    foreignKeys = [
        ForeignKey(
            entity = ProjectEntity::class,
            parentColumns = ["id"],
            childColumns = ["projectId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("projectId"), Index(value = ["projectId", "path"], unique = true)]
)
data class ProjectFileEntity(
    @PrimaryKey val id: String,
    val projectId: String,
    val path: String, // e.g. "src/components/Header.tsx"
    val name: String, // e.g. "Header.tsx"
    val content: String,
    val language: String, // "typescript", "javascript", "kotlin", "python", "html", "css", "json", "markdown"
    val isDirectory: Boolean = false,
    val parentPath: String = "", // e.g. "src/components"
    val sizeBytes: Long = 0L,
    val originalContent: String = "", // For diff generation
    val gitStatus: GitFileStatus = GitFileStatus.COMMITTED,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
) {
    val linesCount: Int
        get() = if (content.isEmpty()) 0 else content.lines().size
}

@Entity(
    tableName = "attachments",
    foreignKeys = [
        ForeignKey(
            entity = ProjectEntity::class,
            parentColumns = ["id"],
            childColumns = ["projectId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("projectId")]
)
data class AttachmentEntity(
    @PrimaryKey val id: String,
    val projectId: String,
    val name: String,
    val mimeType: String,
    val sizeBytes: Long,
    val dataOrUri: String,
    val isVisionSupported: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

enum class TaskStatus {
    PLANNING,
    INSPECTING,
    EXECUTING,
    TESTING,
    SELF_HEALING,
    COMPLETED,
    FAILED
}

@Entity(
    tableName = "agent_tasks",
    foreignKeys = [
        ForeignKey(
            entity = ProjectEntity::class,
            parentColumns = ["id"],
            childColumns = ["projectId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("projectId")]
)
data class AgentTaskEntity(
    @PrimaryKey val id: String,
    val projectId: String,
    val prompt: String,
    val status: TaskStatus = TaskStatus.PLANNING,
    val modelUsed: String = "",
    val routeUsed: String = "",
    val tokensUsed: Int = 0,
    val filesChangedCount: Int = 0,
    val linesAdded: Int = 0,
    val linesRemoved: Int = 0,
    val startedAt: Long = System.currentTimeMillis(),
    val completedAt: Long = 0L,
    val summary: String = "",
    val error: String = ""
)

@Entity(
    tableName = "agent_steps",
    foreignKeys = [
        ForeignKey(
            entity = AgentTaskEntity::class,
            parentColumns = ["id"],
            childColumns = ["taskId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("taskId")]
)
data class AgentStepEntity(
    @PrimaryKey val id: String,
    val taskId: String,
    val stepOrder: Int,
    val stepType: String, // "PLAN", "INSPECT", "READ_FILE", "EDIT_FILE", "CREATE_FILE", "DELETE_FILE", "RUN_COMMAND", "RUN_TEST", "RUN_BUILD", "DIAGNOSTICS", "AUTO_FIX", "VERIFIED"
    val description: String,
    val toolName: String = "",
    val toolArgs: String = "",
    val toolResult: String = "",
    val isSuccess: Boolean = true,
    val timestamp: Long = System.currentTimeMillis()
)

enum class MessageSender {
    USER,
    AGENT,
    SYSTEM,
    TOOL
}

@Entity(
    tableName = "conversation_messages",
    foreignKeys = [
        ForeignKey(
            entity = ProjectEntity::class,
            parentColumns = ["id"],
            childColumns = ["projectId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("projectId")]
)
data class ConversationMessageEntity(
    @PrimaryKey val id: String,
    val projectId: String,
    val taskId: String? = null,
    val sender: MessageSender,
    val content: String,
    val toolCallsJson: String = "",
    val diffSummary: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "execution_logs",
    foreignKeys = [
        ForeignKey(
            entity = ProjectEntity::class,
            parentColumns = ["id"],
            childColumns = ["projectId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("projectId")]
)
data class ExecutionLogEntity(
    @PrimaryKey val id: String,
    val projectId: String,
    val taskId: String? = null,
    val command: String,
    val stdout: String,
    val stderr: String,
    val exitCode: Int,
    val durationMs: Long,
    val cpuUsagePct: Float,
    val ramUsageMb: Float,
    val timestamp: Long = System.currentTimeMillis()
)
