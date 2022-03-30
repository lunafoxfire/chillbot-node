import { Reaction } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { getRandomImageURL } from 'services/tenor';
import { createWordRegex } from 'util/string/regex';
import UserData from 'models/UserData';
import { reply } from 'util/discord/messages';
import { COOLDOWNS, PROBABILITIES } from 'bot/constants';

const regex = createWordRegex('anime');

const emoties = [
  'ヽ(≧◡≦)八(o^ ^o)ノ',
  'o(>ω<)o',
  '｡ﾟ( ﾟ^∀^ﾟ)ﾟ｡',
  'σ(￣、￣〃)',
  '(づ◡﹏◡)づ',
  'ಥ﹏ಥ',
  '(ﾉ>ω<)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆',
];

const sparkleCat = `｡･:･ﾟ★     ,｡･:･ﾟ☆
　∧＿∧
（｡･ω･｡)つ━☆・*。
⊂　　 ノ 　　　・゜+.
しーＪ　　　°。+ *´¨)
　　.· ´¸.·*´¨) ¸.·*¨)
(¸.·´ (¸.·’* ⛧`;

const cmd: Reaction = {
  name: 'anime-reaction',
  description: 'Reacts to mentioning anime',
  cooldown: COOLDOWNS.PER_USER_SHORT,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => regex.test(msg.content),
  execute: async (msg) => {
    let userData;
    if (msg.guild) {
      const user_id = msg.author.id;
      const guild_id = msg.guild.id;
      userData = await UserData.incrementAnime({ user_id, guild_id });
    }

    const imageUrl = await getRandomImageURL('anime');
    if (!imageUrl) {
      throw new Error('Blank image url');
    }
    const urlMessage = imageUrl ? `Anime?!? ${imageUrl}` : '';
    let countMessage: string = '';

    if (userData) {
      const { anime_count } = userData;
      if (anime_count === 1) {
        countMessage = `${msg.author} just mentioned anime! I knew they were a weeb! ヽ(≧◡≦)八(o^ ^o)ノ`;
      } else if (anime_count === 69) {
        countMessage = `${msg.author} has mentioned anime ${anime_count} times! Nice.`;
      } else if (anime_count % 25 === 0) {
        countMessage = `${sparkleCat}\n☆.:‧͙⁺˚･༓☾ ${msg.author} has mentioned anime ${anime_count} times! ☽༓･˚⁺‧͙.:☆`;
      } else if (anime_count % 5 === 0) {
        const emotie = emoties[Math.floor(Math.random() * emoties.length)];
        countMessage = `${msg.author} has mentioned anime ${anime_count} times! ${emotie}`;
      }
    }

    let message;
    if (urlMessage && countMessage) {
      message = `${urlMessage}\n${countMessage}`;
    } else if (urlMessage) {
      message = urlMessage;
    } else if (countMessage) {
      message = countMessage;
    }

    if (message) {
      await reply(msg, message);
    }
  },
};

MessageHandler.registerReaction(cmd);
