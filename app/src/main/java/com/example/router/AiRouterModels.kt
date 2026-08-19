package com.example.router

enum class ModelProvider(
    val id: String,
    val displayName: String,
    val defaultBaseUrl: String,
    val keyPrefix: String,
    val defaultModels: List<ModelDescriptor>
) {
    ANTHROPIC(
        id = "anthropic",
        displayName = "Anthropic",
        defaultBaseUrl = "https://api.anthropic.com/v1",
        keyPrefix = "sk-ant-",
        defaultModels = listOf(
            ModelDescriptor("claude-3-5-sonnet-20241022", "Claude 3.5 Sonnet (Coding SOTA)", supportsVision = true, supportsTools = true, contextWindow = 200000),
            ModelDescriptor("claude-3-opus-20240229", "Claude 3 Opus (High Reasoning)", supportsVision = true, supportsTools = true, contextWindow = 200000),
            ModelDescriptor("claude-3-5-haiku-20241022", "Claude 3.5 Haiku (Fast & Light)", supportsVision = true, supportsTools = true, contextWindow = 200000)
        )
    ),
    OPENAI(
        id = "openai",
        displayName = "OpenAI",
        defaultBaseUrl = "https://api.openai.com/v1",
        keyPrefix = "sk-",
        defaultModels = listOf(
            ModelDescriptor("gpt-4o", "GPT-4o (Omni Reasoning)", supportsVision = true, supportsTools = true, contextWindow = 128000),
            ModelDescriptor("gpt-4o-mini", "GPT-4o Mini (Fast & Efficient)", supportsVision = true, supportsTools = true, contextWindow = 128000),
            ModelDescriptor("o3-mini", "o3-mini (High Reasoning Code)", supportsVision = false, supportsTools = true, contextWindow = 200000),
            ModelDescriptor("o1", "o1 (Deep Reasoning)", supportsVision = true, supportsTools = true, contextWindow = 200000)
        )
    ),
    GEMINI(
        id = "gemini",
        displayName = "Google Gemini",
        defaultBaseUrl = "https://generativelanguage.googleapis.com/v1beta",
        keyPrefix = "AIzaSy",
        defaultModels = listOf(
            ModelDescriptor("gemini-2.0-flash", "Gemini 2.0 Flash (Ultra Fast SOTA)", supportsVision = true, supportsTools = true, contextWindow = 1000000),
            ModelDescriptor("gemini-1.5-pro", "Gemini 1.5 Pro (Large 2M Context)", supportsVision = true, supportsTools = true, contextWindow = 2000000),
            ModelDescriptor("gemini-2.0-pro-exp-02-05", "Gemini 2.0 Pro Experimental", supportsVision = true, supportsTools = true, contextWindow = 2000000)
        )
    ),
    NVIDIA(
        id = "nvidia",
        displayName = "NVIDIA NIM",
        defaultBaseUrl = "https://integrate.api.nvidia.com/v1",
        keyPrefix = "nvapi-",
        defaultModels = listOf(
            ModelDescriptor("deepseek-ai/deepseek-r1", "DeepSeek R1 (Open Reasoning)", supportsVision = false, supportsTools = true, contextWindow = 64000),
            ModelDescriptor("meta/llama-3.3-70b-instruct", "Llama 3.3 70B Instruct", supportsVision = false, supportsTools = true, contextWindow = 128000),
            ModelDescriptor("mistralai/mistral-large-2-instruct", "Mistral Large 2", supportsVision = false, supportsTools = true, contextWindow = 128000)
        )
    ),
    GROQ(
        id = "groq",
        displayName = "Groq LPU",
        defaultBaseUrl = "https://api.groq.com/openai/v1",
        keyPrefix = "gsk_",
        defaultModels = listOf(
            ModelDescriptor("llama-3.3-70b-versatile", "Llama 3.3 70B (Sub-second)", supportsVision = false, supportsTools = true, contextWindow = 128000),
            ModelDescriptor("deepseek-r1-distill-llama-70b", "DeepSeek R1 Distill 70B", supportsVision = false, supportsTools = true, contextWindow = 128000),
            ModelDescriptor("mixtral-8x7b-32768", "Mixtral 8x7B (High Throughput)", supportsVision = false, supportsTools = false, contextWindow = 32768)
        )
    ),
    OPENROUTER(
        id = "openrouter",
        displayName = "OpenRouter",
        defaultBaseUrl = "https://openrouter.ai/api/v1",
        keyPrefix = "sk-or-",
        defaultModels = listOf(
            ModelDescriptor("anthropic/claude-3.5-sonnet", "Claude 3.5 Sonnet (via OpenRouter)", supportsVision = true, supportsTools = true, contextWindow = 200000),
            ModelDescriptor("openai/gpt-4o", "GPT-4o (via OpenRouter)", supportsVision = true, supportsTools = true, contextWindow = 128000),
            ModelDescriptor("deepseek/deepseek-r1", "DeepSeek R1 (via OpenRouter)", supportsVision = false, supportsTools = true, contextWindow = 64000)
        )
    ),
    CUSTOM(
        id = "custom",
        displayName = "Custom / Local Ollama",
        defaultBaseUrl = "http://10.0.2.2:11434/v1",
        keyPrefix = "",
        defaultModels = listOf(
            ModelDescriptor("qwen2.5-coder:32b", "Qwen 2.5 Coder 32B", supportsVision = false, supportsTools = true, contextWindow = 32768),
            ModelDescriptor("deepseek-coder-v2:16b", "DeepSeek Coder V2", supportsVision = false, supportsTools = true, contextWindow = 64000),
            ModelDescriptor("llama3.2:latest", "Llama 3.2 (Local)", supportsVision = true, supportsTools = true, contextWindow = 128000)
        )
    );

    companion object {
        fun fromId(id: String): ModelProvider {
            return entries.find { it.id.equals(id, ignoreCase = true) } ?: CUSTOM
        }
    }
}

