import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { parseGIF, decompressFrames, type ParsedFrame } from 'gifuct-js';
import GifEncoder from 'gifencoder';
import { SlashCommandBuilder, AttachmentBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { SlashCommand } from 'bot/types';
import SlashCommandHandler from '../SlashCommandHandler';
import { ArgumentError, BotError } from 'util/errors';
import { SRC_DIRECTORY } from 'util/import';

const NUM_FRAMES = 14;
const LINE_HEIGHT = 80;
const LINE_BREAK_WIDTH = 400;
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;
const DIRECTORY = path.join(SRC_DIRECTORY, '../assets/letters');

const GIFS: any = {
  'a': 'a.gif',
  'b': 'b.gif',
  'c': 'c.gif',
  'd': 'd.gif',
  'e': 'e.gif',
  'f': 'f.gif',
  'g': 'g.gif',
  'h': 'h.gif',
  'i': 'i.gif',
  'j': 'j.gif',
  'k': 'k.gif',
  'l': 'l.gif',
  'm': 'm.gif',
  'n': 'n.gif',
  'o': 'o.gif',
  'p': 'p.gif',
  'q': 'q.gif',
  'r': 'r.gif',
  's': 's.gif',
  't': 't.gif',
  'u': 'u.gif',
  'v': 'v.gif',
  'w': 'w.gif',
  'x': 'x.gif',
  'y': 'y.gif',
  'z': 'z.gif',
  '0': '0.gif',
  '1': '1.gif',
  '2': '2.gif',
  '3': '3.gif',
  '4': '4.gif',
  '5': '5.gif',
  '6': '6.gif',
  '7': '7.gif',
  '8': '8.gif',
  '9': '9.gif',
  '!': '!.gif',
  '$': '$.gif',
  '&': '&.gif',
  '@': '@.gif',
};

const EXTRA_PUNCTUATION: any = {
  ' ': { width: 40 },
  '.': { width: 0 },
  '?': { width: 0 },
  ',': { width: 0 },
};

type GifData = {
  frames: ParsedFrame[],
  width: number,
  height: number,
};

const cmd: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('dance-letters')
    .setDescription('Turns a message into dancing letters.')
    .addStringOption((option) => option
      .setName('text')
      .setDescription('The text to convert.')
      .setRequired(true),
    ),
  execute: handler,
};

async function handler(interaction: ChatInputCommandInteraction) {
  const input = interaction.options.getString('text', true);
  const normalizedInput = input.toLowerCase();

  let cleanedMessage = '';
  const requiredGifs: any = {};
  for (let i = 0; i < normalizedInput.length; i++) {
    const char = normalizedInput[i];
    if (GIFS[char]) {
      requiredGifs[char] = GIFS[char];
      cleanedMessage += char;
    } else if (EXTRA_PUNCTUATION[char]) {
      cleanedMessage += char;
    }
  }

  if (!cleanedMessage.length) {
    throw new ArgumentError('Invalid message');
  }

  const gifData: Record<string, GifData> = {};
  try {
    const promises = Object.entries<any>(requiredGifs)
      .map(async ([char, filename]) => new Promise<void>((resolve, reject) => {
        fs.readFile(path.join(DIRECTORY, filename), null, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          try {
            const gif = parseGIF(data);
            const frames = decompressFrames(gif, true);
            gifData[char] = {
              frames,
              width: frames[0].dims.width,
              height: frames[0].dims.height,
            };
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }));

    await Promise.all(promises);
  } catch (e) {
    throw new BotError();
  }

  const words = cleanedMessage.split(' ');
  const { lines, width, height } = calculateLines(words, gifData);

  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    throw new ArgumentError('˚‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚ Too big!');
  }

  const encoder = new GifEncoder(width, height);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(150);
  encoder.setQuality(10);
  encoder.setTransparent('#000');

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < NUM_FRAMES; f++) {
    let x = 0;
    let y = 0;
    for (const line of lines) {
      const lineText = line.join(' ');
      for (let i = 0; i < lineText.length; i++) {
        const char = lineText[i];
        const data = gifData[char];
        if (data) {
          const frame = data.frames[f];
          if (frame.disposalType === 2) {
            ctx.clearRect(x, y, data.height, data.height);
          }
          const imgData = ctx.createImageData(frame.dims.width, frame.dims.height);
          imgData.data.set(frame.patch);
          ctx.putImageData(imgData, x + frame.dims.left, y + frame.dims.top);
          x += data.width;
        } else if (EXTRA_PUNCTUATION[char]) {
          x += EXTRA_PUNCTUATION[char].width;
        }
      }
      x = 0;
      y += LINE_HEIGHT;
    }
    encoder.addFrame((ctx as any));
  }
  encoder.finish();

  const attachment = new AttachmentBuilder(encoder.out.getData(), { name: 'dancin.gif' });
  await interaction.reply({ files: [attachment] });
}

function calculateLines(words: string[], gifData: Record<string, GifData>): { lines: string[][], width: number, height: number } {
  const lines: string[][] = [];
  let width = 0;
  let height = 0;

  let currentLineWidth = 0;
  let currentLineWords: string[] = [];

  function newline() {
    lines.push(currentLineWords);
    currentLineWords = [];
    if (width < currentLineWidth) {
      width = currentLineWidth;
    }
    currentLineWidth = 0;
    height += LINE_HEIGHT;
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentLineWords.push(word);
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const data = gifData[char];
      if (data) {
        currentLineWidth += data.width;
      } else if (EXTRA_PUNCTUATION[char]) {
        currentLineWidth += EXTRA_PUNCTUATION[char].width;
      }
    }
    if (currentLineWidth >= LINE_BREAK_WIDTH) {
      newline();
    } else {
      currentLineWidth += EXTRA_PUNCTUATION[' '].width;
    }
  }
  if (currentLineWidth > 0) {
    newline();
  }

  return { lines, width, height };
}


SlashCommandHandler.register(cmd);
