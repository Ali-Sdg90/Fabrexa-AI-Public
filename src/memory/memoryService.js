/**
 * Two-layer memory storage service.
 * Short-term memories are temporary processor input.
 * Long-term memories are stable prompt context.
 */

import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { CHAT_MEMORY_DIR } from "../config/index.js";

export const MEMORY_CATEGORIES = new Set([
    "profile",
    "preference",
    "goal",
    "routine",
    "emotional_context",
    "temporary",
    "project",
    "fitness",
    "other",
]);

const LONG_TERM_CATEGORIES = new Set(
    [...MEMORY_CATEGORIES].filter((category) => category !== "temporary"),
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const memoryRoot = path.join(__dirname, "..", "..", CHAT_MEMORY_DIR);
const SMART_MEMORY_DIR = path.join(memoryRoot, "smart");

function nowIso() {
    return new Date().toISOString();
}

function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function normalizeCategory(category, allowTemporary = true) {
    const fallback = "other";
    if (!category || typeof category !== "string") return fallback;
    const normalized = category.trim().toLowerCase();
    const allowed = allowTemporary ? MEMORY_CATEGORIES : LONG_TERM_CATEGORIES;
    return allowed.has(normalized) ? normalized : fallback;
}

function normalizeStatus(status, allowed, fallback) {
    if (!status || typeof status !== "string") return fallback;
    const normalized = status.trim().toLowerCase();
    return allowed.has(normalized) ? normalized : fallback;
}

function normalizeImportance(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0.5;
    return Math.min(Math.max(parsed, 0), 1);
}

function contentHash(content) {
    return crypto
        .createHash("sha256")
        .update(content.toLowerCase().trim())
        .digest("hex");
}

function createId(prefix, content) {
    const hash = contentHash(`${content}:${Date.now()}:${Math.random()}`);
    return `${prefix}_${hash.slice(0, 12)}`;
}

function canonicalContent(content) {
    return String(content || "")
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ");
}

function isSameMemory(a, b) {
    const first = canonicalContent(a);
    const second = canonicalContent(b);
    if (!first || !second) return false;
    return first === second || first.includes(second) || second.includes(first);
}

async function readJsonArray(filePath) {
    if (!existsSync(filePath)) return [];
    try {
        const raw = await fs.readFile(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`❌ Could not read memory file ${filePath}:`, error.message);
        return [];
    }
}

async function writeJsonArray(filePath, entries) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(entries, null, 2), "utf-8");
}

function normalizeShortTerm(entry) {
    const createdAt = entry.createdAt || entry.timestamp || nowIso();
    const expiresAt =
        entry.expiresAt || addDays(new Date(createdAt), 14).toISOString();
    return {
        id: entry.id || createId("stm", entry.content || ""),
        content: String(entry.content || "").trim(),
        createdAt,
        expiresAt,
        importance: normalizeImportance(entry.importance),
        category: normalizeCategory(entry.category, true),
        status: normalizeStatus(
            entry.status,
            new Set(["active", "promoted", "expired", "archived"]),
            "active",
        ),
        source: entry.source || "chat",
        metadata: entry.metadata && typeof entry.metadata === "object"
            ? entry.metadata
            : {},
    };
}

function normalizeLongTerm(entry) {
    const createdAt = entry.createdAt || entry.timestamp || nowIso();
    return {
        id: entry.id || createId("ltm", entry.content || ""),
        content: String(entry.content || "").trim(),
        createdAt,
        updatedAt: entry.updatedAt || createdAt,
        importance: normalizeImportance(entry.importance),
        category: normalizeCategory(entry.category, false),
        status: normalizeStatus(entry.status, new Set(["active", "archived"]), "active"),
        sourceMemoryIds: Array.isArray(entry.sourceMemoryIds)
            ? entry.sourceMemoryIds
            : [],
    };
}

export class MemoryService {
    constructor(chatId) {
        this.chatId = String(chatId);
        this.chatDir = path.join(memoryRoot, this.chatId);
        this.shortTermPath = path.join(this.chatDir, "memory-short-term.json");
        this.longTermPath = path.join(this.chatDir, "memory-long-term.json");
        this.legacySmartPath = path.join(
            SMART_MEMORY_DIR,
            this.chatId,
            "longterm_smart.json",
        );
    }

    async ensureDirectory() {
        await fs.mkdir(this.chatDir, { recursive: true });
    }

    async loadShortTermMemory() {
        const entries = await readJsonArray(this.shortTermPath);
        return entries
            .map(normalizeShortTerm)
            .filter((entry) => entry.content);
    }

    async saveShortTermMemory(entries) {
        await writeJsonArray(
            this.shortTermPath,
            entries.map(normalizeShortTerm).filter((entry) => entry.content),
        );
    }

    async loadLongTermMemory() {
        const entries = await readJsonArray(this.longTermPath);
        if (entries.length > 0 || !existsSync(this.legacySmartPath)) {
            return entries
                .map(normalizeLongTerm)
                .filter((entry) => entry.content);
        }

        const legacyEntries = await readJsonArray(this.legacySmartPath);
        const migrated = legacyEntries
            .map((entry) =>
                normalizeLongTerm({
                    id: entry.id ? `ltm_${entry.id}` : undefined,
                    content: entry.content,
                    createdAt: entry.timestamp,
                    updatedAt: entry.timestamp,
                    importance: entry.importance,
                    category: "other",
                    status: "active",
                    sourceMemoryIds: [],
                }),
            )
            .filter((entry) => entry.content);

        if (migrated.length > 0) {
            await this.saveLongTermMemory(migrated);
        }

        return migrated;
    }