data class ModelDescriptor(
    val modelId: String,
    val displayName: String,
    val supportsVision: Boolean,
    val supportsTools: Boolean,
    val contextWindow: Int
)

data class RoutePingResult(
    val routeId: String,
    val isSuccess: Boolean,
    val latencyMs: Long,
    val statusCode: Int = 200,
    val errorMessage: String = "",
    val modelId: String = ""
)

data class RoutingExecutionPlan(
    val primaryRouteId: String,
    val fallbackRouteIds: List<String>,
    val attempts: MutableList<RouteAttemptRecord> = mutableListOf()
)

data class RouteAttemptRecord(
    val routeId: String,
    val routeName: String,
    val provider: String,
    val modelId: String,
    val isSuccess: Boolean,
    val statusCode: Int,
    val latencyMs: Long,
    val errorMessage: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

data class AgentLlmRequest(
    val systemPrompt: String,
    val userPrompt: String,
    val contextFiles: List<Pair<String, String>> = emptyList(),
    val availableTools: List<String> = emptyList(),
    val temperature: Float = 0.2f,
    val maxTokens: Int = 4096,
    val attachments: List<Pair<String, String>> = emptyList() // name to content or base64
)

data class AgentLlmResponse(
    val rawContent: String,
    val toolInvocations: List<ToolInvocationRequest> = emptyList(),
    val reasoning: String = "",
    val routeUsed: String = "",
    val modelUsed: String = "",
    val latencyMs: Long = 0L,
    val tokensUsed: Int = 0
)

data class ToolInvocationRequest(
    val toolName: String,
    val arguments: Map<String, String>
)

object ProviderCatalog {
    val allProviders: List<ModelProvider> = ModelProvider.values().toList()

    fun getProvider(id: String): ModelProvider? {
        return allProviders.find { it.id.equals(id, ignoreCase = true) }
    }
}
