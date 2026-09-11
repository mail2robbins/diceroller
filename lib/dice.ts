export const VALID_DICE_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type DiceCount = (typeof VALID_DICE_COUNTS)[number];

export type RollRecord = {
  id: string;
  timestamp: number;
  diceCount: DiceCount;
  values: number[];
  sum: number;
};

export const HISTORY_STORAGE_KEY = "dice-app-roll-history";
export const SOUND_ENABLED_KEY = "dice-app-sound-enabled";
export const MAX_HISTORY = 10;
export const ROLL_ANIMATION_MS = 700;

export function isValidDiceCount(value: number): value is DiceCount {
  return (VALID_DICE_COUNTS as readonly number[]).includes(value);
}

export function validationMessageForCount(value: number): string | null {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return "Enter a whole number of dice.";
  }
  if (value < 1) {
    return "You need at least one die.";
  }
  if (value > 12) {
    return "Maximum is 12 dice.";
  }
  if (!isValidDiceCount(value)) {
    return `Choose ${VALID_DICE_COUNTS.join(", ")}.`;
  }
  return null;
}

export function rollDice(count: DiceCount): number[] {
  return Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
}

export function sumValues(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function rollAlphabets(): string[] {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const shuffled = [...alphabets];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function rollDigits(max: number): number[] {
  if (max < 1 || max > 1000) {
    throw new Error("Max must be between 1 and 1000");
  }
  const digits = Array.from({ length: max }, (_, i) => i + 1);
  const shuffled = [...digits];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
