// Spell numbers out as words so the speech engine says "three" rather than
// trying to pronounce the glyph "3". Letters are spoken as their name (the
// engine pronounces uppercase "A" as "ay", "B" as "bee", and so on).
const DIGIT_WORDS: Record<string, string> = {
  "0": "zero",
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
};

/** The text the speech engine should pronounce for a given character. */
export function spokenText(char: string): string {
  return DIGIT_WORDS[char] ?? char.toUpperCase();
}
