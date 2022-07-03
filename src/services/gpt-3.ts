import Bot from 'bot';
import { Message } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';
import { createLogger } from 'util/logger';

const logger = createLogger('GPT3');

const PROMPT_PREFIX = 'The following is a casual Discord conversation with my AI friend %b and %u. %b is very friendly, creative, and quirky, and a bit unpredictable. %b always has a laid-back attitude and talks very casually and informally to their friends. %b is very thoughtful and has strong opinions, and always gives very specific answers to questions. %b has the last entry in the conversation.';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateGPT3Completion(context: Message[]): Promise<string> {
  const preparedContext = prepareContext(context);

  const userlist = contextToUserlistPart(preparedContext);
  const conversation = contextToConversationPart(preparedContext);
  const prompt = `${PROMPT_PREFIX.replaceAll('%b', Bot.getName()).replace('%u', userlist)}\n\n${conversation}`;

  logger.debug(`==== PROMPT ====\n${prompt}`);

  const response = await openai.createCompletion({
    model: 'text-curie-001',
    prompt,
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.7,
    presence_penalty: 0.5,
    stop: ['\n\n'],
  });
  return response.data?.choices?.[0].text || '';
}

function prepareContext(context: Message[]): Message[] {
  if (process.env.NODE_ENV !== 'development') {
    return context;
  }
  const preparedContext: Message[] = [];
  for (let i = context.length - 1; i >= 0; i--) {
    const msg = context[i];
    if (msg.content === 'CONTEXT_CUTOFF') {
      break;
    }
    preparedContext.push(msg);
  }
  preparedContext.reverse();
  return preparedContext;
}

function contextToUserlistPart(context: Message[]): string {
  const usernames: string[] = [];
  context.forEach((msg) => {
    if (msg.author !== Bot.client.user) {
      const parsedName = `"${msg.author.username}"`;
      if (!usernames.includes(parsedName)) {
        usernames.push(parsedName);
      }
    }
  });
  if (usernames.length === 0) {
    return 'another user';
  }
  if (usernames.length === 1) {
    return `a user named ${usernames[0]}`;
  }
  if (usernames.length === 2) {
    return `${usernames.length} users, named ${usernames[0]} and ${usernames[1]}`;
  }
  const lastName = usernames.pop();
  return `${usernames.length} users, named ${usernames.join(', ')}, and ${lastName}`;
}

function contextToConversationPart(context: Message[]): string {
  const messages: string[] = [];
  for (let i = 0; i < context.length; i++) {
    const prevMsg = i > 0 ? context[i - 1] : null;
    const msg = context[i];
    if (!prevMsg || prevMsg.author !== msg.author) {
      messages.push(`${msg.author.username}:\n${msg.cleanContent}`);
    } else {
      messages[messages.length - 1] += `\n${msg.cleanContent}`;
    }
  }
  return `${messages.join('\n\n')}\n\n${Bot.getName()}:\n`;
}
