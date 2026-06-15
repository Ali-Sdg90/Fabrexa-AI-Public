/**
 * Quick action handlers for reply keyboard buttons.
 */

import { isOwner, replyNotOwner } from "../middleware/ownerCheck.js";
import {
    BUTTONS,
    quickKeyboard,
    buildPersonalityMenu,
    buildMemoryKeyboard,
} from "../utils/keyboards.js";
import {
    createNewChatSession,
    loadSmartMemory,
    getMemoryStats,
    getChatState,
} from "../../memory/index.js";
import { PERSONALITIES } from "../../personalities/index.js";
import { getMemoryAccessLabel, hasMemoryAccess } from "../../memory/access.js";

async function getCurrentPersonality(chatId) {
    const chatState = await getChatState(chatId);
    return (
        PERSONALITIES[chatState.personality] ||
        PERSONALITIES[Object.keys(PERSONALITIES)[0]]
    );
}

async function requireMemoryAccess(ctx) {
    const personality = await getCurrentPersonality(ctx.chat.id);
    if (hasMemoryAccess(personality)) {
        return true;
    }

    await ctx.reply(
        `🧠 Memory is only enabled for ${getMemoryAccessLabel()}. Current personality: ${personality.name}.`,
    );
    return false;
}

function formatMemoryList(memoryEntries) {
    if (!memoryEntries.length) {
        return "No long-term memories saved yet.";
    }

    return memoryEntries
        .map((entry, idx) => {
            const timestamp = entry.updatedAt || entry.createdAt || "unknown time";
            const displayTime = timestamp.replace("T", " ").replace("Z", "");
            const importance =
                typeof entry.importance === "number"
                    ? entry.importance.toFixed(2)
                    : "0.00";
            const content = entry.content || "";
            return `• ${idx + 1}. [${displayTime}] ${entry.category || "other"} | importance ${importance} — ${content.substring(0, 120)}${
                content.length > 120 ? "..." : ""
            }`;
        })
        .join("\n");
}

export function registerQuickActionHandlers(bot) {
    bot.hears([BUTTONS.newChat, "New Chat"], async (ctx) => {
        if (!isOwner(ctx)) return replyNotOwner(ctx);
        await createNewChatSession(ctx.chat.id);
        await ctx.reply("✨ New chat session created.", quickKeyboard);
    });

    bot.hears(
        [BUTTONS.changePersonality, "Change Personality"],
        async (ctx) => {
            if (!isOwner(ctx)) return replyNotOwner(ctx);
            await ctx.reply(
                "🎭 Choose a personality for this chat:",
                buildPersonalityMenu(),
            );
        },
    );

    bot.hears([BUTTONS.showMemory, "Show Memory"], async (ctx) => {
        if (!isOwner(ctx)) return replyNotOwner(ctx);
        if (!(await requireMemoryAccess(ctx))) return;

        const memStats = await getMemoryStats(ctx.chat.id);
        const memoryEntries = await loadSmartMemory(ctx.chat.id, [], 10);

        const memoryInfo = `📊 Long-Term Memory Stats:
• Total entries: ${memStats.totalEntries}
• Average importance: ${memStats.averageImportance}

🧠 Stored long-term memories:
${formatMemoryList(memoryEntries)}`;

        await ctx.reply(memoryInfo, buildMemoryKeyboard(memoryEntries));
    });
}
