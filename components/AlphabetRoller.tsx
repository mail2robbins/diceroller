"use client";

import { rollAlphabets } from "@/lib/dice";
import { useEffect, useState } from "react";

type AlphabetRollerProps = {
  onBack: () => void;
};

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function AlphabetRoller({ onBack }: AlphabetRollerProps) {
  const [currentLetter, setCurrentLetter] = useState<string>("A");
  const [targetLetter, setTargetLetter] = useState<string>("A");
  const [rolling, setRolling] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);

  const handleRoll = () => {
    if (rolling) return;
    
    const shuffled = rollAlphabets();
    setTargetLetter(shuffled[0]);
    setRolling(true);
    setSpinIndex(0);
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
          return 0;
        }
        setCurrentLetter(ALPHABETS[next % ALPHABETS.length]);
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [rolling, targetLetter]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-md flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Alphabet Roller
          </h1>
          <p className="text-sm text-zinc-400">
            Random letter from A-Z
          </p>
        </header>

        <div className="flex items-center justify-center">
          <div
            className={`relative aspect-square w-full max-w-[20rem] rounded-2xl border-2 border-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl shadow-black/50 transition-transform ${
              rolling ? "scale-95" : "scale-100"
            }`}
          >
            <div className="flex h-full items-center justify-center">
              <span
                className={`text-8xl font-bold text-zinc-100 sm:text-9xl transition-all ${
                  rolling ? "blur-sm opacity-70" : "blur-none opacity-100"
                }`}
              >
                {currentLetter}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="h-14 flex-1 rounded-2xl border-2 border-zinc-700 bg-zinc-900 text-lg font-semibold text-zinc-300 transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleRoll}
            disabled={rolling}
            className="h-14 flex-[2] rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-lg font-semibold text-zinc-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-400 hover:to-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {rolling ? "Rolling…" : "Roll again"}
          </button>
        </div>
      </div>
    </div>
  );
}