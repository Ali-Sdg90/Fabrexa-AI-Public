#!/usr/bin/env node

/**
 * Fabrexa AI - Entry Point
 * This file bootstraps the bot from the modular src/ structure
 */

import { startBot } from "./src/bot/index.js";

// Start the bot
startBot().catch((error) => {
    console.error("Fatal error during bot startup:", error);
    process.exit(1);
});
