package com.example.data.dao

import androidx.room.*
import com.example.data.entity.*
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    suspend fun getUserByEmail(email: String): UserEntity?

    @Query("SELECT * FROM users LIMIT 1")
    fun getActiveUser(): Flow<UserEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)

    @Query("DELETE FROM users")
    suspend fun clearUsers()
}

@Dao
interface ApiKeyDao {
    @Query("SELECT * FROM api_keys ORDER BY createdAt DESC")
    fun getAllApiKeys(): Flow<List<ApiKeyEntity>>

    @Query("SELECT * FROM api_keys WHERE id = :id")
    suspend fun getApiKeyById(id: String): ApiKeyEntity?

    @Query("SELECT * FROM api_keys WHERE provider = :provider AND status = 'ACTIVE'")
    suspend fun getActiveKeysForProvider(provider: String): List<ApiKeyEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertApiKey(apiKey: ApiKeyEntity)

    @Update
    suspend fun updateApiKey(apiKey: ApiKeyEntity)

    @Query("DELETE FROM api_keys WHERE id = :id")
    suspend fun deleteApiKey(id: String)
}

@Dao
interface AiRouteDao {
    @Query("SELECT * FROM ai_routes ORDER BY priority ASC")
    fun getAllRoutes(): Flow<List<AiRouteEntity>>

    @Query("SELECT * FROM ai_routes WHERE isEnabled = 1 ORDER BY priority ASC")
    suspend fun getEnabledRoutes(): List<AiRouteEntity>

    @Query("SELECT * FROM ai_routes WHERE id = :id")
    suspend fun getRouteById(id: String): AiRouteEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRoute(route: AiRouteEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRoutes(routes: List<AiRouteEntity>)

    @Update
    suspend fun updateRoute(route: AiRouteEntity)

    @Query("DELETE FROM ai_routes WHERE id = :id")
    suspend fun deleteRoute(id: String)

    @Query("DELETE FROM ai_routes")
    suspend fun clearRoutes()
}

@Dao
interface ProjectDao {
    @Query("SELECT * FROM projects ORDER BY updatedAt DESC")
    fun getAllProjects(): Flow<List<ProjectEntity>>

    @Query("SELECT * FROM projects WHERE id = :id")
    fun getProjectFlowById(id: String): Flow<ProjectEntity?>

    @Query("SELECT * FROM projects WHERE id = :id")
    suspend fun getProjectById(id: String): ProjectEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProject(project: ProjectEntity)

    @Update
    suspend fun updateProject(project: ProjectEntity)

    @Query("DELETE FROM projects WHERE id = :id")
    suspend fun deleteProject(id: String)
}

@Dao
interface ProjectFileDao {
    @Query("SELECT * FROM project_files WHERE projectId = :projectId ORDER BY isDirectory DESC, path ASC")
    fun getFilesForProject(projectId: String): Flow<List<ProjectFileEntity>>

    @Query("SELECT * FROM project_files WHERE projectId = :projectId AND isDirectory = 0")
    suspend fun getAllSourceFiles(projectId: String): List<ProjectFileEntity>

    @Query("SELECT * FROM project_files WHERE projectId = :projectId AND path = :path LIMIT 1")
    suspend fun getFileByPath(projectId: String, path: String): ProjectFileEntity?

    @Query("SELECT * FROM project_files WHERE projectId = :projectId AND (path LIKE '%' || :query || '%' OR content LIKE '%' || :query || '%')")
    suspend fun searchFiles(projectId: String, query: String): List<ProjectFileEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFile(file: ProjectFileEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFiles(files: List<ProjectFileEntity>)

    @Update
    suspend fun updateFile(file: ProjectFileEntity)

    @Query("DELETE FROM project_files WHERE projectId = :projectId AND path = :path")
    suspend fun deleteFile(projectId: String, path: String)

    @Query("DELETE FROM project_files WHERE projectId = :projectId AND (path = :dirPath OR path LIKE :dirPath || '/%')")
    suspend fun deleteDirectory(projectId: String, dirPath: String)

    @Query("SELECT * FROM project_files WHERE projectId = :projectId AND gitStatus != 'COMMITTED'")
    suspend fun getModifiedFiles(projectId: String): List<ProjectFileEntity>
}

@Dao
interface AttachmentDao {
    @Query("SELECT * FROM attachments WHERE projectId = :projectId ORDER BY createdAt DESC")
    fun getAttachmentsForProject(projectId: String): Flow<List<AttachmentEntity>>

    @Query("SELECT * FROM attachments WHERE id = :id")
    suspend fun getAttachmentById(id: String): AttachmentEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAttachment(attachment: AttachmentEntity)

    @Query("DELETE FROM attachments WHERE id = :id")
    suspend fun deleteAttachment(id: String)
}

@Dao
interface AgentTaskDao {
    @Query("SELECT * FROM agent_tasks WHERE projectId = :projectId ORDER BY startedAt DESC")
    fun getTasksForProject(projectId: String): Flow<List<AgentTaskEntity>>

    @Query("SELECT * FROM agent_tasks WHERE id = :id")
    fun getTaskFlowById(id: String): Flow<AgentTaskEntity?>

    @Query("SELECT * FROM agent_tasks WHERE id = :id")
    suspend fun getTaskById(id: String): AgentTaskEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: AgentTaskEntity)

    @Update
    suspend fun updateTask(task: AgentTaskEntity)

    @Query("SELECT * FROM agent_steps WHERE taskId = :taskId ORDER BY stepOrder ASC")
    fun getStepsForTask(taskId: String): Flow<List<AgentStepEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStep(step: AgentStepEntity)

    @Query("SELECT * FROM conversation_messages WHERE projectId = :projectId ORDER BY timestamp ASC")
    fun getMessagesForProject(projectId: String): Flow<List<ConversationMessageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ConversationMessageEntity)
}

@Dao
interface ExecutionLogDao {
    @Query("SELECT * FROM execution_logs WHERE projectId = :projectId ORDER BY timestamp DESC")
    fun getLogsForProject(projectId: String): Flow<List<ExecutionLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLog(log: ExecutionLogEntity)

    @Query("DELETE FROM execution_logs WHERE projectId = :projectId")
    suspend fun clearLogsForProject(projectId: String)
}
