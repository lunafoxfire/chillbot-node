import { ArgumentType, Command } from 'bot/types';
import MessageHandler from 'bot/components/MessageHandler';
import { createCanvas } from 'canvas';
import GifEncoder from 'gifencoder';
import { MessageAttachment } from 'discord.js';
import { ArgumentError, BotError } from 'util/errors';
import { WHITESPACE_REGEX } from 'util/string/regex';

const NUM_FRAMES = 15;
const TIME = 1000;
const DELAY = TIME / NUM_FRAMES;
const FONT_SIZE = 50;
const FONT = `${FONT_SIZE}px sans`;
const LINE_HEIGHT = 1.15 * FONT_SIZE;
const LINE_BREAK_WIDTH = 500;
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 600;

const cmd: Command<ArgumentType.FullString> = {
  name: 'rainbow',
  description: 'Creates rainbow text',
  args: { name: 'text', description: 'The text to rainbow' },
  execute: async (msg, input) => {
    const canvas = createCanvas(0, 0);
    const ctx = canvas.getContext('2d');

    ctx.font = FONT;

    const lines: string[] = [];
    let currentLine = '';
    let maxWidth = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (WHITESPACE_REGEX.test(char)) {
        const lineWidth = ctx.measureText(currentLine).width;
        if (lineWidth >= LINE_BREAK_WIDTH) {
          if (lineWidth > maxWidth) {
            maxWidth = lineWidth;
          }
          lines.push(currentLine);
          currentLine = '';
          continue;
        }
      }
      currentLine += char;
    }
    if (currentLine) {
      const lineWidth = ctx.measureText(currentLine).width;
      if (lineWidth > maxWidth) {
        maxWidth = lineWidth;
      }
      lines.push(currentLine);
      currentLine = '';
    }

    if (!lines.length) {
      throw new ArgumentError();
    }

    const height = lines.length * LINE_HEIGHT;
    const width = maxWidth;

    if (height > MAX_HEIGHT || width > MAX_WIDTH) {
      throw new ArgumentError('˚‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚ Too big!');
    }

    canvas.width = width;
    canvas.height = height;

    const encoder = new GifEncoder(width, height);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(DELAY);
    encoder.setQuality(10);
    encoder.setTransparent('#000');

    // No idea why I have to do this again
    ctx.font = FONT;
    ctx.textBaseline = 'top';

    for (let f = 0; f < NUM_FRAMES; f++) {
      ctx.clearRect(0, 0, width, height);
      const hue = 360 * (f / NUM_FRAMES);
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        ctx.fillText(line, 0, i * LINE_HEIGHT);
      }
      encoder.addFrame(ctx);
    }

    encoder.finish();

    const attachment = new MessageAttachment(encoder.out.getData(), 'text.gif');
    await msg.reply({ files: [attachment] });
  },
};

MessageHandler.registerCommand(cmd);
