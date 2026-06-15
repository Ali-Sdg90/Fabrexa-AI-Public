#!/usr/bin/env node

import { processAllMemories } from "../src/memory/processor.js";

try {
    const result = await processAllMemories();
    if (result?.skipped) {
        console.log(`Memory processing skipped: ${result.reason}`);
        process.exit(0);
    }
    console.log("Memory processing completed.");
} catch (error) {
    console.error("Memory processing failed:", error.message);
    process.exit(1);
}
