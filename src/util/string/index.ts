import { User } from 'discord.js';
import { ArgumentError } from 'util/errors';

export function isTruthy(str: string | undefined): boolean {
  return !!str && !(str.toLowerCase() === 'false');
}

export function getMentionString(user: User | null): string {
  if (!user) return '';
  return `<@!${user.id}>`;
}

export function parseArgList(str: string): string[] {
  if (!str || !str.length) {
    throw new ArgumentError();
  }

  const list: string[] = [];
  let argStartIndex: number | undefined = undefined;
  let insideQuote = false;

  for (let i = 0; i < str.length; i++) {
    if (argStartIndex === undefined) {
      if (str[i] === '"') {
        if (!(i === 0 || str[i - 1] === ' ') || i === str.length - 1) {
          throw new ArgumentError();
        }
        insideQuote = true;
        argStartIndex = i + 1;
      } else if (str[i] !== ' ') {
        if (!(i === 0 || str[i - 1] === ' ')) {
          throw new ArgumentError();
        }
        argStartIndex = i;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (str[i] === '"') {
        if (!(i === str.length - 1 || str[i + 1] === ' ') || !insideQuote) {
          throw new ArgumentError();
        }
        const arg = str.substring(argStartIndex, i);
        list.push(arg);
        insideQuote = false;
        argStartIndex = undefined;
      } else if (str[i] === ' ') {
        const arg = str.substring(argStartIndex, i - 1);
        list.push(arg);
        argStartIndex = undefined;
      }
    }
  }

  if (insideQuote) {
    throw new ArgumentError();
  }
  if (argStartIndex !== undefined) {
    const arg = str.substring(argStartIndex, str.length);
    list.push(arg);
    argStartIndex = undefined;
  }

  return list;
}
