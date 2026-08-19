package com.example.router

import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

interface ProviderAdapter {
    suspend fun ping(apiKey: String, baseUrl: String, modelId: String): RoutePingResult
    suspend fun execute(
        apiKey: String,
        baseUrl: String,
        modelId: String,
        request: AgentLlmRequest
    ): AgentLlmResponse
}

class OpenAICompatibleAdapter(
    private val defaultBaseUrl: String,
    private val customAuthHeaderPrefix: String = "Bearer "
) : ProviderAdapter {
    private val client = OkHttpClient.Builder()
        .connectTimeout(20, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    override suspend fun ping(apiKey: String, baseUrl: String, modelId: String): RoutePingResult {
        val targetUrl = (if (baseUrl.isNotBlank()) baseUrl.trimEnd('/') else defaultBaseUrl) + "/chat/completions"
        val startTime = System.currentTimeMillis()
        val json = JSONObject().apply {
            put("model", modelId)
            put("messages", JSONArray().apply {
                put(JSONObject().apply {
                    put("role", "user")
                    put("content", "ping")
                })
            })
            put("max_tokens", 5)
        }

        val request = Request.Builder()
            .url(targetUrl)
            .addHeader("Authorization", "$customAuthHeaderPrefix$apiKey")
            .addHeader("Content-Type", "application/json")
            .post(json.toString().toRequestBody("application/json".toMediaType()))
            .build()

        return try {
            client.newCall(request).execute().use { response ->
                val latency = System.currentTimeMillis() - startTime
                if (response.isSuccessful) {
                    RoutePingResult(
                        routeId = "",
                        isSuccess = true,
                        latencyMs = latency,
                        statusCode = response.code,
                        modelId = modelId
                    )
                } else {
                    val errBody = response.body?.string() ?: ""
                    RoutePingResult(
                        routeId = "",
                        isSuccess = false,
                        latencyMs = latency,
                        statusCode = response.code,
                        errorMessage = "HTTP ${response.code}: $errBody",
                        modelId = modelId
                    )
                }
            }
        } catch (e: Exception) {
            RoutePingResult(
                routeId = "",
                isSuccess = false,
                latencyMs = System.currentTimeMillis() - startTime,
                statusCode = 0,
                errorMessage = e.message ?: "Network exception",
                modelId = modelId
            )
        }
    }

    override suspend fun execute(
        apiKey: String,
        baseUrl: String,
        modelId: String,
        request: AgentLlmRequest
    ): AgentLlmResponse {
        val targetUrl = (if (baseUrl.isNotBlank()) baseUrl.trimEnd('/') else defaultBaseUrl) + "/chat/completions"
        val startTime = System.currentTimeMillis()

        val messagesArray = JSONArray()
        // System message
        if (request.systemPrompt.isNotBlank()) {
            messagesArray.put(JSONObject().apply {
                put("role", "system")
                put("content", request.systemPrompt)
            })
        }

        // Context files
        val contextBuilder = StringBuilder()
        if (request.contextFiles.isNotEmpty()) {
            contextBuilder.append("PROJECT CONTEXT FILES:\n")
            for ((path, content) in request.contextFiles) {
                contextBuilder.append("--- $path ---\n$content\n\n")
            }
        }
        contextBuilder.append("USER GOAL: ").append(request.userPrompt)

        messagesArray.put(JSONObject().apply {
            put("role", "user")
            put("content", contextBuilder.toString())
        })

        val json = JSONObject().apply {
            put("model", modelId)
            put("messages", messagesArray)
            put("temperature", request.temperature.toDouble())
            put("max_tokens", request.maxTokens)
        }

        val httpRequest = Request.Builder()
            .url(targetUrl)
            .addHeader("Authorization", "$customAuthHeaderPrefix$apiKey")
            .addHeader("Content-Type", "application/json")
            .post(json.toString().toRequestBody("application/json".toMediaType()))
            .build()

        client.newCall(httpRequest).execute().use { response ->
            val latency = System.currentTimeMillis() - startTime
            val bodyString = response.body?.string() ?: ""

            if (!response.isSuccessful) {
                throw IOException("HTTP ${response.code} error from $targetUrl: $bodyString")
            }

            val responseJson = JSONObject(bodyString)
            val choices = responseJson.optJSONArray("choices")
            val firstChoice = choices?.optJSONObject(0)
            val messageObj = firstChoice?.optJSONObject("message")
            val content = messageObj?.optString("content") ?: ""
            val usageObj = responseJson.optJSONObject("usage")
            val totalTokens = usageObj?.optInt("total_tokens", 0) ?: 0

            val toolInvocations = parseToolInvocations(content)

            return AgentLlmResponse(
                rawContent = content,
                toolInvocations = toolInvocations,
                routeUsed = modelId,
                modelUsed = modelId,
                latencyMs = latency,
                tokensUsed = totalTokens
            )
        }
    }

    private fun parseToolInvocations(content: String): List<ToolInvocationRequest> {
        val list = mutableListOf<ToolInvocationRequest>()
        // Parse ```json tool invocation or direct JSON block
        val regex = Regex("```(?:json)?\\s*\\{([\\s\\S]*?)\\}\\s*```", RegexOption.MULTILINE)
        val matches = regex.findAll(content)
        for (match in matches) {
            try {
                val jsonStr = "{" + match.groupValues[1] + "}"
                val obj = JSONObject(jsonStr)
                if (obj.has("tool") && obj.has("args")) {
                    val toolName = obj.getString("tool")
                    val argsObj = obj.getJSONObject("args")
                    val argsMap = mutableMapOf<String, String>()
                    val keys = argsObj.keys()
                    while (keys.hasNext()) {
                        val key = keys.next()
                        argsMap[key] = argsObj.optString(key)
                    }
                    list.add(ToolInvocationRequest(toolName, argsMap))
                }
            } catch (_: Exception) {}
        }
        return list
    }
}

class AnthropicAdapter(private val defaultBaseUrl: String = "https://api.anthropic.com/v1") : ProviderAdapter {
    private val client = OkHttpClient.Builder()
        .connectTimeout(20, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    override suspend fun ping(apiKey: String, baseUrl: String, modelId: String): RoutePingResult {
        val targetUrl = (if (baseUrl.isNotBlank()) baseUrl.trimEnd('/') else defaultBaseUrl) + "/messages"
        val startTime = System.currentTimeMillis()
        val json = JSONObject().apply {
            put("model", modelId)
            put("max_tokens", 5)
            put("messages", JSONArray().apply {
                put(JSONObject().apply {
                    put("role", "user")
                    put("content", "ping")
                })
            })
        }

        val request = Request.Builder()
            .url(targetUrl)
            .addHeader("x-api-key", apiKey)
            .addHeader("anthropic-version", "2023-06-01")
            .addHeader("Content-Type", "application/json")
            .post(json.toString().toRequestBody("application/json".toMediaType()))
            .build()

        return try {
            client.newCall(request).execute().use { response ->
                val latency = System.currentTimeMillis() - startTime
                if (response.isSuccessful) {
                    RoutePingResult(
                        routeId = "",
                        isSuccess = true,
                        latencyMs = latency,
                        statusCode = response.code,
                        modelId = modelId
                    )
                } else {
                    val errBody = response.body?.string() ?: ""
                    RoutePingResult(
                        routeId = "",
                        isSuccess = false,
                        latencyMs = latency,
                        statusCode = response.code,
                        errorMessage = "HTTP ${response.code}: $errBody",
                        modelId = modelId
                    )
                }
            }
        } catch (e: Exception) {
            RoutePingResult(
                routeId = "",
                isSuccess = false,
                latencyMs = System.currentTimeMillis() - startTime,
                statusCode = 0,
                errorMessage = e.message ?: "Network error",
                modelId = modelId
            )
        }
    }

    override suspend fun execute(
        apiKey: String,
        baseUrl: String,
        modelId: String,
        request: AgentLlmRequest
    ): AgentLlmResponse {
        val targetUrl = (if (baseUrl.isNotBlank()) baseUrl.trimEnd('/') else defaultBaseUrl) + "/messages"
        val startTime = System.currentTimeMillis()

        val json = JSONObject().apply {
            put("model", modelId)
            put("max_tokens", request.maxTokens)
            put("temperature", request.temperature.toDouble())
            if (request.systemPrompt.isNotBlank()) {
                put("system", request.systemPrompt)
            }
            val msgArray = JSONArray()
            val userText = buildString {
                if (request.contextFiles.isNotEmpty()) {
                    append("PROJECT CONTEXT FILES:\n")
                    for ((path, content) in request.contextFiles) {
                        append("--- $path ---\n$content\n\n")
                    }
                }
                append("USER GOAL: ").append(request.userPrompt)
            }
            msgArray.put(JSONObject().apply {
                put("role", "user")
                put("content", userText)
            })
            put("messages", msgArray)
        }

        val httpRequest = Request.Builder()
            .url(targetUrl)
            .addHeader("x-api-key", apiKey)
            .addHeader("anthropic-version", "2023-06-01")
            .addHeader("Content-Type", "application/json")
            .post(json.toString().toRequestBody("application/json".toMediaType()))
            .build()

        client.newCall(httpRequest).execute().use { response ->
            val latency = System.currentTimeMillis() - startTime
            val bodyString = response.body?.string() ?: ""

            if (!response.isSuccessful) {
                throw IOException("HTTP ${response.code} Anthropic Error: $bodyString")
            }

            val responseJson = JSONObject(bodyString)
            val contentArr = responseJson.optJSONArray("content")
            val textBuilder = StringBuilder()
            if (contentArr != null) {
                for (i in 0 until contentArr.length()) {
                    val item = contentArr.optJSONObject(i)
                    if (item?.optString("type") == "text") {
                        textBuilder.append(item.optString("text"))
                    }
                }
            }
            val rawText = textBuilder.toString()
            val usage = responseJson.optJSONObject("usage")
            val tokens = (usage?.optInt("input_tokens", 0) ?: 0) + (usage?.optInt("output_tokens", 0) ?: 0)

            return AgentLlmResponse(
                rawContent = rawText,
                toolInvocations = emptyList(),
                routeUsed = modelId,
                modelUsed = modelId,
                latencyMs = latency,
                tokensUsed = tokens
            )
        }
    }
}

class GeminiAdapter(private val defaultBaseUrl: String = "https://generativelanguage.googleapis.com/v1beta") : ProviderAdapter {
    private val client = OkHttpClient.Builder()
        .connectTimeout(20, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    override suspend fun ping(apiKey: String, baseUrl: String, modelId: String): RoutePingResult {
        val targetUrl = "${if (baseUrl.isNotBlank()) baseUrl.trimEnd('/') else defaultBaseUrl}/models/$modelId:generateContent?key=$apiKey"
        val startTime = System.currentTimeMillis()

        val json = JSONObject().apply {
            put("contents", JSONArray().apply {
                put(JSONObject().apply {
                    put("parts", JSONArray().apply {
                        put(JSONObject().apply { put("text", "ping") })
                    })
                })
            })
            put("generationConfig", JSONObject().apply {
                put("maxOutputTokens", 5)
            })
        }

        val request = Request.Builder()
            .url(targetUrl)
            .addHeader("Content-Type", "application/json")
            .post(json.toString().toRequestBody("application/json".toMediaType()))
            .build()

        return try {
            client.newCall(request).execute().use { response ->
                val latency = System.currentTimeMillis() - startTime
                if (response.isSuccessful) {
                    RoutePingResult(
                        routeId = "",
                        isSuccess = true,
                        latencyMs = latency,
                        statusCode = response.code,
                        modelId = modelId
                    )
                } else {
                    val errBody = response.body?.string() ?: ""
                    RoutePingResult(
                        routeId = "",
                        isSuccess = false,
                        latencyMs = latency,
                        statusCode = response.code,
                        errorMessage = "HTTP ${response.code}: $errBody",
                        modelId = modelId
                    )
                }
            }
        } catch (e: Exception) {
            RoutePingResult(
                routeId = "",
                isSuccess = false,
                latencyMs = System.currentTimeMillis() - startTime,
                statusCode = 0,
                errorMessage = e.message ?: "Network error",
                modelId = modelId
            )
        }
    }

    override suspend fun execute(
        apiKey: String,
        baseUrl: String,
        modelId: String,
        request: AgentLlmRequest
    ): AgentLlmResponse {
        val targetUrl = "${if (baseUrl.isNotBlank()) baseUrl.trimEnd('/') else defaultBaseUrl}/models/$modelId:generateContent?key=$apiKey"
        val startTime = System.currentTimeMillis()

        val userPromptWithContext = buildString {
            if (request.systemPrompt.isNotBlank()) {
                append("SYSTEM DIRECTIVE:\n").append(request.systemPrompt).append("\n\n")
            }
            if (request.contextFiles.isNotEmpty()) {
                append("PROJECT CONTEXT FILES:\n")
                for ((path, content) in request.contextFiles) {
                    append("--- $path ---\n$content\n\n")
                }
            }
            append("USER GOAL: ").append(request.userPrompt)
        }

        val json = JSONObject().apply {
            put("contents", JSONArray().apply {
                put(JSONObject().apply {
                    put("parts", JSONArray().apply {
                        put(JSONObject().apply { put("text", userPromptWithContext) })
                    })
                })
            })
            put("generationConfig", JSONObject().apply {
                put("temperature", request.temperature.toDouble())
                put("maxOutputTokens", request.maxTokens)
            })
        }

        val httpRequest = Request.Builder()
            .url(targetUrl)
            .addHeader("Content-Type", "application/json")
            .post(json.toString().toRequestBody("application/json".toMediaType()))
            .build()

        client.newCall(httpRequest).execute().use { response ->
            val latency = System.currentTimeMillis() - startTime
            val bodyString = response.body?.string() ?: ""

            if (!response.isSuccessful) {
                throw IOException("HTTP ${response.code} Gemini Error: $bodyString")
            }

            val responseJson = JSONObject(bodyString)
            val candidates = responseJson.optJSONArray("candidates")
            val firstCandidate = candidates?.optJSONObject(0)
            val contentObj = firstCandidate?.optJSONObject("content")
            val partsArr = contentObj?.optJSONArray("parts")
            val textBuilder = StringBuilder()
            if (partsArr != null) {
                for (i in 0 until partsArr.length()) {
                    val p = partsArr.optJSONObject(i)
                    textBuilder.append(p?.optString("text") ?: "")
                }
            }
            val usage = responseJson.optJSONObject("usageMetadata")
            val totalTokens = usage?.optInt("totalTokenCount", 0) ?: 0

            return AgentLlmResponse(
                rawContent = textBuilder.toString(),
                toolInvocations = emptyList(),
                routeUsed = modelId,
                modelUsed = modelId,
                latencyMs = latency,
                tokensUsed = totalTokens
            )
        }
    }
}
