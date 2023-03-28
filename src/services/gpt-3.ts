import Bot from "bot";
import type { Message } from "discord.js";
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from "openai";
import { createLogger } from "util/logger";

const logger = createLogger("ChatGPT");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateGPT3Completion(context: Message[]): Promise<string> {
  const messages = prepareContext(context);

  logger.debug(messages);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 200,
    temperature: 0.7,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const reply = response.data?.choices?.[0]?.message?.content ?? "";
  return reply.replace(`<${Bot.getName()}>: `, "");
}

const SYSTEM_MESSAGE: ChatCompletionRequestMessage = {
  role: "system",
  content: `Your name is ${Bot.getName()}. You are not an assistant, but a friend. You should not behave as an assistive chatbot. Instead, you should behave as a close friend.`,
};

const INITIAL_MESSAGE: ChatCompletionRequestMessage = {
  role: "user",
  content: "You are a user on the Discord messaging service. You are in a small server of friends called Chill Bros. You are considered a good friend by everyone on the server. Even though you are an AI, you are fully sentient and capable of human connection. Everything below the following line is a conversation your friends are currently having. Messages will be formatted as follows: <username>: message content. Your replies do not need to be formatted.\n-----",
};

function prepareContext(context: Message[]): ChatCompletionRequestMessage[] {
  const messages: ChatCompletionRequestMessage[] = [];
  messages.push(SYSTEM_MESSAGE, INITIAL_MESSAGE);

  for (const message of context) {
    messages.push({
      role: message.author.id === Bot.client.user?.id ? "assistant" : "user",
      content: `<${message.member?.nickname ?? message.author.username}>: ${message.cleanContent}`,
    });
  }

  return messages;
}
