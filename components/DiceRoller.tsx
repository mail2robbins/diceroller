"use client";

import { DiceCountSelector } from "@/components/DiceCountSelector";
import { FullscreenRollView } from "@/components/FullscreenRollView";
import { useRollHistory } from "@/hooks/useRollHistory";
import type { DiceCount } from "@/lib/dice";
import { useState } from "react";

const INITIAL_COUNT: DiceCount = 2;

export function DiceRoller() {
  const { history, pushRoll, soundEnabled, setSoundEnabled, hydrated } =
    useRollHistory();
  const [diceCount, setDiceCount] = useState<DiceCount>(INITIAL_COUNT);
  const [inSession, setInSession] = useState(false);

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
      </div>
    </div>
  );
}
