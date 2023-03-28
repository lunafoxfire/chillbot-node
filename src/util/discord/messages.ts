import type { Message } from "discord.js";
import { wait } from "util/timer";

const TYPING_TIME = 600;

export async function sendTyping(msg: Message): Promise<void> {
  await msg.channel.sendTyping();
  await wait(TYPING_TIME);
}
