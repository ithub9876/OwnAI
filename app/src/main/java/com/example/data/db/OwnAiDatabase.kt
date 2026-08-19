package com.example.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.data.dao.*
import com.example.data.entity.*

@Database(
    entities = [
        UserEntity::class,
        ApiKeyEntity::class,
        AiRouteEntity::class,
        ProjectEntity::class,
        ProjectFileEntity::class,
        AttachmentEntity::class,
        AgentTaskEntity::class,
        AgentStepEntity::class,
        ConversationMessageEntity::class,
        ExecutionLogEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class OwnAiDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun apiKeyDao(): ApiKeyDao
    abstract fun aiRouteDao(): AiRouteDao
    abstract fun projectDao(): ProjectDao
    abstract fun projectFileDao(): ProjectFileDao
    abstract fun attachmentDao(): AttachmentDao
    abstract fun agentTaskDao(): AgentTaskDao
    abstract fun executionLogDao(): ExecutionLogDao

    companion object {
        @Volatile
        private var INSTANCE: OwnAiDatabase? = null

        fun getInstance(context: Context): OwnAiDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    OwnAiDatabase::class.java,
                    "ownai_database.db"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
