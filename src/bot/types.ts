import { Message, PermissionResolvable } from 'discord.js';

export interface BotBehavior {
  name: string,
  description: string,
}

export interface Argument {
  name: string,
  description: string,
  optional?: boolean,
  errorMessage?: string,
}

export enum ArgumentType {
  None,
  FullString,
  ArgumentList,
}

type ArgDef<ArgType> = ArgType extends ArgumentType.FullString ? Argument
  : ArgType extends ArgumentType.ArgumentList ? Argument[]
    : undefined;

type ArgVal<ArgType> = ArgType extends ArgumentType.FullString ? string
  : ArgType extends ArgumentType.ArgumentList ? string[]
    : undefined;

export interface Command<ArgType = ArgumentType.None | ArgumentType.FullString | ArgumentType.ArgumentList> extends BotBehavior {
  name: string,
  aliases?: string[],
  description: string,
  args: ArgDef<ArgType>,
  guildOnly?: boolean,
  chillBrosOnly?: boolean,
  ownerOnly?: boolean,
  requireUserPermissions?: PermissionResolvable,
  requireBotPermissions?: PermissionResolvable,
  execute: (msg: Message, args: ArgVal<ArgType>) => Promise<void>,
}

export interface Reaction extends BotBehavior {
  name: string,
  description: string,
  test: (msg: Message) => boolean,
  execute: (msg: Message) => Promise<void>,
}

// TODO scheduled behaviors
