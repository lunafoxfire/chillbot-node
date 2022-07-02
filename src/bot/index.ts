import { Client, ClientOptions, Intents } from 'discord.js';
import path from 'path';
import glob from 'glob';
import { createLogger } from 'util/logger';
import { borderedText } from 'util/string/decoration';
import MessageHandler from './components/MessageHandler';

const MODULES_DIR = './modules';

export default class Bot {
  public static client: Client;
  public static logger = createLogger('bot');

  public static async init() {
    await Bot.importCommands();
    Bot.createClient();
    await Bot.login();
    MessageHandler.init();
    Bot.showStartupMessage();
    Bot.client.user?.setActivity('!help for commands');
  }

  public static getName(): string {
    return Bot.client.user?.username || 'Chillbot';
  }

  private static createClient() {
    // https://discord.com/developers/docs/topics/gateway#list-of-intents
    const intents = new Intents(['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS']);
    const options: ClientOptions = {
      intents,
      partials: ['CHANNEL'],
    };
    Bot.client = new Client(options);
  }

  private static async login() {
    return new Promise<void>((resolve, reject) => {
      Bot.client.login(process.env.BOT_TOKEN)
        .catch((e) => reject(e));
      Bot.client.on('ready', () => resolve());
    });
  }

  private static showStartupMessage() {
    const initMessage = borderedText([
      'Chillbot Activated',
      `env: ${process.env.NODE_ENV}`,
    ], '=');
    const readyMessageLines = [
      initMessage,
      `Logged in as ${Bot.client.user?.tag}!`,
      'Connected to the following servers:',
    ];
    Bot.client.guilds.cache.forEach((guild) => {
      readyMessageLines.push(`  ${guild.name}`);
    });
    Bot.logger.info(`\n${readyMessageLines.join('\n')}\n`);
  }

  private static async importCommands() {
    const files = glob.sync(`${path.join(__dirname, MODULES_DIR)}/**/*.ts`);
    await Promise.all(files.map((file) => import(file)));
    MessageHandler.finalizeCommandRegistration();
  }
}
