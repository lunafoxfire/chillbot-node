/* eslint-disable no-irregular-whitespace */
import type { Reaction } from 'bot/types';
import ReactionHandler from '../ReactionHandler';
import { COOLDOWNS, PROBABILITIES } from '../constants';
import { createWordRegex } from 'util/string/regex';
import UserData from 'models/UserData';
import { getRandomImageURL } from 'services/tenor';
import { InternalError } from 'util/errors';

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
  name: 'anime',
  cooldown: COOLDOWNS.SHORT,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => {
    return regex.test(msg.content);
  },
  execute: async (msg) => {
    let userData;
    if (msg.guild) {
      const user_id = msg.author.id;
      const guild_id = msg.guild.id;
      userData = await UserData.incrementAnime({ user_id, guild_id });
    }

    const imageUrl = await getRandomImageURL('anime');
    if (!imageUrl) {
      throw new InternalError('Blank image url');
    }
    const urlMessage = imageUrl ? `Anime?!? ${imageUrl}` : '';
    let countMessage: string = '';

    if (userData) {
      const { anime_count } = userData;
      if (anime_count === 1) {
        countMessage = `${msg.author} just mentioned anime! I knew they were a weeb! ヽ(≧◡≦)八(o^ ^o)ノ`;
      } else if (anime_count === 69 || anime_count === 420) {
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
      await msg.reply(message);
    }
  },
};

ReactionHandler.register(cmd);
