const denyColors = new Set([
  "lightBlue",
  "warmGray",
  "trueGray",
  "coolGray",
  "blueGray",
]);
/**
 * Tailwind shows a deprecated warning if you use colors directly.
 * So we need to filter out the colors that are not allowed.
 * The warning is shown on property access, so we need to filter using this method
 */
export const allowedColors = ({ colors }: any) => {
  const _colors: Record<string, unknown> = {};
  for (const color of Object.keys(colors)) {
    if (denyColors.has(color)) {
      continue;
    }
    _colors[color] = colors[color];
  }
  return _colors;
};

export const isWeb =
  process.env.NATIVEWIND_OS === undefined ||
  process.env.NATIVEWIND_OS === "web";
