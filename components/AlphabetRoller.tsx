"use client";

import { rollAlphabets } from "@/lib/dice";
import { useEffect, useState } from "react";

type AlphabetRollerProps = {
  onBack: () => void;
};

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function AlphabetRoller({ onBack }: AlphabetRollerProps) {
  const [currentLetter, setCurrentLetter] = useState<string>("");
  const [targetLetter, setTargetLetter] = useState<string>("");
  const [rolling, setRolling] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const [remainingLetters, setRemainingLetters] = useState<string[]>([...ALPHABETS]);
  const [completed, setCompleted] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);

  const handleRoll = () => {
    if (rolling) return;

    if (remainingLetters.length === 0) {
      setRemainingLetters([...ALPHABETS]);
      setCompleted(false);
      const shuffled = rollAlphabets();
      setTargetLetter(shuffled[0]);
      setRolling(true);
      setSpinIndex(0);
      setHasRolled(true);
      return;
    }

    const shuffled = rollAlphabets();
    const availableLetter = shuffled.find(letter => remainingLetters.includes(letter)) || remainingLetters[0];
    setTargetLetter(availableLetter);
    setRolling(true);
    setSpinIndex(0);
    setHasRolled(true);
  };

  const handleBack = () => {
    setRemainingLetters([...ALPHABETS]);
    setCompleted(false);
    setHasRolled(false);
    setCurrentLetter("");
    setTargetLetter("");
    onBack();
  };

  useEffect(() => {
    if (!rolling) return;

    const totalSpins = 30 + Math.floor(Math.random() * 10);
    const spinDuration = 1500;
    const intervalTime = spinDuration / totalSpins;

    const interval = setInterval(() => {
      setSpinIndex((prev) => {
        const next = prev + 1;
        if (next >= totalSpins) {
          setRolling(false);
          setCurrentLetter(targetLetter);
          setRemainingLetters(prev => {
            const newRemaining = prev.filter(letter => letter !== targetLetter);
            if (newRemaining.length === 0) {
              setCompleted(true);
            }
            return newRemaining;
          });
          return 0;
        }
        if (hasRolled) {
          setCurrentLetter(ALPHABETS[next % ALPHABETS.length]);
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [rolling, targetLetter, hasRolled]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-md flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl font-display">
            Alphabet Roller
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Random letter from A-Z
          </p>
        </header>

        <div className="flex items-center justify-center">
          <div
            className={`relative aspect-square w-full max-w-[20rem] rounded-2xl border-2 border-[var(--color-border)] bg-[var(--gradient-surface)] shadow-2xl shadow-black/50 transition-transform ${rolling ? "scale-95" : "scale-100"
              }`}
          >
            <div className="flex h-full items-center justify-center p-2">
              {!hasRolled ? (
                <span className="text-6xl sm:text-7xl font-light text-center text-[var(--color-text-secondary)] animate-pulse">
                  -
                </span>
              ) : (
                <span
                  className={`inline-block px-8 py-6 font-bold bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent text-[10rem] sm:text-[12rem] leading-none transition-all font-display select-none ${rolling ? "blur-sm opacity-70" : "blur-none opacity-100"
                    }`}
                >
                  {currentLetter}
                </span>
              )}
            </div>
          </div>
        </div>

        {completed && hasRolled && (
          <div className="rounded-lg border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 px-4 py-3 text-center">
            <p className="text-sm font-medium text-[var(--color-accent)]">
              🎉 You've completed all alphabets! Starting over...
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