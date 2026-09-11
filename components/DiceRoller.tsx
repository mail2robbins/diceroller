"use client";

import { AlphabetRoller } from "@/components/AlphabetRoller";
import { DiceCountSelector } from "@/components/DiceCountSelector";
import { DigitRoller } from "@/components/DigitRoller";
import { FullscreenRollView } from "@/components/FullscreenRollView";
import { useRollHistory } from "@/hooks/useRollHistory";
import type { DiceCount } from "@/lib/dice";
import { useState } from "react";

type RollerMode = "home" | "dice" | "alphabet" | "digit";

const INITIAL_COUNT: DiceCount = 2;

export function DiceRoller() {
  const { history, pushRoll, soundEnabled, setSoundEnabled, hydrated } =
    useRollHistory();
  const [diceCount, setDiceCount] = useState<DiceCount>(INITIAL_COUNT);
  const [inSession, setInSession] = useState(false);
  const [mode, setMode] = useState<RollerMode>("home");

  if (mode === "alphabet") {
    return <AlphabetRoller onBack={() => setMode("home")} />;
  }

  if (mode === "digit") {
    return <DigitRoller onBack={() => setMode("home")} />;
  }

  if (mode === "dice") {
    if (inSession) {
      return (
        <FullscreenRollView
          diceCount={diceCount}
          soundEnabled={soundEnabled}
          history={history}
          hydrated={hydrated}
          onBack={() => setInSession(false)}
          onRollComplete={pushRoll}
        />
      );
    }

    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="flex w-full max-w-md flex-col gap-8">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              Dice Roller
            </h1>
            <p className="text-sm text-zinc-400">
              Choose how many dice you want, then roll in fullscreen.
            </p>
          </header>

          <DiceCountSelector value={diceCount} onChange={setDiceCount} />

          <label className="flex cursor-pointer items-center justify-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            />
            Sound on roll
          </label>

          <button
            type="button"
            onClick={() => setInSession(true)}
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-lg font-semibold text-zinc-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-400 hover:to-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            Start rolling
          </button>

          <button
            type="button"
            onClick={() => setMode("home")}
            className="h-12 w-full rounded-xl border-2 border-zinc-700 bg-zinc-900 text-base font-medium text-zinc-300 transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            ← Back to menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-md flex-col gap-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Random Rollers
          </h1>
          <p className="text-sm text-zinc-400">
            Choose a roller type to get started
          </p>
        </header>

        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => setMode("dice")}
            className="flex h-24 items-center justify-center rounded-2xl border-2 border-zinc-700 bg-zinc-900/50 px-6 text-left transition hover:border-amber-500 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">🎲 Dice Roller</h2>
              <p className="text-sm text-zinc-400">Roll 1-12 dice with 3D animation</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("alphabet")}
            className="flex h-24 items-center justify-center rounded-2xl border-2 border-zinc-700 bg-zinc-900/50 px-6 text-left transition hover:border-amber-500 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">🔤 Alphabet Roller</h2>
              <p className="text-sm text-zinc-400">Random letter from A-Z</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("digit")}
            className="flex h-24 items-center justify-center rounded-2xl border-2 border-zinc-700 bg-zinc-900/50 px-6 text-left transition hover:border-amber-500 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">🔢 Digit Roller</h2>
              <p className="text-sm text-zinc-400">Random number from 1 to n (max: 1000)</p>
            </div>
          </button>
        </div>

        <label className="flex cursor-pointer items-center justify-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          />
          Sound on roll
        </label>
      </div>
    </div>
  );
}
