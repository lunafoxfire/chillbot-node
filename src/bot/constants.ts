import { Cooldown, CooldownType } from './types';

export const COOLDOWNS: { [key: string]: Cooldown } = {
  GLOBAL_LONG: { time: 60 * 60 * 4, type: CooldownType.Global },
  GLOBAL_STANDARD: { time: 60 * 10, type: CooldownType.Global },
  GLOBAL_SHORT: { time: 60, type: CooldownType.Global },
  PER_USER_SHORT: { time: 60, type: CooldownType.PerUser },
  PER_USER_MED: { time: 60 * 5, type: CooldownType.PerUser },
  PER_USER_LONG: { time: 60 * 30, type: CooldownType.PerUser },
};

export const PROBABILITIES: { [key: string]: number } = {
  NEVER: 0.0,
  RARE: 0.125,
  STANDARD: 0.333,
  ALWAYS: 1.0,
};
