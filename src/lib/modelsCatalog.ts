import { ModelProviderType } from '../types';

export interface ModelCatalogItem {
  id: string;
  name: string;
  provider: ModelProviderType;
  providerLabel: string;
  contextWindow: string;
  supportsTools: boolean;
  supportsVision: boolean;
  tier: 'Flagship' | 'Reasoning' | 'Ultra-Fast' | 'Coding' | 'Standard';
  description: string;
  latencyAvgMs: number;
}

export const PROVIDER_METADATA: Record<
  ModelProviderType,
  {
    name: string;
    label: string;
    description: string;
    defaultBaseUrl: string;
    docsUrl: string;
    keyPlaceholder: string;
  }
> = {
  nvidia: {
    name: 'nvidia',
    label: 'NVIDIA NIM',
    description: 'Enterprise containerized inference with DeepSeek-R1, Nemotron, Llama 3.3 and Qwen.',
    defaultBaseUrl: 'https://integrate.api.nvidia.com/v1',
    docsUrl: 'https://build.nvidia.com',
    keyPlaceholder: 'nvapi-••••••••••••••••'
  },
  openai: {
    name: 'openai',
    label: 'OpenAI',
    description: 'GPT-4o, GPT-4o-mini, and o1/o3-mini reasoning models for autonomous coding.',
    defaultBaseUrl: 'https://api.openai.com/v1',
    docsUrl: 'https://platform.openai.com',
    keyPlaceholder: 'sk-proj-••••••••••••••••'
  },
  anthropic: {
    name: 'anthropic',
    label: 'Anthropic',
    description: 'Claude 3.7 Sonnet, Claude 3.5 Sonnet, and Haiku with deep reasoning and coding prowess.',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    docsUrl: 'https://console.anthropic.com',
    keyPlaceholder: 'sk-ant-api03-••••••••••••••••'
  },
  gemini: {
    name: 'gemini',
    label: 'Google Gemini',
    description: 'Gemini 2.5 Flash, 2.5 Pro, and 2.0 Flash with massive 2M token context windows.',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com',
    docsUrl: 'https://aistudio.google.com',
    keyPlaceholder: 'AIzaSy••••••••••••••••'
  },
  groq: {
    name: 'groq',
    label: 'Groq LPU',
    description: 'Ultra-low latency LPU inference serving Llama 3.3 and DeepSeek R1 at 800+ tokens/sec.',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    docsUrl: 'https://console.groq.com',
    keyPlaceholder: 'gsk_••••••••••••••••'
  },
  openrouter: {
    name: 'openrouter',
    label: 'OpenRouter',
    description: 'Unified gateway to over 100+ open and proprietary AI models with auto-routing.',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    docsUrl: 'https://openrouter.ai',
    keyPlaceholder: 'sk-or-v1-••••••••••••••••'
  },
  custom: {
    name: 'custom',
    label: 'Custom / Self-Hosted',
    description: 'Connect local Ollama, vLLM, LocalAI, or custom OpenAI-compatible API proxies.',
    defaultBaseUrl: 'http://localhost:11434/v1',
    docsUrl: '',
    keyPlaceholder: 'custom-key-or-bearer-token'
  }
};

