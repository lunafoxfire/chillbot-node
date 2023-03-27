import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { SlashCommand } from 'bot/types';
import SlashCommandHandler from '../SlashCommandHandler';
import { ArgumentError } from 'util/errors';

const cmd: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls some dice.')
    .addStringOption((option) => option
      .setName('expression')
      .setDescription('An expression in d20 notation.')
      .setRequired(true),
    ),
  execute: handler,
};

async function handler(interaction: ChatInputCommandInteraction) {
  const input = interaction.options.getString('expression', true);
  const rollGroups = parseD20String(input);
  const { grandTotal, resultsString } = evaluateRolls(rollGroups);

  const text = `${interaction.user} rolls: ${input}`;

  if (input === 'd20' && grandTotal === 20) {
    await interaction.reply(`${text}\n=> 20\nCritical! ᕦ(ò_óˇ)ᕤ`);
    return;
  }
  if (input === 'd20' && grandTotal === 1) {
    await interaction.reply(`${text}\n=> 1\nFail! (┛ಠ_ಠ)┛彡┻━┻`);
    return;
  }
  if (resultsString) {
    await interaction.reply(`${text}\n=> ${grandTotal}\n\n${resultsString}`);
    return;
  }
  await interaction.reply(`${text}\n=> ${grandTotal}`);
}

const d20Expression = /^[ ]*[+-]?\d*d?\d+(?:[ ]*[+-][ ]*\d*d?\d+)*$/;
const d20Term = /^(\d*)d?(\d*)$/;

type RollGroup = {
  numberOfDice: number,
  dieSize: number,
  negative: boolean,
};

type RollResult = {
  rollGroup: RollGroup,
  values: number[] | null,
  total: number,
};

type ExpressionResults = {
  rolls: RollResult[],
  resultsString: string | null,
  grandTotal: number,
};

function parseD20String(str: string): RollGroup[] {
  if (!d20Expression.test(str)) {
    throw new ArgumentError('Invalid d20 expression');
  }
  const terms = str
    .replace(/[+-]/g, ' $& ')
    .trim()
    .split(/ +/);

  if (!['+', '-'].includes(terms[0])) {
    terms.unshift('+');
  }

  const results: RollGroup[] = [];
  for (let i = 0; i < terms.length; i += 2) {
    // 5d6 => [, 5, 6]
    // d6 => [,, 6]
    // 5 => [, 5,]
    const sign = terms[i];
    const match = terms[i + 1].match(d20Term);
    if (!match) {
      throw new ArgumentError('Invalid d20 expression');
    }

    let numberOfDice = parseInt(match[1], 10);
    let dieSize = parseInt(match[2], 10);
    const negative = sign === '-';
    if (Number.isNaN(numberOfDice)) {
      numberOfDice = 1;
    }
    if (Number.isNaN(dieSize)) {
      dieSize = 1;
    }
    if (dieSize === 0) {
      throw new ArgumentError('Invalid d20 expression');
    }
    if (numberOfDice > 999999 || dieSize > 999999999999) {
      throw new ArgumentError('˚‧º·(˚ ˃̣̣̥⌓˂̣̣̥ )‧º·˚ Too big!');
    }
    results.push({ numberOfDice, dieSize, negative });
  }
  return results;
}

function evaluateRolls(rollGroups: RollGroup[]): ExpressionResults {
  let grandTotal = 0;
  let numRolls = 0;
  let showRolls = true;
  const rollResultsStrings: string[] = [];
  const rolls = rollGroups.map((rollGroup) => {
    const { numberOfDice, dieSize, negative } = rollGroup;
    let total = 0;
    let values: any = [];

    if (dieSize === 1) {
      values = null;
      total = negative ? -numberOfDice : numberOfDice;
    } else {
      for (let i = 0; i < numberOfDice; i++) {
        const result = Math.floor(Math.random() * dieSize) + 1;
        total += result;
        values.push(result);
        numRolls++;
      }
      total = negative ? -total : total;
      if (numRolls <= 50) {
        rollResultsStrings.push(`${numberOfDice > 1 ? numberOfDice : ''}d${dieSize}: [${values.join(', ')}]`);
      } else {
        showRolls = false;
      }
      grandTotal += total;
    }
    return {
      rollGroup,
      values,
      total,
    };
  });
  let resultsString = null;
  if (showRolls && numRolls > 1) {
    resultsString = rollResultsStrings.join('\n');
  }
  return {
    rolls,
    resultsString,
    grandTotal,
  };
}

SlashCommandHandler.register(cmd);
