import { Channel, DMChannel, NewsChannel, PartialDMChannel, TextBasedChannel, TextChannel, ThreadChannel, VoiceChannel } from 'discord.js';

type UnknownTypeChannel = Channel | PartialDMChannel;
type GuildTextChannel = TextChannel | ThreadChannel | NewsChannel;

// wouldn't need all this if discord.js got their enum shit together
// to be fair to them though, Typescript enums are hot garbage
export const TEXT_CHANNEL_TYPES = [
  'DM',
  'GROUP_DM',
  'GUILD_TEXT',
  'GUILD_NEWS',
  'GUILD_NEWS_THREAD',
  'GUILD_PUBLIC_THREAD',
  'GUILD_PRIVATE_THREAD',
];

export const GUILD_TEXT_CHANNEL_TYPES = [
  'GUILD_TEXT',
  'GUILD_NEWS',
  'GUILD_NEWS_THREAD',
  'GUILD_PUBLIC_THREAD',
  'GUILD_PRIVATE_THREAD',
];

export const THREAD_CHANNEL_TYPES = [
  'GUILD_NEWS_THREAD',
  'GUILD_PUBLIC_THREAD',
  'GUILD_PRIVATE_THREAD',
];

export const DM_CHANNEL_TYPES = [
  'DM',
  'GROUP_DM',
];

export const VOICE_CHANNEL_TYPES = [
  'GUILD_VOICE',
  'GUILD_STAGE_VOICE',
];

export function isTextChannel(channel: UnknownTypeChannel): channel is TextBasedChannel {
  return TEXT_CHANNEL_TYPES.includes(channel.type);
}

export function isGuildTextChannel(channel: UnknownTypeChannel): channel is GuildTextChannel {
  return GUILD_TEXT_CHANNEL_TYPES.includes(channel.type);
}

export function isThreadChannel(channel: UnknownTypeChannel): channel is ThreadChannel {
  return THREAD_CHANNEL_TYPES.includes(channel.type);
}

export function isDMChannel(channel: UnknownTypeChannel): channel is DMChannel {
  return DM_CHANNEL_TYPES.includes(channel.type);
}

export function isVoiceChannel(channel: UnknownTypeChannel): channel is VoiceChannel {
  return VOICE_CHANNEL_TYPES.includes(channel.type);
}
