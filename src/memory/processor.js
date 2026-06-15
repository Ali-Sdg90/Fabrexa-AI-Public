/**
 * Cron-driven short-term to long-term memory processor.
 */

import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import {
    CHAT_MEMORY_DIR,
    MEMORY_PROCESSOR_CRON,
    MEMORY_PROCESSOR_TIMEZONE,
} from "../config/index.js";
import { getMemoryService, listMemoryChatIds } from "./memoryService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const memoryRoot = path.join(__dirname, "..", "..", CHAT_MEMORY_DIR);
const processorLockPath = path.join(memoryRoot, ".memory-processor.lock");

let processorRunning = false;
let schedulerTask = null;

const PROMOTABLE_CATEGORIES = new Set([
    "profile",
    "preference",
    "goal",
    "routine",
    "emotional_context",
    "project",
    "fitness",
]);

const TEMPORARY_PATTERNS = [
    /\btoday\b/i,
    /\btomorrow\b/i,
    /\btonight\b/i,
    /\byesterday\b/i,
    /\bthis morning\b/i,
    /\bthis evening\b/i,
    /\bthis weekend\b/i,
    /\bnext week\b/i,
    /\btemporary\b/i,
    /\bfor now\b/i,
];

function nowIso() {
    return new Date().toISOString();
}

function canonicalContent(content) {
    return String(content || "")
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, " ");
}

function isSimilar(a, b) {
    const first = canonicalContent(a);
    const second = canonicalContent(b);
    if (!first || !second) return false;
    if (first === second) return true;
    if (first.includes(second) || second.includes(first)) return true;

    const firstWords = new Set(first.split(" "));
    const secondWords = second.split(" ");
    const overlap = secondWords.filter((word) => firstWords.has(word)).length;
    return overlap / Math.max(firstWords.size, secondWords.length) >= 0.75;
}

function isTemporaryMemory(memory) {
    if (memory.category === "temporary") return true;
    return TEMPORARY_PATTERNS.some((pattern) => pattern.test(memory.content));
}

function hasLongTermDuplicate(memory, existingLongTerm) {
    return existingLongTerm.some(
        (entry) =>
            entry.status === "active" && isSimilar(entry.content, memory.content),
    );
}

function shouldPromote(memory, existingLongTerm) {
    if (memory.status !== "active") return false;
    if (!PROMOTABLE_CATEGORIES.has(memory.category)) return false;
    if (isTemporaryMemory(memory)) return false;
    if (memory.importance < 0.65) return false;
    if (memory.content.length < 12) return false;
    return !hasLongTermDuplicate(memory, existingLongTerm);
}

function createStableContent(memory) {
    return memory.content
        .replace(/\b(today|tomorrow|tonight|yesterday)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[.!?]+$/, "");
}

async function acquireLock() {
    if (processorRunning) return false;
    await fs.mkdir(memoryRoot, { recursive: true });

    if (existsSync(processorLockPath)) {
        try {
            const raw = await fs.readFile(processorLockPath, "utf-8");
            const lock = JSON.parse(raw);
            const ageMs = Date.now() - new Date(lock.startedAt).getTime();
            if (Number.isFinite(ageMs) && ageMs < 60 * 60 * 1000) {
                return false;
            }
        } catch {
            return false;
        }
    }

    processorRunning = true;
    await fs.writeFile(
        processorLockPath,
        JSON.stringify({ startedAt: nowIso() }, null, 2),
        "utf-8",
    );
    return true;
}

async function releaseLock() {
    processorRunning = false;
    try {
        await fs.rm(processorLockPath, { force: true });
    } catch {
        // Stale locks expire after one hour.
    }
}

async function notify(notifier, message) {
    if (typeof notifier === "function") {
        await notifier(message);
    }
}

