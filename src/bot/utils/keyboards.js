/**
 * Keyboard builders for Telegram bot UI.
 */

import { PERSONALITIES } from "../../personalities/index.js";

export const BUTTONS = {
    newChat: "🆕 New Chat",
    changePersonality: "⚙️ Change Personality",
    showMemory: "📝 Show Memory",
};

export const mainMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: BUTTONS.newChat, callback_data: "new_chat" }],
            [
                {
                    text: BUTTONS.changePersonality,
                    callback_data: "configure_personality",
                },
            ],
            [{ text: BUTTONS.showMemory, callback_data: "show_memory" }],
        ],
    },
};

export const quickKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: BUTTONS.newChat }],
            [{ text: BUTTONS.changePersonality }],
            [{ text: BUTTONS.showMemory }],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
    },
};

export function buildPersonalityMenu() {
    const inline = Object.entries(PERSONALITIES)
        .map(([key, value]) => [
            {
                text: `${value.name}`,
                callback_data: `set_personality_${key}`,
            },
        ]);

    return {
        reply_markup: {
            inline_keyboard: inline,
        },
    };
}

export function buildMemoryKeyboard(memoryEntries) {
    const rows = memoryEntries.map((entry, idx) => [
        {
            text: `✏️ Edit ${idx + 1}`,
            callback_data: `memory_edit_${entry.id}`,
        },
        {
            text: `🗑️ Delete ${idx + 1}`,
            callback_data: `memory_delete_${entry.id}`,
        },
    ]);

    if (rows.length > 0) {
        rows.push([{ text: "🔄 Refresh", callback_data: "show_memory" }]);
    }

    return {
        reply_markup: {
            inline_keyboard: rows,
        },
    };
}
