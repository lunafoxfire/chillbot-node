import { Events } from "discord.js";
import type { Message } from "discord.js";
import Bot from "bot/index";
import type { Reaction } from "bot/types";
import { createLogger } from "util/logger";
import { sendTyping } from "util/discord/messages";
import { importAllFromDirectory } from "util/import";

const REACTIONS_DIR = "./bot/reactions/modules";

type RecentReactionsMap = {
  [guildId: string]: {
    [userId: string]: {
      [reactionName: string]: {
        timestamp: number,
      },
    },
  },
};

export default class ReactionHandler {
  public static logger = createLogger("ReactionHandler");
  private static readonly reactions: Record<string, Reaction> = {};
  private static readonly recentReactions: RecentReactionsMap = {};

  public static async init() {
    await self.importReactions();
    Bot.client.on(Events.MessageCreate, self.handleMessage);
  }

  public static register(cmd: Reaction) {
    const name = cmd.name;
    if (!name) {
      self.logger.warn("Tried to register reaction with no name");
      return;
    }
    if (self.reactions[name]) {
      self.logger.warn(`Tried to register duplicate reaction: ${name}`);
      return;
    }
    self.reactions[name] = cmd;
    self.logger.info(`Registered reaction: ${name}`);
  }

  private static async handleMessage(msg: Message) {
    if (msg.author.bot) return;

    for (const [name, reaction] of Object.entries(self.reactions)) {
      if (reaction.test(msg)) {
        if (Math.random() >= reaction.probability) {
          self.logger.debug(`Reaction rejected: ${reaction.name}. Failed probability check.`);
          break;
        };
        const remainingCooldown = self.checkCooldown(msg, reaction);
        if (remainingCooldown > 0) {
          self.logger.debug(`Reaction rejected: ${reaction.name}. Cooldown remaining: ${(remainingCooldown / 1000).toFixed(1)}s.`);
          break;
        };
        try {
          self.logger.verbose(`Executing reaction ${name}`);
          if (!reaction.suppressTyping) {
            await sendTyping(msg);
          }
          await reaction.execute(msg);
          self.triggerCooldown(msg, reaction);
        } catch (error: any) {
          if (Bot.isDev) console.error(error);
        }
        break;
      }
    };
  }

  private static checkCooldown(msg: Message, reaction: Reaction): number {
    if (!reaction.cooldown || !msg.guild?.id) return 0;

    let timeRemaining = 0;
    const now = new Date().getTime();
    const prevTimestamp = self.recentReactions[msg.guild.id]?.[msg.author.id]?.[reaction.name]?.timestamp;

    if (prevTimestamp) {
      timeRemaining = reaction.cooldown * 1000 - (now - prevTimestamp);
      if (timeRemaining < 0) {
        timeRemaining = 0;
      }
    }

    return timeRemaining;
  }

  private static triggerCooldown(msg: Message, reaction: Reaction) {
    if (!reaction.cooldown || !msg.guild?.id) return;
    const now = new Date().getTime();

    if (!self.recentReactions[msg.guild.id]) {
      self.recentReactions[msg.guild.id] = {};
    }
    if (!self.recentReactions[msg.guild.id][msg.author.id]) {
      self.recentReactions[msg.guild.id][msg.author.id] = {};
    }
    self.recentReactions[msg.guild.id][msg.author.id][reaction.name] = {
      timestamp: now,
    };
  }

  private static async importReactions() {
    await importAllFromDirectory(REACTIONS_DIR);
  }
}

const self = ReactionHandler;
