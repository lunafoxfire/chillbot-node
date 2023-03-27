import type { Reaction } from 'bot/types';
import ReactionHandler from '../ReactionHandler';
import { COOLDOWNS, PROBABILITIES } from '../constants';
import { emojiIds } from 'util/discord/constants';
import { createMultiWordRegex } from 'util/string/regex';

const fucks = [
  'fuck',
  'fucked',
  'fucker',
  'fuckin',
  'fucking',
  'fucks',
  'motherfucker',
  'motherfuckin',
  'motherfucking',
];

const shits = [
  'shit',
  'shits',
  'shitting',
  'shitty',
  'bullshit',
];

const asses = [
  'ass',
  'asses',
];

const fuckRegex = createMultiWordRegex(fucks);
const shitRegex = createMultiWordRegex(shits);
const assRegex = createMultiWordRegex(asses);

const fuckCmd: Reaction = {
  name: 'fuck-detector',
  suppressTyping: true,
  cooldown: COOLDOWNS.SHORT,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => fuckRegex.test(msg.content),
  execute: async (msg) => {
    await msg.react('❌');
    await msg.react('🇫');
    await msg.react('🇺');
    await msg.react('🇨');
    await msg.react('🇰');
  },
};
ReactionHandler.register(fuckCmd);

const shitCmd: Reaction = {
  name: 'shit-detector',
  suppressTyping: true,
  cooldown: COOLDOWNS.SHORT,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => shitRegex.test(msg.content),
  execute: async (msg) => {
    await msg.react('💩');
  },
};
ReactionHandler.register(shitCmd);

const assCmd: Reaction = {
  name: 'ass-detector',
  suppressTyping: true,
  cooldown: COOLDOWNS.SHORT,
  probability: PROBABILITIES.ALWAYS,
  test: (msg) => assRegex.test(msg.content),
  execute: async (msg) => {
    await msg.react(emojiIds.Butt);
  },
};
ReactionHandler.register(assCmd);
