import { Message, PermissionResolvable } from 'discord.js';

// ARGUMENT
export enum ArgumentType {
  None,
  FullString,
  ArgumentList,
}

export interface Argument {
  name: string,
  description: string,
  optional?: boolean,
  rest?: boolean,
}


// COOLDOWN
export enum CooldownType {
  Global,
  PerUser,
}

export interface Cooldown {
  time: number,
  type: CooldownType,
}


// BOT BEHAVIOR
type ArgDef<ArgType> = ArgType extends ArgumentType.FullString ? Argument
  : ArgType extends ArgumentType.ArgumentList ? Argument[]
    : undefined;

type ArgVal<ArgType> = ArgType extends ArgumentType.FullString ? string
  : ArgType extends ArgumentType.ArgumentList ? string[]
    : undefined;


export interface BotBehavior {
  name: string,
  description: string,
  priority?: number,
  suppressTyping?: boolean,
  execute: Function,
}

export interface Command<ArgType = ArgumentType.None | ArgumentType.FullString | ArgumentType.ArgumentList> extends BotBehavior {
  aliases?: string[],
  args: ArgDef<ArgType>,
  guildOnly?: boolean,
  chillBrosOnly?: boolean,
  ownerOnly?: boolean,
  requireUserPermissions?: PermissionResolvable,
  requireBotPermissions?: PermissionResolvable,
  requireUserRole?: string,
  requireBotRole?: string,
  execute: (msg: Message, args: ArgVal<ArgType>) => Promise<void>,
}

export interface Reaction extends BotBehavior {
  cooldown?: Cooldown,
  test: (msg: Message) => boolean,
  execute: (msg: Message) => Promise<void>,
}

// TODO scheduled behaviors
