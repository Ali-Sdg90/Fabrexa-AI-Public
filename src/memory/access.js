/**
 * Personality-level memory access rules.
 */

import { MEMORY_ENABLED_PERSONALITIES } from "../config/index.js";

const normalizedMemoryPersonalities = MEMORY_ENABLED_PERSONALITIES.map((value) =>
    value.toLowerCase(),
);
const MEMORY_PERSONALITY_KEYS = new Set(MEMORY_ENABLED_PERSONALITIES);
const MEMORY_PERSONALITY_NAMES = new Set(normalizedMemoryPersonalities);

export function hasMemoryAccess(personality) {
    if (!personality) return false;

    const key = String(personality.key || "").trim();
    const name = String(personality.name || "").trim().toLowerCase();

    return MEMORY_PERSONALITY_KEYS.has(key) || MEMORY_PERSONALITY_NAMES.has(name);
}

export function getMemoryAccessLabel() {
    return MEMORY_ENABLED_PERSONALITIES.length
        ? MEMORY_ENABLED_PERSONALITIES.join(", ")
        : "configured memory-enabled personalities";
}
