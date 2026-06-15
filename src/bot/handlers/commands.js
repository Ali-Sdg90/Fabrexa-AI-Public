/**
 * Command handlers.
 */

import { isOwner, replyNotOwner } from "../middleware/ownerCheck.js";
import { quickKeyboard } from "../utils/keyboards.js";
import { OLLAMA_MODEL } from "../../config/index.js";

export function registerCommandHandlers(bot) {
    bot.command("start", async (ctx) => {
        if (!isOwner(ctx)) return replyNotOwner(ctx);

        const welcomeMessage = `👋 *Welcome to Fabrexa AI!*

🤖 *Local model:* \`${OLLAMA_MODEL}\`
🏠 *Powered by:* your local Ollama

Send me any message, question, idea, or late-night thought and I'll answer with your selected personality.

*Quick actions:*
🆕 New Chat - fresh conversation
⚙️ Change Personality - switch personality
📝 Show Memory - view saved memories

_Just type your message and let's go!_ 🚀`;

        await ctx.reply(welcomeMessage, {
            parse_mode: "Markdown",
            ...quickKeyboard,
        });
        console.log(`📝 User started bot: ${ctx.from.id}`);
    });
}