    async saveLongTermMemory(entries) {
        await writeJsonArray(
            this.longTermPath,
            entries.map(normalizeLongTerm).filter((entry) => entry.content),
        );
    }

    async addShortTermMemory({
        content,
        importance = 0.5,
        category = "other",
        source = "chat",
        metadata = {},
        ttlDays = 14,
    }) {
        const cleanContent = String(content || "").trim();
        if (!cleanContent) return false;

        const entries = await this.loadShortTermMemory();
        const duplicate = entries.some(
            (entry) =>
                entry.status === "active" && isSameMemory(entry.content, cleanContent),
        );
        if (duplicate) return false;

        const createdAt = nowIso();
        entries.push(
            normalizeShortTerm({
                id: createId("stm", cleanContent),
                content: cleanContent,
                createdAt,
                expiresAt: addDays(new Date(createdAt), ttlDays).toISOString(),
                importance,
                category,
                status: "active",
                source,
                metadata,
            }),
        );

        await this.saveShortTermMemory(entries);
        return true;
    }

    async addOrMergeLongTermMemory({
        content,
        importance = 0.5,
        category = "other",
        sourceMemoryIds = [],
    }) {
        const cleanContent = String(content || "").trim();
        if (!cleanContent) return { added: false, merged: false };

        const entries = await this.loadLongTermMemory();
        const now = nowIso();
        const existing = entries.find(
            (entry) =>
                entry.status === "active" &&
                (entry.category === normalizeCategory(category, false) ||
                    isSameMemory(entry.content, cleanContent)) &&
                isSameMemory(entry.content, cleanContent),
        );

        if (existing) {
            existing.content =
                cleanContent.length < existing.content.length
                    ? cleanContent
                    : existing.content;
            existing.importance = Math.max(
                normalizeImportance(existing.importance),
                normalizeImportance(importance),
            );
            existing.updatedAt = now;
            existing.category = normalizeCategory(category, false);
            existing.sourceMemoryIds = [
                ...new Set([
                    ...existing.sourceMemoryIds,
                    ...sourceMemoryIds.filter(Boolean),
                ]),
            ];
            await this.saveLongTermMemory(entries);
            return { added: false, merged: true, entry: existing };
        }

        const entry = normalizeLongTerm({
            id: createId("ltm", cleanContent),
            content: cleanContent,
            createdAt: now,
            updatedAt: now,
            importance,
            category,
            status: "active",
            sourceMemoryIds,
        });
        entries.push(entry);
        await this.saveLongTermMemory(entries);
        return { added: true, merged: false, entry };
    }

    async getLongTermMemory(limit = 50) {
        const entries = await this.loadLongTermMemory();
        return entries
            .filter((entry) => entry.status === "active")
            .sort((a, b) => {
                const importanceDiff =
                    (b.importance || 0) - (a.importance || 0);
                if (importanceDiff !== 0) return importanceDiff;
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            })
            .slice(0, limit);
    }

    async getLongTermMemoryForPrompt(limit = 30) {
        const entries = await this.getLongTermMemory(limit);
        if (entries.length === 0) return "";

        const groups = new Map();
        for (const entry of entries) {
            if (!groups.has(entry.category)) groups.set(entry.category, []);
            groups.get(entry.category).push(entry);
        }

        return [...groups.entries()]
            .map(([category, items]) => {
                const label = category.replace(/_/g, " ");
                const lines = items.map((entry) => `- ${entry.content}`);
                return `${label}:\n${lines.join("\n")}`;
            })
            .join("\n\n");
    }

    async getLongTermStats() {
        const entries = await this.loadLongTermMemory();
        const active = entries.filter((entry) => entry.status === "active");
        const averageImportance =
            active.length > 0
                ? (
                      active.reduce(
                          (sum, entry) => sum + (entry.importance || 0),
                          0,
                      ) / active.length
                  ).toFixed(2)
                : "0.00";

        return {
            totalEntries: active.length,
            averageImportance,
        };
    }

    async updateLongTermMemory(memoryId, newContent) {
        const entries = await this.loadLongTermMemory();
        const entry = entries.find((item) => item.id === memoryId);
        if (!entry || !newContent?.trim()) return false;
        entry.content = newContent.trim();
        entry.updatedAt = nowIso();
        await this.saveLongTermMemory(entries);
        return true;
    }

    async deleteLongTermMemory(memoryId) {
        const entries = await this.loadLongTermMemory();
        const entry = entries.find((item) => item.id === memoryId);
        if (!entry) return false;
        entry.status = "archived";
        entry.updatedAt = nowIso();
        await this.saveLongTermMemory(entries);
        return true;
    }

    async clearLongTermMemory() {
        const entries = await this.loadLongTermMemory();
        const now = nowIso();
        for (const entry of entries) {
            entry.status = "archived";
            entry.updatedAt = now;
        }
        await this.saveLongTermMemory(entries);
    }
}

export async function listMemoryChatIds() {
    if (!existsSync(memoryRoot)) return [];
    const entries = await fs.readdir(memoryRoot, { withFileTypes: true });
    return entries
        .filter((entry) => entry.isDirectory() && entry.name !== "smart")
        .map((entry) => entry.name);
}

export function getMemoryService(chatId) {
    return new MemoryService(chatId);
}
