/**
 * Memory analyzer module.
 * Uses the local Ollama model to decide whether messages are worth saving as
 * short-term memory candidates.
 */

import axios from "axios";
import {
    IS_DEV_LOG_MODE,
    OLLAMA_CHAT_URL,
    OLLAMA_ANALYZER_MODEL,
    OLLAMA_KEEP_ALIVE,
    OLLAMA_NUM_CTX,
} from "../config/index.js";
import { REQUEST_TIMEOUT } from "../config/index.js";
import { MEMORY_CATEGORIES } from "./memoryService.js";

function logDev(label, value) {
    if (!IS_DEV_LOG_MODE) return;
    console.log(`\n🛠️  [DEV] ${label}`);
    console.dir(value, { depth: null, colors: true });
}

function extractJsonString(rawText) {
    if (!rawText || typeof rawText !== "string") {
        return null;
    }

    const trimmed = rawText.trim();
    try {
        JSON.parse(trimmed);
        return trimmed;
    } catch {
        const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
        if (fenceMatch) {
            const candidate = fenceMatch[1].trim();
            try {
                JSON.parse(candidate);
                return candidate;
            } catch {
                // Continue to object extraction.
            }
        }

        const jsonMatch = trimmed.match(/(\{[\s\S]*\})/);
        if (jsonMatch) {
            const candidate = jsonMatch[1].trim();
            try {
                JSON.parse(candidate);
                return candidate;
            } catch {
                return null;
            }
        }
    }

    return null;
}

function normalizeCategory(category) {
    const normalized = String(category || "other")
        .trim()
        .toLowerCase();
    return MEMORY_CATEGORIES.has(normalized) ? normalized : "other";
}

function normalizeImportance(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0.3;
    return Math.min(Math.max(parsed, 0), 1);
}

export async function analyzeMessageImportance(message, source) {
    try {
        const startedAt = Date.now();

        const payload = {
            model: OLLAMA_ANALYZER_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are a strict JSON-only memory analyzer. Return one valid JSON object and no markdown.

Analyze this ${source} message for short-term memory.

Return ONLY this exact JSON schema.
Do not add, remove, or rename keys.

Save useful facts such as name, age, profile facts, preferences, goals, habits, projects, or meaningful emotional context.

Do NOT save greetings, small talk, jokes, questions, guesses, or temporary details.

Required JSON schema:

{
  "shouldSave": false,
  "importance": 0.0,
  "memory": "",
  "category": "other",
  "ttlDays": 0
}

Rules:
- If saving, set shouldSave to true.
- If not saving, keep memory empty.
- category must be one of: profile, preference, goal, routine, emotional_context, temporary, project, fitness, other.
- Do not use any other keys.`,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            stream: false,
            format: "json",
            keep_alive: OLLAMA_KEEP_ALIVE,
            options: {
                temperature: 0.2,
                num_ctx: OLLAMA_NUM_CTX,
                num_predict: 260,
            },
        };

        logDev("Ollama memory analyzer request", {
            url: OLLAMA_CHAT_URL,
            timeout: REQUEST_TIMEOUT,
            payload,
        });

        const response = await axios.post(OLLAMA_CHAT_URL, payload, {
            timeout: REQUEST_TIMEOUT,
        });

        const rawContent =
            response.data?.message?.content || response.data?.response || "{}";
        const jsonString = extractJsonString(rawContent) || "{}";
        const parsed = JSON.parse(jsonString);

        logDev("Ollama memory analyzer response", {
            status: response.status,
            elapsedMs: Date.now() - startedAt,
            model: response.data?.model,
            rawContent,
            parsed,
        });

        const ttlDays = Number(parsed.ttlDays);
        return {
            shouldSave: parsed.shouldSave === true,
            importance: normalizeImportance(parsed.importance),
            memory:
                typeof parsed.memory === "string" ? parsed.memory.trim() : "",
            category: normalizeCategory(parsed.category),
            ttlDays: Number.isFinite(ttlDays) && ttlDays > 0 ? ttlDays : 14,
        };
    } catch (error) {
        console.error("🧠❌ Memory analyzer error:", error.message);
        return {
            shouldSave: false,
            importance: 0,
            memory: "",
            category: "other",
            ttlDays: 14,
        };
    }
}

export async function analyzeMessageBatch(messages) {
    const results = [];
    for (const msg of messages) {
        const analysis = await analyzeMessageImportance(
            msg.content,
            msg.source,
        );
        results.push(analysis);
    }
    return results;
}
