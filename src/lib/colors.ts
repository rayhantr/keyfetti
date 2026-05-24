// Bright, high-contrast colours that pop against the dark background.
export const LETTER_COLORS = [
  "#FF5D5D",
  "#FF8A3D",
  "#FFD23D",
  "#7CFF5D",
  "#3DE0FF",
  "#5D8CFF",
  "#B45DFF",
  "#FF5DC4",
  "#5DFFB0",
  "#FF6FB5",
];

export function randomColor(): string {
  return LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)];
}
