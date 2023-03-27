export const WHITESPACE_REGEX = /\s/;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function createWordRegex(target: string, caseSensitive: boolean = false): RegExp {
  return new RegExp(`(?:^|\\W)(${escapeRegex(target)})(?:$|\\W)`, caseSensitive ? undefined : 'i');
}

export function createMultiWordRegex(targets: string[], caseSensitive: boolean = false): RegExp {
  const target = targets.map((t) => `(?:${escapeRegex(t)})`).join('|');
  return new RegExp(`(?:^|\\W)(${target})(?:$|\\W)`, caseSensitive ? undefined : 'i');
}
