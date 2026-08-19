package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Compare
import androidx.compose.material.icons.filled.Description
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.entity.ProjectFileEntity
import com.example.ui.theme.*

data class DiffLine(
    val type: DiffType,
    val oldLineNum: Int?,
    val newLineNum: Int?,
    val text: String
)

enum class DiffType {
    EQUAL,
    ADDED,
    DELETED,
    HEADER
}

@Composable
fun VisualDiffView(
    file: ProjectFileEntity?,
    allModifiedFiles: List<ProjectFileEntity>,
    onSelectDiffFile: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    if (file == null) {
        Box(modifier = modifier.fillMaxSize().background(Slate950), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Compare, contentDescription = null, modifier = Modifier.size(40.dp), tint = Slate700)
                Spacer(Modifier.height(8.dp))
                Text("No modified files to diff", style = MaterialTheme.typography.bodyMedium, color = Slate500)
            }
        }
        return
    }

    val originalLines = if (file.originalContent.isEmpty()) emptyList() else file.originalContent.lines()
    val currentLines = file.content.lines()
    val diffLines = computeUnifiedDiff(originalLines, currentLines)

    val addedCount = diffLines.count { it.type == DiffType.ADDED }
    val deletedCount = diffLines.count { it.type == DiffType.DELETED }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Slate950)
    ) {
        // Top Diff Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Slate900)
                .border(1.dp, Slate850)
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(Icons.Default.Description, contentDescription = null, modifier = Modifier.size(16.dp), tint = ElectricBlue)
                Text(
                    text = file.path,
                    style = MaterialTheme.typography.titleSmall.copy(fontFamily = CodeFontFamily),
                    color = Slate100
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                IdeBadge(
                    text = "+$addedCount",
                    backgroundColor = EmeraldDark.copy(alpha = 0.6f),
                    textColor = EmeraldLight,
                    borderColor = EmeraldGreen.copy(alpha = 0.5f)
                )
                IdeBadge(
                    text = "-$deletedCount",
                    backgroundColor = CrimsonDark.copy(alpha = 0.6f),
                    textColor = CrimsonLight,
                    borderColor = CrimsonError.copy(alpha = 0.5f)
                )
            }
        }

        // File switcher if multiple modified files
        if (allModifiedFiles.size > 1) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Slate950)
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                for (mf in allModifiedFiles) {
                    val isSelected = mf.path == file.path
                    Surface(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .border(1.dp, if (isSelected) ElectricBlue else Slate800, RoundedCornerShape(4.dp)),
                        color = if (isSelected) Slate850 else Slate900,
                        onClick = { onSelectDiffFile(mf.path) }
                    ) {
                        Text(
                            text = mf.name,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                            color = if (isSelected) Slate100 else Slate400
                        )
                    }
                }
            }
        }

        // Diff lines list
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(vertical = 4.dp)
        ) {
            items(diffLines) { line ->
                val bg = when (line.type) {
                    DiffType.ADDED -> EmeraldDark.copy(alpha = 0.25f)
                    DiffType.DELETED -> CrimsonDark.copy(alpha = 0.25f)
                    DiffType.HEADER -> Slate800.copy(alpha = 0.5f)
                    DiffType.EQUAL -> Color.Transparent
                }

                val textCol = when (line.type) {
                    DiffType.ADDED -> EmeraldLight
                    DiffType.DELETED -> CrimsonLight
                    DiffType.HEADER -> CyanAccent
                    DiffType.EQUAL -> Slate300
                }

                val prefix = when (line.type) {
                    DiffType.ADDED -> "+"
                    DiffType.DELETED -> "-"
                    DiffType.HEADER -> "@@"
                    DiffType.EQUAL -> " "
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(bg)
                        .padding(horizontal = 8.dp, vertical = 1.5.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = (line.oldLineNum?.toString() ?: "").padStart(3, ' '),
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                        color = Slate600,
                        modifier = Modifier.width(28.dp)
                    )
                    Text(
                        text = (line.newLineNum?.toString() ?: "").padStart(3, ' '),
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily, fontSize = 10.sp),
                        color = Slate600,
                        modifier = Modifier.width(28.dp)
                    )
                    Text(
                        text = prefix,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontFamily = CodeFontFamily,
                            fontWeight = FontWeight.Bold
                        ),
                        color = textCol,
                        modifier = Modifier.width(16.dp)
                    )
                    Text(
                        text = line.text,
                        style = MaterialTheme.typography.labelSmall.copy(fontFamily = CodeFontFamily),
                        color = textCol
                    )
                }
            }
        }
    }
}

private fun computeUnifiedDiff(original: List<String>, current: List<String>): List<DiffLine> {
    val result = mutableListOf<DiffLine>()

    if (original.isEmpty()) {
        result.add(DiffLine(DiffType.HEADER, null, null, "@@ -0,0 +1,${current.size} @@ (New File)"))
        current.forEachIndexed { idx, line ->
            result.add(DiffLine(DiffType.ADDED, null, idx + 1, line))
        }
        return result
    }

    result.add(DiffLine(DiffType.HEADER, null, null, "@@ -1,${original.size} +1,${current.size} @@"))

    var oldIdx = 0
    var newIdx = 0

    while (oldIdx < original.size || newIdx < current.size) {
        if (oldIdx < original.size && newIdx < current.size && original[oldIdx] == current[newIdx]) {
            result.add(DiffLine(DiffType.EQUAL, oldIdx + 1, newIdx + 1, original[oldIdx]))
            oldIdx++
            newIdx++
        } else if (oldIdx < original.size && (newIdx >= current.size || !current.contains(original[oldIdx]))) {
            result.add(DiffLine(DiffType.DELETED, oldIdx + 1, null, original[oldIdx]))
            oldIdx++
        } else if (newIdx < current.size) {
            result.add(DiffLine(DiffType.ADDED, null, newIdx + 1, current[newIdx]))
            newIdx++
        } else {
            oldIdx++
            newIdx++
        }
    }

    return result
}
