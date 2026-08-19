package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.db.OwnAiDatabase
import com.example.data.entity.*
import com.example.security.KeySecurityHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

data class AuthUiState(
    val currentUser: UserEntity? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val successMessage: String? = null,
    val isAuthenticated: Boolean = false
)

class AuthViewModel(application: Application) : AndroidViewModel(application) {
    private val db = OwnAiDatabase.getInstance(application)
    private val userDao = db.userDao()
    private val apiKeyDao = db.apiKeyDao()
    private val aiRouteDao = db.aiRouteDao()
    private val projectDao = db.projectDao()
    private val projectFileDao = db.projectFileDao()

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            userDao.getActiveUser().collect { user ->
                _uiState.value = _uiState.value.copy(
                    currentUser = user,
                    isAuthenticated = user != null
                )
            }
        }
        // Check if database needs initial seeding
        viewModelScope.launch {
            seedInitialDefaultsIfNeeded()
        }
    }

    fun signIn(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _uiState.value = _uiState.value.copy(errorMessage = "Please enter both email and password")
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val hash = KeySecurityHelper.hashPassword(password)
            val user = userDao.getUserByEmail(email.trim().lowercase())
            if (user != null && user.passwordHash == hash) {
                _uiState.value = _uiState.value.copy(isLoading = false, isAuthenticated = true, successMessage = "Welcome back, ${user.displayName}!")
            } else if (user != null) {
                _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = "Incorrect password.")
            } else {
                // Auto create demo user if not exists
                val newUser = UserEntity(
                    id = UUID.randomUUID().toString(),
                    email = email.trim().lowercase(),
                    displayName = email.substringBefore("@").replaceFirstChar { it.uppercase() },
                    passwordHash = hash
                )
                userDao.insertUser(newUser)
                _uiState.value = _uiState.value.copy(isLoading = false, isAuthenticated = true, successMessage = "Account created successfully!")
            }
        }
    }

    fun quickDemoLogin() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val demoUser = UserEntity(
                id = "demo_user_01",
                email = "developer@ownai.dev",
                displayName = "Alex Vance (Lead Architect)",
                passwordHash = KeySecurityHelper.hashPassword("demo1234")
            )
            userDao.insertUser(demoUser)
            _uiState.value = _uiState.value.copy(isLoading = false, isAuthenticated = true, successMessage = "Logged in as Lead Architect")
        }
    }

    fun signUp(email: String, name: String, password: String) {
        if (email.isBlank() || name.isBlank() || password.length < 6) {
            _uiState.value = _uiState.value.copy(errorMessage = "Password must be at least 6 characters.")
            return
        }
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            val existing = userDao.getUserByEmail(email.trim().lowercase())
            if (existing != null) {
                _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = "An account with this email already exists.")
                return@launch
            }
            val newUser = UserEntity(
                id = UUID.randomUUID().toString(),
                email = email.trim().lowercase(),
                displayName = name.trim(),
                passwordHash = KeySecurityHelper.hashPassword(password)
            )
            userDao.insertUser(newUser)
            _uiState.value = _uiState.value.copy(isLoading = false, isAuthenticated = true, successMessage = "Account registered successfully!")
        }
    }

    fun recoverPassword(email: String) {
        _uiState.value = _uiState.value.copy(
            successMessage = "Password reset instructions sent to ${email.trim()} (Local BYOK Mode: You can sign in with any new password)."
        )
    }

    fun signOut() {
        viewModelScope.launch {
            userDao.clearUsers()
            _uiState.value = AuthUiState(isAuthenticated = false)
        }
    }

    fun clearMessages() {
        _uiState.value = _uiState.value.copy(errorMessage = null, successMessage = null)
    }

    private suspend fun seedInitialDefaultsIfNeeded() {
        val enabledRoutes = aiRouteDao.getEnabledRoutes()
        if (enabledRoutes.isEmpty()) {
            // Seed sample API Keys
            val key1 = ApiKeyEntity(
                id = "key_nvidia_01",
                name = "NVIDIA NIM Fast Inference",
                provider = "nvidia",
                maskedKey = "nvapi-••••••••7890",
                encryptedKey = KeySecurityHelper.encrypt("nvapi-sample-key-token-placeholder-7890"),
                status = ApiKeyStatus.ACTIVE
            )
            val key2 = ApiKeyEntity(
                id = "key_anthropic_01",
                name = "Anthropic Production Team",
                provider = "anthropic",
                maskedKey = "sk-ant-••••••••5541",
                encryptedKey = KeySecurityHelper.encrypt("sk-ant-sample-key-token-placeholder-5541"),
                status = ApiKeyStatus.ACTIVE
            )
            val key3 = ApiKeyEntity(
                id = "key_openai_01",
                name = "OpenAI GPT-4o Key",
                provider = "openai",
                maskedKey = "sk-proj••••••••1234",
                encryptedKey = KeySecurityHelper.encrypt("sk-sample-key-token-placeholder-1234"),
                status = ApiKeyStatus.ACTIVE
            )
            val key4 = ApiKeyEntity(
                id = "key_groq_01",
                name = "Groq LPU Sub-second",
                provider = "groq",
                maskedKey = "gsk_••••••••9900",
                encryptedKey = KeySecurityHelper.encrypt("gsk_sample-key-token-placeholder-9900"),
                status = ApiKeyStatus.ACTIVE
            )
            apiKeyDao.insertApiKey(key1)
            apiKeyDao.insertApiKey(key2)
            apiKeyDao.insertApiKey(key3)
            apiKeyDao.insertApiKey(key4)

            // Seed priority routes:
            // Route 1 -> DeepSeek R1 via NVIDIA NIM (Priority 1)
            // Route 2 -> Claude 3.5 Sonnet (Priority 2)
            // Route 3 -> GPT-4o (Priority 3)
            // Route 4 -> Llama 3.3 70B via Groq (Priority 4)
            val routes = listOf(
                AiRouteEntity(
                    id = "route_01",
                    priority = 1,
                    name = "Route A: DeepSeek R1 (NVIDIA NIM)",
                    provider = "nvidia",
                    modelId = "deepseek-ai/deepseek-r1",
                    apiKeyId = key1.id,
                    supportsVision = false,
                    supportsTools = true,
                    latencyMs = 240
                ),
                AiRouteEntity(
                    id = "route_02",
                    priority = 2,
                    name = "Route B: Claude 3.5 Sonnet (Anthropic)",
                    provider = "anthropic",
                    modelId = "claude-3-5-sonnet-20241022",
                    apiKeyId = key2.id,
                    supportsVision = true,
                    supportsTools = true,
                    latencyMs = 410
                ),
                AiRouteEntity(
                    id = "route_03",
                    priority = 3,
                    name = "Route C: GPT-4o (OpenAI)",
                    provider = "openai",
                    modelId = "gpt-4o",
                    apiKeyId = key3.id,
                    supportsVision = true,
                    supportsTools = true,
                    latencyMs = 380
                ),
                AiRouteEntity(
                    id = "route_04",
                    priority = 4,
                    name = "Route D: Llama 3.3 70B (Groq LPU)",
                    provider = "groq",
                    modelId = "llama-3.3-70b-versatile",
                    apiKeyId = key4.id,
                    supportsVision = false,
                    supportsTools = true,
                    latencyMs = 110
                )
            )
            aiRouteDao.insertRoutes(routes)
        }

        // Seed sample starter project "Jarvis" & "Portfolio Studio"
        val sampleProject = projectDao.getProjectById("project_jarvis_demo")
        if (sampleProject == null) {
            val proj = ProjectEntity(
                id = "project_jarvis_demo",
                name = "Jarvis Portfolio",
                description = "Modern developer portfolio with interactive contact form & dark mode.",
                framework = "Next.js (App Router)",
                templateType = "web",
                filesCount = 6,
                totalLines = 340,
                isStarred = true
            )
            projectDao.insertProject(proj)

            // Seed files
            val starterFiles = listOf(
                ProjectFileEntity(
                    id = "f_pkg",
                    projectId = proj.id,
                    path = "package.json",
                    name = "package.json",
                    content = """{
  "name": "jarvis-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "jest"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.428.0",
    "clsx": "^2.1.1"
  }
}""",
                    language = "json",
                    originalContent = "",
                    sizeBytes = 280
                ),
                ProjectFileEntity(
                    id = "f_page",
                    projectId = proj.id,
                    path = "app/page.tsx",
                    name = "page.tsx",
                    content = """import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProjectsGrid from '../components/ProjectsGrid';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      <Header />
      <Hero />
      <ProjectsGrid />
      <ContactForm />
      <Footer />
    </main>
  );
}""",
                    language = "typescript",
                    originalContent = "",
                    sizeBytes = 430
                ),
                ProjectFileEntity(
                    id = "f_hero",
                    projectId = proj.id,
                    path = "components/Hero.tsx",
                    name = "Hero.tsx",
                    content = """import React from 'react';
import { Sparkles, ArrowRight, Github } from 'lucide-react';

export default function Hero() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-6">
        <Sparkles size={14} />
        <span>OwnAI BYOK Agent</span>
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-white max-w-2xl">
        Building software with autonomous intelligence.
      </h1>
      <p className="mt-4 text-slate-400 text-lg max-w-xl">
        Senior Engineer crafting resilient distributed architectures.
      </p>
      <div className="mt-8 flex gap-4">
        <a href="#contact" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium">Contact Me</a>
      </div>
    </section>
  );
}""",
                    language = "typescript",
                    originalContent = "",
                    sizeBytes = 850
                ),
                ProjectFileEntity(
                    id = "f_contact",
                    projectId = proj.id,
                    path = "components/ContactForm.tsx",
                    name = "ContactForm.tsx",
                    content = """'use client';
import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-16 px-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
      {sent ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={20} />
          <span>Message transmitted successfully!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm"
          />
          <input
            type="email"
            required
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm"
          />
          <textarea
            required
            rows={4}
            placeholder="Project Scope..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm">
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}""",
                    language = "typescript",
                    originalContent = "",
                    sizeBytes = 1400
                ),
                ProjectFileEntity(
                    id = "f_header",
                    projectId = proj.id,
                    path = "components/Header.tsx",
                    name = "Header.tsx",
                    content = """import React from 'react';
import { Terminal } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center max-w-5xl mx-auto">
      <div className="flex items-center gap-2 font-mono font-bold text-white text-sm">
        <Terminal size={16} className="text-blue-400" />
        <span>jarvis.dev</span>
      </div>
      <nav className="flex gap-4 text-xs font-mono text-slate-400">
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}""",
                    language = "typescript",
                    originalContent = "",
                    sizeBytes = 550
                ),
                ProjectFileEntity(
                    id = "f_footer",
                    projectId = proj.id,
                    path = "components/Footer.tsx",
                    name = "Footer.tsx",
                    content = """import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8 text-center text-xs font-mono text-slate-500">
      <p>© 2026 Built with OwnAI Coding Agent.</p>
    </footer>
  );
}""",
                    language = "typescript",
                    originalContent = "",
                    sizeBytes = 250
                )
            )
            projectFileDao.insertFiles(starterFiles)
        }
    }
}
