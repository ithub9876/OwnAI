import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      version: "2.4.1",
      platform: "OwnAI BYOK Agent OS",
      timestamp: new Date().toISOString()
    });
  });

  // Server-side AI proxy endpoint (optional fallback if user configures GEMINI_API_KEY on server)
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured on the server. Please use BYOK client routing."
        });
      }

      const { prompt, systemInstruction } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined
      });

      res.json({
        text: response.text || "",
        model: "gemini-2.5-flash"
      });
    } catch (err: any) {
      console.error("AI Generation error:", err);
      res.status(500).json({ error: err.message || "Failed to generate content" });
    }
  });

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OwnAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