export const MODELS_CATALOG: ModelCatalogItem[] = [
  // NVIDIA NIM Models
  {
    id: 'deepseek-ai/deepseek-r1',
    name: 'DeepSeek R1 (NVIDIA NIM)',
    provider: 'nvidia',
    providerLabel: 'NVIDIA NIM',
    contextWindow: '128k',
    supportsTools: true,
    supportsVision: false,
    tier: 'Reasoning',
    description: 'Frontier open-weights reasoning model with mathematical & architectural verification.',
    latencyAvgMs: 140
  },
  {
    id: 'meta/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'nvidia',
    providerLabel: 'NVIDIA NIM',
    contextWindow: '128k',
    supportsTools: true,
    supportsVision: false,
    tier: 'Coding',
    description: 'Flagship Meta instruction model with excellent code comprehension.',
    latencyAvgMs: 110
  },
  {
    id: 'qwen/qwen2.5-coder-32b-instruct',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'nvidia',
    providerLabel: 'NVIDIA NIM',
    contextWindow: '32k',
    supportsTools: true,
    supportsVision: false,
    tier: 'Coding',
    description: 'Specialized code generation & refactoring model.',
    latencyAvgMs: 85
  },

  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o Omni',
    provider: 'openai',
    providerLabel: 'OpenAI',
    contextWindow: '128k',
    supportsTools: true,
    supportsVision: true,
    tier: 'Flagship',
    description: 'High-speed flagship multimodal model with tool invocation and visual reasoning.',
    latencyAvgMs: 180
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    providerLabel: 'OpenAI',
    contextWindow: '128k',
    supportsTools: true,
    supportsVision: true,
    tier: 'Ultra-Fast',
    description: 'Lightweight, ultra-fast model for routine code audits and single-file edits.',
    latencyAvgMs: 70
  },
  {
    id: 'o3-mini',
    name: 'o3-mini Reasoning',
    provider: 'openai',
    providerLabel: 'OpenAI',
    contextWindow: '200k',
    supportsTools: true,
    supportsVision: false,
    tier: 'Reasoning',
    description: 'Next-gen reasoning model optimized for complex algorithms and bug finding.',
    latencyAvgMs: 250
  },

  // Anthropic Models
  {
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude 3.7 Sonnet (Hybrid)',
    provider: 'anthropic',
    providerLabel: 'Anthropic',
    contextWindow: '200k',
    supportsTools: true,
    supportsVision: true,
    tier: 'Flagship',
    description: 'Hybrid reasoning and instant response model with unmatched agentic coding precision.',
    latencyAvgMs: 195
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet v2',
    provider: 'anthropic',
    providerLabel: 'Anthropic',
    contextWindow: '200k',
    supportsTools: true,
    supportsVision: true,
    tier: 'Coding',
    description: 'Benchmark-leading coding intelligence, complex refactorings, and JSX design.',
    latencyAvgMs: 160
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    providerLabel: 'Anthropic',
    contextWindow: '200k',
    supportsTools: true,
    supportsVision: false,
    tier: 'Ultra-Fast',
    description: 'Sub-second response model for quick terminal queries and documentation lookup.',
    latencyAvgMs: 65
  },

  // Google Gemini Models
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'gemini',
    providerLabel: 'Google Gemini',
    contextWindow: '1M',
    supportsTools: true,
    supportsVision: true,
    tier: 'Ultra-Fast',
    description: 'Fast, high-quality multimodal model with 1,000,000 token context window.',
    latencyAvgMs: 95
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    providerLabel: 'Google Gemini',
    contextWindow: '2M',
    supportsTools: true,
    supportsVision: true,
    tier: 'Flagship',
    description: 'Deep reasoning across massive codebases with up to 2 million tokens.',
    latencyAvgMs: 220
  },

  // Groq Models
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B (Groq LPU)',
    provider: 'groq',
    providerLabel: 'Groq LPU',
    contextWindow: '128k',
    supportsTools: true,
    supportsVision: false,
    tier: 'Ultra-Fast',
    description: 'Ultra-fast execution at ~750 tokens per second for real-time live coding.',
    latencyAvgMs: 45
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'DeepSeek R1 Distill 70B',
    provider: 'groq',
    providerLabel: 'Groq LPU',
    contextWindow: '128k',
    supportsTools: true,
    supportsVision: false,
    tier: 'Reasoning',
    description: 'Reasoning model accelerated on Groq LPUs.',
    latencyAvgMs: 55
  },

  // OpenRouter Models
  {
    id: 'openrouter/auto',
    name: 'OpenRouter Auto Router',
    provider: 'openrouter',
    providerLabel: 'OpenRouter',
    contextWindow: '128k',
    supportsTools: true,
    supportsVision: true,
    tier: 'Standard',
    description: 'Dynamically routes between top models based on availability and cost.',
    latencyAvgMs: 150
  },

  // Custom Endpoint
  {
    id: 'custom-local-llm',
    name: 'Self-Hosted Local LLM (Ollama/vLLM)',
    provider: 'custom',
    providerLabel: 'Custom',
    contextWindow: '32k',
    supportsTools: true,
    supportsVision: false,
    tier: 'Standard',
    description: 'Local or on-premises endpoint with zero external data transmission.',
    latencyAvgMs: 30
  }
];

export function getModelsForProvider(provider: ModelProviderType): ModelCatalogItem[] {
  return MODELS_CATALOG.filter((m) => m.provider === provider);
}
