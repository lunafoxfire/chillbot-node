import Bot from 'bot';
import { Message } from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';

const PROMPT_PREFIX = 'The following is a Discord conversation with an AI personality named %b. %b is funny, creative, clever, and friendly. The conversation involves %b and %u. %b has the last entry in the conversation.';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateGPT3Completion(context: Message[]): Promise<string> {
  const userlist = contextToUserlistPart(context);
  const conversation = contextToConversationPart(context);
  const prompt = `${PROMPT_PREFIX.replaceAll('%b', Bot.getName()).replace('%u', userlist)}\n\n${conversation}`;

  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt,
    temperature: 0.9,
    max_tokens: 150,
    top_p: 1,
    frequency_penalty: 0.15,
    presence_penalty: 0.25,
  });
  return response.data?.choices?.[0].text || '';
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