export async function processChatMemory(chatId) {
    const memoryService = getMemoryService(chatId);
    const shortTerm = await memoryService.loadShortTermMemory();
    const longTerm = await memoryService.loadLongTermMemory();
    const now = new Date();

    let promoted = 0;
    let expired = 0;
    let archived = 0;
    let merged = 0;

    for (const memory of shortTerm) {
        if (memory.status !== "active") continue;

        const expiresAt = new Date(memory.expiresAt);
        const isExpired = Number.isFinite(expiresAt.getTime()) && expiresAt <= now;

        if (isExpired && memory.importance < 0.65) {
            memory.status = "expired";
            expired += 1;
            continue;
        }

        if (hasLongTermDuplicate(memory, longTerm)) {
            memory.status = "archived";
            archived += 1;
            continue;
        }

        if (!shouldPromote(memory, longTerm)) {
            if (isExpired || isTemporaryMemory(memory)) {
                memory.status = isExpired ? "expired" : "archived";
                if (!isExpired) archived += 1;
            }
            continue;
        }

        const stableContent = createStableContent(memory);
        const result = await memoryService.addOrMergeLongTermMemory({
            content: stableContent,
            importance: memory.importance,
            category: memory.category,
            sourceMemoryIds: [memory.id],
        });

        if (result.added) {
            longTerm.push(result.entry);
            promoted += 1;
        } else if (result.merged) {
            merged += 1;
        }

        memory.status = "promoted";
    }

    await memoryService.saveShortTermMemory(shortTerm);

    return {
        chatId,
        shortTermReviewed: shortTerm.length,
        promoted,
        merged,
        expired,
        archived,
    };
}

export async function processAllMemories({ notifier = null } = {}) {
    const locked = await acquireLock();
    if (!locked) {
        console.log("🧠 Memory processor already running; skipping.");
        return {
            skipped: true,
            reason: "processor already running",
        };
    }

    try {
        await notify(notifier, "🧠 Memory processing started.");
        console.log("🧠 Memory processing started.");

        const chatIds = await listMemoryChatIds();
        const results = [];
        for (const chatId of chatIds) {
            results.push(await processChatMemory(chatId));
        }

        const totals = results.reduce(
            (sum, result) => ({
                reviewed: sum.reviewed + result.shortTermReviewed,
                promoted: sum.promoted + result.promoted,
                merged: sum.merged + result.merged,
                expired: sum.expired + result.expired,
                archived: sum.archived + result.archived,
            }),
            { reviewed: 0, promoted: 0, merged: 0, expired: 0, archived: 0 },
        );

        const summary = `🧠 Memory processing finished. Chats: ${results.length}, reviewed: ${totals.reviewed}, promoted: ${totals.promoted}, merged: ${totals.merged}, expired: ${totals.expired}, archived: ${totals.archived}.`;
        console.log(summary);
        await notify(notifier, summary);

        return {
            skipped: false,
            results,
            totals,
        };
    } catch (error) {
        console.error("🧠❌ Memory processing failed:", error.message);
        await notify(notifier, `🧠❌ Memory processing failed: ${error.message}`);
        throw error;
    } finally {
        await releaseLock();
    }
}

export function startMemoryProcessorScheduler({ notifier = null } = {}) {
    if (schedulerTask) return schedulerTask;

    if (!cron.validate(MEMORY_PROCESSOR_CRON)) {
        throw new Error(
            `Invalid MEMORY_PROCESSOR_CRON value: ${MEMORY_PROCESSOR_CRON}`,
        );
    }

    schedulerTask = cron.schedule(
        MEMORY_PROCESSOR_CRON,
        () => {
            processAllMemories({ notifier }).catch((error) => {
                console.error(
                    "🧠❌ Scheduled memory processing failed:",
                    error.message,
                );
            });
        },
        {
            timezone: MEMORY_PROCESSOR_TIMEZONE,
        },
    );

    console.log(
        `🧠 Memory processor scheduled with cron "${MEMORY_PROCESSOR_CRON}" (${MEMORY_PROCESSOR_TIMEZONE}).`,
    );
    return schedulerTask;
}

export function stopMemoryProcessorScheduler() {
    if (!schedulerTask) return;
    schedulerTask.stop();
    schedulerTask = null;
}
