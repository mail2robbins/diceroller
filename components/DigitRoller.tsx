"use client";

import { rollDigits } from "@/lib/dice";
import { playRollCompleteSound } from "@/lib/sound";
import { useEffect, useState } from "react";

type DigitRollerProps = {
  onBack: () => void;
  soundEnabled?: boolean;
};

export function DigitRoller({ onBack, soundEnabled = true }: DigitRollerProps) {
  const [max, setMax] = useState(25);
  const [currentDigit, setCurrentDigit] = useState<number>(0);
  const [targetDigit, setTargetDigit] = useState<number>(0);
  const [rolling, setRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingDigits, setRemainingDigits] = useState<number[]>(() =>
    Array.from({ length: 25 }, (_, i) => i + 1),
  );
  const [completed, setCompleted] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);

  const handleRoll = () => {
    if (max < 1 || max > 1000) {
      setError("Max must be between 1 and 1000");
      return;
    }
    if (rolling) return;

    setError(null);

    if (remainingDigits.length === 0) {
      const digits = Array.from({ length: max }, (_, i) => i + 1);
      setRemainingDigits(digits);
      setCompleted(false);
      const shuffled = rollDigits(max);
      setTargetDigit(shuffled[0]);
      setRolling(true);
      setHasRolled(true);
      return;
    }

    const shuffled = rollDigits(max);
    const availableDigit = shuffled.find(digit => remainingDigits.includes(digit)) || remainingDigits[0];
    setTargetDigit(availableDigit);
    setRolling(true);
    setHasRolled(true);
  };

  const handleBack = () => {
    const digits = Array.from({ length: max }, (_, i) => i + 1);
    setRemainingDigits(digits);
    setCompleted(false);
    setHasRolled(false);
    setCurrentDigit(0);
    setTargetDigit(0);
    onBack();
  };

  const handleMaxChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setError("Please enter a valid number");
      return;
    }
    if (num < 1 || num > 1000) {
      setError("Max must be between 1 and 1000");
      return;
    }
    setError(null);
    setMax(num);
    const digits = Array.from({ length: num }, (_, i) => i + 1);
    setRemainingDigits(digits);
    setCompleted(false);
    setHasRolled(false);
    setCurrentDigit(0);
    setTargetDigit(0);
  };

  useEffect(() => {
    if (!rolling) return;

    const totalSpins = 30 + Math.floor(Math.random() * 10);
    const spinDuration = 1500;
    const intervalTime = spinDuration / totalSpins;
    let spinCount = 0;

    const interval = setInterval(() => {
      spinCount += 1;
      if (spinCount >= totalSpins) {
        clearInterval(interval);
        setRolling(false);
        setCurrentDigit(targetDigit);
        if (soundEnabled) {
          playRollCompleteSound();
        }
        setRemainingDigits(prev => {
          const newRemaining = prev.filter(digit => digit !== targetDigit);
          if (newRemaining.length === 0) {
            setCompleted(true);
          }
          return newRemaining;
        });
        return;
      }
      if (hasRolled) {
        setCurrentDigit((spinCount % max) + 1);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [rolling, targetDigit, max, hasRolled, soundEnabled]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-md flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl font-display">
            Digit Roller
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Random number from 1 to n (max: 1000)
          </p>
        </header>

        <div className="space-y-3">
          <label
            htmlFor="max-input"
            className="block text-sm font-medium text-[var(--color-text-secondary)]"
          >
            Maximum number (1-1000)
          </label>
          <div className="flex gap-2">
            <input
              id="max-input"
              type="number"
              min={1}
              max={1000}
              value={max}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="h-11 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              placeholder="Enter max number"
            />
            <button
              type="button"
              onClick={() => {
                const digits = Array.from({ length: max }, (_, i) => i + 1);
                setRemainingDigits(digits);
                setCompleted(false);
                setHasRolled(false);
                setCurrentDigit(0);
                setTargetDigit(0);
              }}
              disabled={rolling}
              className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-40"
            >
              Apply
            </button>
          </div>
          {error && (
            <p className="rounded-lg border border-[var(--color-error)]/50 bg-[var(--color-error)]/10 px-3 py-2 text-sm text-[var(--color-error)]">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div
            className={`relative aspect-square w-full max-w-[20rem] rounded-2xl border-2 border-[var(--color-border)] bg-[var(--gradient-surface)] shadow-2xl shadow-black/50 transition-transform ${rolling ? "scale-95" : "scale-100"
              }`}
          >
            <div className="flex h-full items-center justify-center p-8">
              {!hasRolled ? (
                <span className="text-6xl sm:text-7xl font-light text-center text-[var(--color-text-secondary)] animate-pulse">
                  -
                </span>
              ) : (
                <span
                  className={`inline-block px-8 py-6 font-bold bg-gradient-to-br from-yellow-500 via-green-400 to-blue-500 bg-clip-text text-transparent leading-none transition-all font-display select-none ${max >= 1000
                    ? "text-[8rem] sm:text-[10rem]"
                    : max >= 100
                      ? "text-[10rem] sm:text-[12rem]"
                      : "text-[12rem] sm:text-[14rem]"
                    } ${rolling ? "blur-sm opacity-70" : "blur-none opacity-100"
                    }`}
                >
                  {currentDigit}
                </span>
              )}
            </div>
          </div>
        </div>

        {completed && hasRolled && (
          <div className="rounded-lg border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 px-4 py-3 text-center">
            <p className="text-sm font-medium text-[var(--color-accent)]">
              🎉 You&apos;ve completed all digits! Starting over...
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="h-14 flex-1 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-lg font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleRoll}
            disabled={rolling}
            className="h-14 flex-[2] rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-lg font-semibold text-zinc-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-400 hover:to-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50 font-display"
          >
            {rolling ? "Rolling…" : !hasRolled ? "Roll" : completed ? "Start over" : "Roll again"}
          </button>
        </div>
      </div>
    </div>
  );
}