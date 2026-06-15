/**
 * Owner authentication middleware
 */

import { BOT_PRIVATE, OWNER_ID } from "../../config/index.js";

export function isOwner(ctx) {
    return !BOT_PRIVATE || Number(ctx.from?.id) === OWNER_ID;
}

export async function replyNotOwner(ctx, isCallback = false) {
    if (isCallback && typeof ctx.answerCbQuery === "function") {
        await ctx.answerCbQuery("you are not my owner :P");
        return;
    }
    await ctx.reply("you are not my owner :P");
}
