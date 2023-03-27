import { Client, Events, GatewayIntentBits, Partials, REST } from 'discord.js';
import { isDev } from 'util/env';
import { createLogger } from 'util/logger';
import { borderedText } from 'util/string/decoration';
import AdminCommandHandler from 'bot/admin-commands/AdminCommandHandler';
import SlashCommandHandler from 'bot/slash-commands/SlashCommandHandler';
import ReactionHandler from 'bot/reactions/ReactionHandler';

export default class Bot {
  public static client: Client = this.createClient();
  public static restAPI = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN || '');
  public static logger = createLogger('bot');
  public static isDev = isDev;

  public static async init() {
    await AdminCommandHandler.init();
    await SlashCommandHandler.init();
    await ReactionHandler.init();
    await self.login();
    self.showStartupMessage();
    self.client.user?.setActivity('slash commands!');
  }

  public static getName(): string {
    return self.client.user?.username || 'Chillbot';
  }

  private static createClient(): Client {
    // https://discord.com/developers/docs/topics/gateway#list-of-intents
    return new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
      ],
      partials: [
        Partials.Channel,
      ],
    });
  }

  private static async login() {
    self.logger.info('Logging in...');
    return new Promise<void>((resolve, reject) => {
      self.client.login(process.env.BOT_TOKEN)
        .catch((e) => { reject(e); });
      self.client.on(Events.ClientReady, () => { resolve(); });
    });
  }

  private static showStartupMessage() {
    const initMessage = borderedText([
      'Chillbot Activated',
      `env: ${process.env.NODE_ENV}`,
    ], '=');
    const readyMessageLines = [
      initMessage,
      `Logged in as ${self.client.user?.tag}!`,
      'Connected to the following servers:',
    ];
    self.client.guilds.cache.forEach((guild) => {
      readyMessageLines.push(`  ${guild.name}`);
    });
    self.logger.info(`\n${readyMessageLines.join('\n')}\n`);
  }
}

const self = Bot;
