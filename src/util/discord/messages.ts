import { Message, MessagePayload, ReplyMessageOptions } from 'discord.js';
import { wait } from 'util/timer';
import { botSpamChannels } from './constants';

const TRUNCATE_MSG = '\n---\n_<message truncated due to length>_';

const MAX_MESSAGE_LENGTH = 2000;
const DEFAULT_MESSAGE_LIMIT = 3;
const TYPING_TIME = 600;

export async function reply(msg: Message, messageOptions: string | MessagePayload | ReplyMessageOptions): Promise<Message> {
  if (typeof messageOptions === 'string') {
    // eslint-disable-next-line no-param-reassign
    messageOptions = truncateMessage(messageOptions);
    return msg.reply(messageOptions);
  }

  if (typeof messageOptions === 'object') {
    const asPayload = messageOptions as MessagePayload;
    if (asPayload.options && asPayload.options.content) {
      asPayload.options.content = truncateMessage(asPayload.options.content);
      return msg.reply(asPayload);
    }

    const asMessageOptions = messageOptions as ReplyMessageOptions;
    if (asMessageOptions.content) {
      asMessageOptions.content = truncateMessage(asMessageOptions.content);
      return msg.reply(asMessageOptions);
    }
  }

  return msg.reply(messageOptions);
}

export async function multiPageReply(msg: Message, content: string, maxMessages: number = DEFAULT_MESSAGE_LIMIT, overrideSpamRestrictions: boolean = false): Promise<Message[]> {
  let pageLimit = 1;
  if (botSpamChannels.includes(msg.channel.id) || process.env.NODE_ENV === 'development') {
    pageLimit = maxMessages;
  }

  const pages = paginateMessage(content, pageLimit);
  const messages: Message[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i === 0) {
      messages[i] = await msg.reply(pages[i]);
    } else {
      messages[i] = await msg.channel.send(pages[i]);
    }
  }
  return messages;
}

export async function sendTyping(msg: Message): Promise < void> {
  await msg.channel.sendTyping();
  await wait(TYPING_TIME);
}

function truncateMessage(content: string): string {
  if (content.length > MAX_MESSAGE_LENGTH) {
    let newContent = content.substring(0, MAX_MESSAGE_LENGTH - TRUNCATE_MSG.length);
    newContent += TRUNCATE_MSG;
    return newContent;
  }
  return content;
}

function paginateMessage(content: string, maxMessages: number): string[] {
  const pages: string[] = [];

  for (let i = 0; i < maxMessages; i++) {
    const start = MAX_MESSAGE_LENGTH * i;
    const end = MAX_MESSAGE_LENGTH * (i + 1);
    if (start >= content.length) {
      break;
    }
    if (i === maxMessages - 1) {
      pages[i] = truncateMessage(content.substring(start));
    } else {
      pages[i] = content.substring(start, end);
    }
  }

  return pages;
}
