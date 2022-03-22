import { Cooldown, CooldownType } from './types';

export const COOLDOWNS: { [key: string]: Cooldown } = {
  GLOBAL_LONG: { time: 60 * 10, type: CooldownType.Global },
  GLOBAL_SHORT: { time: 60 * 2.5, type: CooldownType.Global },
  GLOBAL_EXTRA_SHORT: { time: 30, type: CooldownType.Global },
  PER_USER_SHORT: { time: 10, type: CooldownType.PerUser },
};
