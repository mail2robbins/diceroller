"use client";

import { Die3D } from "@/components/Die3D";
import { RollHistoryList } from "@/components/RollHistoryList";
import type { RollRecord } from "@/lib/dice";
import { rollDice, sumValues, type DiceCount } from "@/lib/dice";
import { playRollCompleteSound } from "@/lib/sound";
import { useCallback, useEffect, useRef, useState } from "react";

type FullscreenRollViewProps = {
  diceCount: DiceCount;
  soundEnabled: boolean;
  history: RollRecord[];
  hydrated: boolean;
  onBack: () => void;
  onRollComplete: (record: RollRecord) => void;
};

function gridClassForCount(count: number): string {
  if (count <= 2) return "grid-cols-2 max-w-sm";
  if (count <= 4) return "grid-cols-2 sm:grid-cols-4 max-w-lg";
  if (count <= 6) return "grid-cols-3 sm:grid-cols-6 max-w-3xl";
  return "grid-cols-4 sm:grid-cols-6 max-w-4xl";
}

export function FullscreenRollView({
  diceCount,
  soundEnabled,
  history,
  hydrated,
  onBack,
  onRollComplete,
}: FullscreenRollViewProps) {
  const [targets, setTargets] = useState<number[]>(() =>
    Array.from({ length: diceCount }, () => 1),
  );
  const [rollToken, setRollToken] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [lastRollAnnouncement, setLastRollAnnouncement] = useState("");
  const settledCountRef = useRef(0);
  const soundPlayedRef = useRef(false);
  const targetsRef = useRef(targets);
  targetsRef.current = targets;

  const startRoll = useCallback(() => {
    if (animating) return;
    const result = rollDice(diceCount);
    targetsRef.current = result;
    setTargets(result);
    setAnimating(true);
    settledCountRef.current = 0;
    soundPlayedRef.current = false;
    setRollToken((t) => t + 1);
  }, [animating, diceCount]);

  useEffect(() => {
    const result = rollDice(diceCount);
    targetsRef.current = result;
    setTargets(result);
    setAnimating(true);
    setRollToken(1);
  }, [diceCount]);

  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden");
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, []);

  const handleDieSettled = useCallback(() => {
    settledCountRef.current += 1;
    if (settledCountRef.current < diceCount) return;

    setAnimating(false);

    const values = targetsRef.current;
    const record: RollRecord = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      diceCount,
      values,
      sum: sumValues(values),
    };
    onRollComplete(record);
    setLastRollAnnouncement(
      `Roll complete. ${values.map((v, i) => `Die ${i + 1}: ${v}`).join(". ")}.`,
    );

    if (soundEnabled && !soundPlayedRef.current) {
      soundPlayedRef.current = true;
      playRollCompleteSound();
    }
  }, [diceCount, onRollComplete, soundEnabled]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-roll-title"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          disabled={animating}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:opacity-50"
        >
          ← Change dice
        </button>
        <p
          id="fullscreen-roll-title"
          className="text-sm font-medium text-zinc-400"
        >
          {diceCount} {diceCount === 1 ? "die" : "dice"}
        </p>
        <button
          type="button"
          onClick={() => setHistoryOpen((open) => !open)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          aria-expanded={historyOpen}
          aria-controls="roll-history-panel"
        >
          {historyOpen ? "Hide history" : "History"}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {animating ? "Rolling dice." : lastRollAnnouncement}
        </p>
        <div
          className={`grid w-full justify-items-center gap-4 sm:gap-6 ${gridClassForCount(diceCount)}`}
        >
          {targets.map((_, i) => (
            <Die3D
              key={i}
              targetValue={targets[i]}
              rollToken={rollToken}
              index={i}
              onSettled={handleDieSettled}
            />
          ))}
        </div>
      </div>

      <footer className="shrink-0 space-y-4 border-t border-zinc-800/80 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={startRoll}
          disabled={animating}
          className="h-14 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-lg font-semibold text-zinc-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-400 hover:to-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={animating}
        >
          {animating ? "Rolling…" : "Roll again"}
        </button>
        {historyOpen ? (
          <div id="roll-history-panel">
            <RollHistoryList history={history} hydrated={hydrated} />
          </div>
        ) : null}
      </footer>
    </div>
  );
}
