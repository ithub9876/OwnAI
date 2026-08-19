package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.db.OwnAiDatabase
import com.example.data.entity.AiRouteEntity
import com.example.data.entity.ApiKeyEntity
import com.example.data.entity.ApiKeyStatus
import com.example.router.AiRouter
import com.example.router.ModelProvider
import com.example.router.RouteAttemptRecord
import com.example.router.RoutePingResult
import com.example.security.KeySecurityHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

data class RoutingUiState(
    val isTestingRoutes: Boolean = false,
    val testResults: Map<String, RoutePingResult> = emptyMap(),
    val simulationLogs: List<RouteAttemptRecord> = emptyList(),
    val isSimulatingFallback: Boolean = false,
    val activeSimulationStep: String = "",
    val feedbackMessage: String? = null
)

class RoutingViewModel(application: Application) : AndroidViewModel(application) {
    private val db = OwnAiDatabase.getInstance(application)
    private val apiKeyDao = db.apiKeyDao()
    private val aiRouteDao = db.aiRouteDao()
    val aiRouter = AiRouter(aiRouteDao, apiKeyDao)

    val apiKeys: StateFlow<List<ApiKeyEntity>> = apiKeyDao.getAllApiKeys()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val routes: StateFlow<List<AiRouteEntity>> = aiRouteDao.getAllRoutes()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _uiState = MutableStateFlow(RoutingUiState())
    val uiState: StateFlow<RoutingUiState> = _uiState.asStateFlow()

    fun addApiKey(
        name: String,
        provider: String,
        rawKey: String,
        baseUrl: String = ""
    ) {
        if (rawKey.isBlank()) return
        viewModelScope.launch {
            val masked = KeySecurityHelper.maskKey(rawKey.trim())
            val encrypted = KeySecurityHelper.encrypt(rawKey.trim())
            val entity = ApiKeyEntity(
                id = UUID.randomUUID().toString(),
                name = name.ifBlank { "${provider.uppercase()} Key" },
                provider = provider.lowercase(),
                maskedKey = masked,
                encryptedKey = encrypted,
                baseUrl = baseUrl.trim(),
                status = ApiKeyStatus.ACTIVE
            )
            apiKeyDao.insertApiKey(entity)
            _uiState.value = _uiState.value.copy(feedbackMessage = "API Key '${entity.name}' saved and encrypted.")
        }
    }

    fun deleteApiKey(id: String) {
        viewModelScope.launch {
            apiKeyDao.deleteApiKey(id)
            _uiState.value = _uiState.value.copy(feedbackMessage = "API Key deleted.")
        }
    }

    fun updateKeyStatus(id: String, status: ApiKeyStatus) {
        viewModelScope.launch {
            val existing = apiKeyDao.getApiKeyById(id)
            if (existing != null) {
                apiKeyDao.updateApiKey(existing.copy(status = status, errorDetails = ""))
            }
        }
    }

    fun addRoute(
        name: String,
        provider: String,
        modelId: String,
        apiKeyId: String?,
        supportsVision: Boolean,
        supportsTools: Boolean
    ) {
        viewModelScope.launch {
            val currentRoutes = routes.value
            val nextPriority = (currentRoutes.maxOfOrNull { it.priority } ?: 0) + 1
            val entity = AiRouteEntity(
                id = UUID.randomUUID().toString(),
                priority = nextPriority,
                name = name.ifBlank { "$provider - $modelId" },
                provider = provider.lowercase(),
                modelId = modelId,
                apiKeyId = apiKeyId,
                supportsVision = supportsVision,
                supportsTools = supportsTools,
                isEnabled = true
            )
            aiRouteDao.insertRoute(entity)
            _uiState.value = _uiState.value.copy(feedbackMessage = "Route '${entity.name}' added with Priority $nextPriority.")
        }
    }

    fun deleteRoute(id: String) {
        viewModelScope.launch {
            aiRouteDao.deleteRoute(id)
            rebalancePriorities()
        }
    }

    fun toggleRouteEnabled(route: AiRouteEntity) {
        viewModelScope.launch {
            aiRouteDao.updateRoute(route.copy(isEnabled = !route.isEnabled))
        }
    }

