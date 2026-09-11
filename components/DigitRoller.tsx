"use client";

import { rollDigits } from "@/lib/dice";
import { useEffect, useState } from "react";

type DigitRollerProps = {
  onBack: () => void;
};

export function DigitRoller({ onBack }: DigitRollerProps) {
  const [max, setMax] = useState(10);
  const [currentDigit, setCurrentDigit] = useState<number>(1);
  const [targetDigit, setTargetDigit] = useState<number>(1);
  const [rolling, setRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spinIndex, setSpinIndex] = useState(0);

  const handleRoll = () => {
    if (max < 1 || max > 1000) {
      setError("Max must be between 1 and 1000");
      return;
    }
    if (rolling) return;
    
    setError(null);
    const shuffled = rollDigits(max);
    setTargetDigit(shuffled[0]);
    setRolling(true);
    setSpinIndex(0);
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
    const shuffled = rollDigits(num);
    setCurrentDigit(shuffled[0]);
    setTargetDigit(shuffled[0]);
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
          setCurrentDigit(targetDigit);
          return 0;
        }
        setCurrentDigit((next % max) + 1);
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [rolling, targetDigit, max]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-md flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Digit Roller
          </h1>
          <p className="text-sm text-zinc-400">
            Random number from 1 to n (max: 1000)
          </p>
        </header>

        <div className="space-y-3">
          <label
            htmlFor="max-input"
            className="block text-sm font-medium text-zinc-300"
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
              className="h-11 flex-1 rounded-lg border border-zinc-600 bg-zinc-800 px-3 text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              placeholder="Enter max number"
            />
            <button
              type="button"
              onClick={() => {
                const shuffled = rollDigits(max);
                setCurrentDigit(shuffled[0]);
                setTargetDigit(shuffled[0]);
              }}
              disabled={rolling}
              className="h-11 rounded-lg border border-zinc-600 bg-zinc-800 px-4 text-sm font-medium text-zinc-200 hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:opacity-40"
            >
              Apply
            </button>
          </div>
          {error && (
            <p className="rounded-lg border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm text-amber-200">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div
            className={`relative aspect-square w-full max-w-[20rem] rounded-2xl border-2 border-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl shadow-black/50 transition-transform ${
              rolling ? "scale-95" : "scale-100"
            }`}
          >
            <div className="flex h-full items-center justify-center">
              <span
                className={`text-7xl font-bold text-zinc-100 sm:text-8xl transition-all ${
                  rolling ? "blur-sm opacity-70" : "blur-none opacity-100"
                }`}
              >
                {currentDigit}
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