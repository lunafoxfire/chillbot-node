export function borderedText(lines: string[], borderChar: string): string {
  const maxLineLength = lines.reduce((currentMax, line) => {
    if (line.length > currentMax) {
      return line.length;
    }
    return currentMax;
  }, 0);

  const horizBorder = borderChar.repeat(maxLineLength + 8);
  const borderedLines = lines.map((line) => {
    const paddingLength = maxLineLength - line.length + 2;
    const padding = " ".repeat(paddingLength);
    return `${borderChar}${borderChar}  ${line}${padding}${borderChar}${borderChar}`;
  });
  return [horizBorder, ...borderedLines, horizBorder].join("\n");
}
