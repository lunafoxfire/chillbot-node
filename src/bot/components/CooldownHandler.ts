import { Message } from 'discord.js';
import { createLogger } from 'util/logger';
import { CooldownType, Reaction } from 'bot/types';

type PrevTriggerInfo = {
  timestamp: number,
};

type RecentReactionsMap = {
  [guildId: string]: {
    [reactionName: string]: {
      globalData: PrevTriggerInfo,
      userData: {
        [userId: string]: PrevTriggerInfo
      }
    }
  }
};

const logger = createLogger('CooldownHandler');

export default class CooldownHandler {
  private static recentReactions: RecentReactionsMap = {};

  public static checkCooldown(msg: Message, reaction: Reaction, setTimestamp: boolean): boolean {
    if (reaction.cooldown && msg.guild?.id) {
      const now = new Date().getTime();
      let prevTimestamp: number | undefined = undefined;
      let setInfo: Function | undefined = undefined;

      if (reaction.cooldown.type === CooldownType.Global) {
        prevTimestamp = CooldownHandler.recentReactions[msg.guild.id]?.[reaction.name]?.globalData?.timestamp;
        setInfo = () => { CooldownHandler.setGlobalTriggerInfo(msg.guild!.id, reaction.name, { timestamp: now }); };
      } else if (reaction.cooldown.type === CooldownType.PerUser) {
        prevTimestamp = CooldownHandler.recentReactions[msg.guild.id]?.[reaction.name]?.userData?.[msg.author.id]?.timestamp;
        setInfo = () => { CooldownHandler.setUserTriggerInfo(msg.guild!.id, reaction.name, msg.author.id, { timestamp: now }); };
      }

      if (prevTimestamp) {
        const timeRemaining = reaction.cooldown.time * 1000 - (now - prevTimestamp);
        if (timeRemaining > 0) {
          logger.debug(`Reaction rejected: ${reaction.name}. Cooldown remaining: ${(timeRemaining / 1000).toFixed(1)}s`);
          return false;
        }
      }
      if (setTimestamp && setInfo) {
        setInfo();
      }
    }
    return true;
  }

  private static setGlobalTriggerInfo(guildId: string, reactionName: string, triggerInfo: PrevTriggerInfo) {
    if (!CooldownHandler.recentReactions[guildId]) {
      CooldownHandler.recentReactions[guildId] = {};
    }
    if (!CooldownHandler.recentReactions[guildId][reactionName]) {
      (CooldownHandler.recentReactions[guildId][reactionName] as any) = { userData: {} };
    }
    CooldownHandler.recentReactions[guildId][reactionName].globalData = triggerInfo;
  }

  private static setUserTriggerInfo(guildId: string, reactionName: string, userId: string, triggerInfo: PrevTriggerInfo) {
    CooldownHandler.setGlobalTriggerInfo(guildId, reactionName, triggerInfo);
    CooldownHandler.recentReactions[guildId][reactionName].userData[userId] = triggerInfo;
  }
}
