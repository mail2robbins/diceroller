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
            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl font-display">
              Dice Roller
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Choose how many dice you want, then roll in fullscreen.
            </p>
          </header>

          <DiceCountSelector value={diceCount} onChange={setDiceCount} />

          <label className="flex cursor-pointer items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            />
            Sound on roll
          </label>

          <button
            type="button"
            onClick={() => setInSession(true)}
            className="h-14 w-full rounded-2xl bg-[var(--gradient-accent)] text-lg font-semibold text-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-accent)]/20 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] font-display"
          >
            Start rolling
          </button>

          <button
            type="button"
            onClick={() => setMode("home")}
            className="h-12 w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-base font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
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
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl font-display">
            Random Rollers
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Choose a roller type to get started
          </p>
        </header>

        <div className="grid gap-4">
          <button
            type="button"
            onClick={() => setMode("dice")}
            className="flex h-24 items-center justify-center rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-6 text-left transition hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] font-display">🎲 Dice Roller</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Roll 1-12 dice with 3D animation</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("alphabet")}
            className="flex h-24 items-center justify-center rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-6 text-left transition hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] font-display">🔤 Alphabet Roller</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Random letter from A-Z</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("digit")}
            className="flex h-24 items-center justify-center rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-6 text-left transition hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)] font-display">🔢 Digit Roller</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Random number from 1 to n (max: 1000)</p>
            </div>
          </button>
        </div>

        <label className="flex cursor-pointer items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          />
          Sound on roll
        </label>
      </div>
    </div>
  );
}
