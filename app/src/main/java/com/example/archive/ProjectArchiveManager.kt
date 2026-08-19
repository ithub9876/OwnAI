package com.example.archive

import android.content.Context
import android.content.Intent
import androidx.core.content.FileProvider
import com.example.data.dao.ProjectDao
import com.example.data.dao.ProjectFileDao
import com.example.data.entity.ProjectFileEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class ProjectArchiveManager(
    private val context: Context,
    private val projectDao: ProjectDao,
    private val projectFileDao: ProjectFileDao
) {
    suspend fun exportProjectToZip(projectId: String): File = withContext(Dispatchers.IO) {
        val project = projectDao.getProjectById(projectId)
            ?: throw IllegalArgumentException("Project not found")
        val files = projectFileDao.getAllSourceFiles(projectId)

        val cleanName = project.name.replace("[^a-zA-Z0-9_-]".toRegex(), "_")
        val exportDir = File(context.cacheDir, "exports").apply { mkdirs() }
        val zipFile = File(exportDir, "$cleanName.zip")

        FileOutputStream(zipFile).use { fos ->
            ZipOutputStream(fos).use { zos ->
                for (file in files) {
                    val entry = ZipEntry(file.path)
                    zos.putNextEntry(entry)
                    zos.write(file.content.toByteArray(Charsets.UTF_8))
                    zos.closeEntry()
                }
            }
        }
        zipFile
    }

    suspend fun shareProjectZip(projectId: String) = withContext(Dispatchers.IO) {
        val zipFile = exportProjectToZip(projectId)
        val uri = try {
            FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", zipFile)
        } catch (e: Exception) {
            android.net.Uri.fromFile(zipFile)
        }

        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "application/zip"
            putExtra(Intent.EXTRA_STREAM, uri)
            putExtra(Intent.EXTRA_SUBJECT, "OwnAI Project Export: ${zipFile.name}")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(Intent.createChooser(shareIntent, "Export Project ZIP").apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        })
    }
}
