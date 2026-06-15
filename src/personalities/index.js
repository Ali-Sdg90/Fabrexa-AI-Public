/**
 * Personalities module
 * Exports loaded personalities
 */

import { loadPersonalities } from "./loader.js";

export const PERSONALITIES = loadPersonalities();
export const PERSONALITY_KEYS = Object.keys(PERSONALITIES);
