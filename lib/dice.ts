export const VALID_DICE_COUNTS = [1, 2, 4, 6, 8, 10, 12] as const;

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
  if (value === 1 || value === 2) {
    return null;
  }
  if (value % 2 !== 0) {
    return "Above 2 dice, only even counts are allowed (4, 6, 8, 10, 12).";
  }
  if (!isValidDiceCount(value)) {
    return `Choose ${VALID_DICE_COUNTS.join(", ")}.`;
  }
  return null;
}

export function clampToValidDiceCount(value: number): DiceCount {
  if (isValidDiceCount(value)) return value;
  const sorted = [...VALID_DICE_COUNTS];
  let closest: DiceCount = 1;
  let minDiff = Infinity;
  for (const n of sorted) {
    const diff = Math.abs(n - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = n;
    }
  }
  return closest;
}

export function rollDice(count: DiceCount): number[] {
  return Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
}

export function sumValues(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
