import { Message, MessageOptions, MessagePayload, ReplyMessageOptions } from 'discord.js';
import { wait } from 'util/timer';

// TODO: add this to guild config
const BOT_SPAM_CHANNEL = '606703714027175936';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_SPAM_MESSAGES = 3;

export async function basicReply(msg: Message, options: string | MessagePayload | ReplyMessageOptions): Promise<Message> {
  if (typeof options === 'string') {
    // eslint-disable-next-line no-param-reassign
    options = truncateMessage(options);
    return msg.reply(options);
  }

  if (typeof options === 'object') {
    const asPayload = options as MessagePayload;
    if (asPayload.options && asPayload.options.content) {
      asPayload.options.content = truncateMessage(asPayload.options.content);
      return msg.reply(asPayload);
    }

    const asMessageOptions = options as ReplyMessageOptions;
    if (asMessageOptions.content) {
      asMessageOptions.content = truncateMessage(asMessageOptions.content);
      return msg.reply(asMessageOptions);
    }
  }

  return msg.reply(options);
}

// export async function typingReply(msg: Message, content: string) {
//   console.log('TYPE');
//   await msg.channel.sendTyping();
//   await wait(10);
//   console.log('SEND');
//   await msg.reply(content);
// }

function truncateMessage(content: string): string {
  if (content.length > 2000) {
    let newContent = content.substring(0, 1800);
    newContent += '\n<message truncated due to length>';
    return newContent;
  }
  return content;
}