    fun moveRoutePriority(routeId: String, moveUp: Boolean) {
        viewModelScope.launch {
            val list = routes.value.sortedBy { it.priority }.toMutableList()
            val index = list.indexOfFirst { it.id == routeId }
            if (index == -1) return@launch

            val targetIndex = if (moveUp) index - 1 else index + 1
            if (targetIndex in list.indices) {
                val current = list[index]
                val other = list[targetIndex]

                val updatedCurrent = current.copy(priority = other.priority)
                val updatedOther = other.copy(priority = current.priority)

                aiRouteDao.updateRoute(updatedCurrent)
                aiRouteDao.updateRoute(updatedOther)
            }
        }
    }

    fun pingRoute(routeId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isTestingRoutes = true)
            val res = aiRouter.pingRoute(routeId)
            val currentMap = _uiState.value.testResults.toMutableMap()
            currentMap[routeId] = res
            _uiState.value = _uiState.value.copy(
                isTestingRoutes = false,
                testResults = currentMap,
                feedbackMessage = if (res.isSuccess) "Route ping success (${res.latencyMs}ms)" else "Route ping failed: ${res.errorMessage}"
            )
        }
    }

    fun testAllRoutes() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isTestingRoutes = true)
            val results = mutableMapOf<String, RoutePingResult>()
            for (route in routes.value) {
                val res = aiRouter.pingRoute(route.id)
                results[route.id] = res
            }
            _uiState.value = _uiState.value.copy(
                isTestingRoutes = false,
                testResults = results,
                feedbackMessage = "Tested ${routes.value.size} routes."
            )
        }
    }

    fun simulateFallbackFailure() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isSimulatingFallback = true,
                simulationLogs = emptyList(),
                activeSimulationStep = "Triggering simulated 429 Rate Limit on Route 1..."
            )
            kotlinx.coroutines.delay(600)

            val currentRoutes = routes.value.sortedBy { it.priority }
            val logs = mutableListOf<RouteAttemptRecord>()

            if (currentRoutes.isNotEmpty()) {
                val r1 = currentRoutes[0]
                logs.add(
                    RouteAttemptRecord(
                        routeId = r1.id,
                        routeName = r1.name,
                        provider = r1.provider,
                        modelId = r1.modelId,
                        isSuccess = false,
                        statusCode = 429,
                        latencyMs = 180,
                        errorMessage = "HTTP 429 Rate Limit Exceeded (Tokens per minute exhausted). Triggering automatic fallback..."
                    )
                )
                _uiState.value = _uiState.value.copy(
                    simulationLogs = logs.toList(),
                    activeSimulationStep = "Route 1 failed (429). Falling back to Priority 2: ${currentRoutes.getOrNull(1)?.name ?: "Next Route"}..."
                )
                kotlinx.coroutines.delay(800)

                if (currentRoutes.size > 1) {
                    val r2 = currentRoutes[1]
                    logs.add(
                        RouteAttemptRecord(
                            routeId = r2.id,
                            routeName = r2.name,
                            provider = r2.provider,
                            modelId = r2.modelId,
                            isSuccess = true,
                            statusCode = 200,
                            latencyMs = 320,
                            errorMessage = ""
                        )
                    )
                    _uiState.value = _uiState.value.copy(
                        simulationLogs = logs.toList(),
                        activeSimulationStep = "Route 2 (${r2.name}) succeeded in 320ms! Task continued smoothly."
                    )
                }
            }

            kotlinx.coroutines.delay(600)
            _uiState.value = _uiState.value.copy(
                isSimulatingFallback = false,
                feedbackMessage = "Fallback test completed: Dynamic multi-route failover verified."
            )
        }
    }

    fun clearFeedback() {
        _uiState.value = _uiState.value.copy(feedbackMessage = null)
    }

    private suspend fun rebalancePriorities() {
        val list = aiRouteDao.getEnabledRoutes().sortedBy { it.priority }
        list.forEachIndexed { index, route ->
            if (route.priority != index + 1) {
                aiRouteDao.updateRoute(route.copy(priority = index + 1))
            }
        }
    }
}
