export type KeyRow = { keys: string; offset: number };

// US QWERTY layout. `offset` is the horizontal stagger (in key-widths) that
// mimics how each row sits relative to the number row on a real keyboard, so a
// pressed letter can rise from roughly the same spot it occupies physically.
export const KEY_ROWS: KeyRow[] = [
  { keys: "1234567890", offset: 0 },
  { keys: "QWERTYUIOP", offset: 0.5 },
  { keys: "ASDFGHJKL", offset: 0.75 },
  { keys: "ZXCVBNM", offset: 1.25 },
];

// Approximate total key-widths spanned by the keyboard (number row + a little
// margin), used to normalize each key's centre into a 0..1 horizontal position.
const X_REFERENCE = 10.5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Pre-compute the normalized horizontal centre (0..1) of every key once.
const CHAR_X: Record<string, number> = {};
for (const row of KEY_ROWS) {
  for (let i = 0; i < row.keys.length; i++) {
    const centre = row.offset + i + 0.5;
    CHAR_X[row.keys[i]] = clamp(centre / X_REFERENCE, 0.05, 0.95);
  }
}

/** Normalized horizontal position (0..1) a character should rise from. */
export function charToX(char: string): number {
  return CHAR_X[char.toUpperCase()] ?? 0.5;
}

/** True for the only keys this app reacts to: letters and digits. */
export function isLetterOrDigit(char: string): boolean {
  return /^[a-z0-9]$/i.test(char);
}

/** True for an alphabetic character (so digits can skip case display). */
export function isLetter(char: string): boolean {
  return /^[a-z]$/i.test(char);
}
